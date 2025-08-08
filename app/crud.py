from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from typing import List, Optional

from . import models, schemas

# Suppliers
def create_supplier(db: Session, data: schemas.SupplierCreate) -> models.Supplier:
    supplier = models.Supplier(**data.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

def list_suppliers(db: Session) -> List[models.Supplier]:
    return db.query(models.Supplier).order_by(models.Supplier.nome).all()

def get_supplier(db: Session, supplier_id: int) -> models.Supplier:
    supplier = db.get(models.Supplier, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")
    return supplier

def update_supplier(db: Session, supplier_id: int, data: schemas.SupplierUpdate) -> models.Supplier:
    supplier = get_supplier(db, supplier_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(supplier, k, v)
    db.commit()
    db.refresh(supplier)
    return supplier

def delete_supplier(db: Session, supplier_id: int):
    supplier = get_supplier(db, supplier_id)
    if supplier.produtos:
        raise HTTPException(status_code=400, detail="Fornecedor possui produtos associados.")
    db.delete(supplier)
    db.commit()

# Products
def is_low_stock(product: models.Product) -> bool:
    return product.quantidade <= product.estoque_minimo

def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    product = models.Product(**data.model_dump())
    db.add(product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Código do produto já existe.")
    db.refresh(product)
    return product

def list_products(
    db: Session,
    nome: Optional[str]=None,
    categoria: Optional[str]=None,
    fornecedor_id: Optional[int]=None,
    low_stock: Optional[bool]=None
) -> List[models.Product]:
    q = db.query(models.Product)
    if nome:
        q = q.filter(models.Product.nome.ilike(f"%{nome}%"))
    if categoria:
        q = q.filter(models.Product.categoria == categoria)
    if fornecedor_id:
        q = q.filter(models.Product.fornecedor_id == fornecedor_id)
    if low_stock is True:
        q = q.filter(models.Product.quantidade <= models.Product.estoque_minimo)
    return q.order_by(models.Product.nome).all()

def get_product(db: Session, product_id: int) -> models.Product:
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return product

def update_product(db: Session, product_id: int, data: schemas.ProductUpdate) -> models.Product:
    product = get_product(db, product_id)
    payload = data.model_dump(exclude_unset=True)

    # Se quiser ajustar estoque via PUT de produto (opcional)
    if "quantidade" in payload:
        new_qty = payload["quantidade"]
        if new_qty < 0:
            raise HTTPException(status_code=400, detail="Quantidade não pode ser negativa.")
        diff = abs(new_qty - product.quantidade)
        product.quantidade = new_qty
        _create_movement(db, product, models.MovementType.ADJUST, diff, "Ajuste via atualização de produto")
        del payload["quantidade"]

    for k, v in payload.items():
        setattr(product, k, v)

    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int):
    product = get_product(db, product_id)
    db.delete(product)
    db.commit()

# Stock movements
def _create_movement(db: Session, product: models.Product, tipo: models.MovementType, qtd_alterada: int, motivo: Optional[str]):
    movement = models.StockMovement(
        produto_id=product.id,
        tipo=tipo,
        quantidade_alterada=qtd_alterada,
        quantidade_resultante=product.quantidade,
        motivo=motivo
    )
    db.add(movement)

def add_stock(db: Session, product_id: int, quantidade: int, motivo: Optional[str]) -> models.Product:
    product = get_product(db, product_id)
    product.quantidade += quantidade
    _create_movement(db, product, models.MovementType.IN, quantidade, motivo or "Entrada de estoque")
    db.commit()
    db.refresh(product)
    return product

def remove_stock(db: Session, product_id: int, quantidade: int, motivo: Optional[str]) -> models.Product:
    product = get_product(db, product_id)
    if quantidade > product.quantidade:
        raise HTTPException(status_code=400, detail="Quantidade solicitada maior que o estoque disponível.")
    product.quantidade -= quantidade
    _create_movement(db, product, models.MovementType.OUT, quantidade, motivo or "Saída de estoque")
    db.commit()
    db.refresh(product)
    return product

def set_stock(db: Session, product_id: int, new_quantidade: int, motivo: Optional[str]) -> models.Product:
    product = get_product(db, product_id)
    if new_quantidade < 0:
        raise HTTPException(status_code=400, detail="Quantidade não pode ser negativa.")
    diff = abs(product.quantidade - new_quantidade)
    product.quantidade = new_quantidade
    _create_movement(db, product, models.MovementType.ADJUST, diff, motivo or "Ajuste manual de estoque")
    db.commit()
    db.refresh(product)
    return product

def list_movements(db: Session, product_id: int) -> List[models.StockMovement]:
    get_product(db, product_id)  # valida existência
    return db.query(models.StockMovement).filter(models.StockMovement.produto_id == product_id).order_by(models.StockMovement.criado_em.desc()).all()

