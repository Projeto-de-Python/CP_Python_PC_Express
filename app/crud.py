from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas


# Suppliers
def create_supplier(
    db: Session, data: schemas.SupplierCreate, user_id: int
) -> models.Supplier:
    supplier = models.Supplier(**data.model_dump(), user_id=user_id)
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


def list_suppliers(db: Session, user_id: int) -> List[models.Supplier]:
    return (
        db.query(models.Supplier)
        .filter(models.Supplier.user_id == user_id)
        .order_by(models.Supplier.nome)
        .all()
    )


def get_supplier(db: Session, supplier_id: int, user_id: int) -> models.Supplier:
    supplier = (
        db.query(models.Supplier)
        .filter(models.Supplier.id == supplier_id, models.Supplier.user_id == user_id)
        .first()
    )
    if not supplier:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")
    return supplier


def update_supplier(
    db: Session, supplier_id: int, data: schemas.SupplierUpdate, user_id: int
) -> models.Supplier:
    supplier = get_supplier(db, supplier_id, user_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(supplier, k, v)
    db.commit()
    db.refresh(supplier)
    return supplier


def delete_supplier(db: Session, supplier_id: int, user_id: int):
    supplier = get_supplier(db, supplier_id, user_id)
    if supplier.produtos:
        raise HTTPException(
            status_code=400, detail="Fornecedor possui produtos associados."
        )
    db.delete(supplier)
    db.commit()


# Products


def create_product(
    db: Session, data: schemas.ProductCreate, user_id: int
) -> models.Product:
    product = models.Product(**data.model_dump(), user_id=user_id)
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
    user_id: int,
    nome: Optional[str] = None,
    categoria: Optional[str] = None,
    fornecedor_id: Optional[int] = None,
    low_stock: Optional[bool] = None,
) -> List[models.Product]:
    q = db.query(models.Product).filter(models.Product.user_id == user_id)
    if nome:
        q = q.filter(models.Product.nome.ilike(f"%{nome}%"))
    if categoria:
        q = q.filter(models.Product.categoria == categoria)
    if fornecedor_id:
        q = q.filter(models.Product.fornecedor_id == fornecedor_id)
    if low_stock is True:
        q = q.filter(models.Product.quantidade <= models.Product.estoque_minimo)
    return q.order_by(models.Product.nome).all()


def get_product(db: Session, product_id: int, user_id: int) -> models.Product:
    product = (
        db.query(models.Product)
        .filter(models.Product.id == product_id, models.Product.user_id == user_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return product


def update_product(
    db: Session, product_id: int, data: schemas.ProductUpdate, user_id: int
) -> models.Product:
    product = get_product(db, product_id, user_id)
    payload = data.model_dump(exclude_unset=True)

    # Se quiser ajustar estoque via PUT de produto (opcional)
    if "quantidade" in payload:
        new_qty = payload["quantidade"]
        if new_qty < 0:
            raise HTTPException(
                status_code=400, detail="Quantidade não pode ser negativa."
            )
        diff = abs(new_qty - product.quantidade)
        product.quantidade = new_qty
        _create_movement(
            db,
            product,
            models.MovementType.ADJUST,
            diff,
            "Ajuste via atualização de produto",
        )
        del payload["quantidade"]

    for k, v in payload.items():
        setattr(product, k, v)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int, user_id: int):
    product = get_product(db, product_id, user_id)
    db.delete(product)
    db.commit()


# Stock movements
def _create_movement(
    db: Session,
    product: models.Product,
    tipo: models.MovementType,
    qtd_alterada: int,
    motivo: Optional[str],
):
    movement = models.StockMovement(
        produto_id=product.id,
        user_id=product.user_id,
        tipo=tipo,
        quantidade_alterada=qtd_alterada,
        quantidade_resultante=product.quantidade,
        motivo=motivo,
    )
    db.add(movement)

    # Update last_sale_date for OUT movements
    if tipo == models.MovementType.OUT:
        product.last_sale_date = datetime.now()


def add_stock(
    db: Session, product_id: int, quantidade: int, motivo: Optional[str], user_id: int
) -> models.Product:
    product = get_product(db, product_id, user_id)
    product.quantidade += quantidade
    _create_movement(
        db, product, models.MovementType.IN, quantidade, motivo or "Entrada de estoque"
    )
    db.commit()
    db.refresh(product)
    return product


def remove_stock(
    db: Session, product_id: int, quantidade: int, motivo: Optional[str], user_id: int
) -> models.Product:
    product = get_product(db, product_id, user_id)
    if quantidade > product.quantidade:
        raise HTTPException(
            status_code=400,
            detail="Quantidade solicitada maior que o estoque disponível.",
        )
    product.quantidade -= quantidade
    _create_movement(
        db, product, models.MovementType.OUT, quantidade, motivo or "Saída de estoque"
    )
    db.commit()
    db.refresh(product)
    return product


def set_stock(
    db: Session,
    product_id: int,
    new_quantidade: int,
    motivo: Optional[str],
    user_id: int,
) -> models.Product:
    product = get_product(db, product_id, user_id)
    if new_quantidade < 0:
        raise HTTPException(status_code=400, detail="Quantidade não pode ser negativa.")
    diff = abs(product.quantidade - new_quantidade)
    product.quantidade = new_quantidade
    _create_movement(
        db,
        product,
        models.MovementType.ADJUST,
        diff,
        motivo or "Ajuste manual de estoque",
    )
    db.commit()
    db.refresh(product)
    return product


def list_movements(
    db: Session, product_id: int, user_id: int
) -> List[models.StockMovement]:
    get_product(db, product_id, user_id)  # valida existência
    return (
        db.query(models.StockMovement)
        .filter(models.StockMovement.produto_id == product_id)
        .order_by(models.StockMovement.criado_em.desc())
        .all()
    )


# Purchase Orders
def create_purchase_order(
    db: Session, data: schemas.PurchaseOrderCreate, user_id: int
) -> models.PurchaseOrder:
    # Validate supplier exists
    get_supplier(db, data.fornecedor_id, user_id)

    # Calculate total value
    total_value = 0.0
    for item in data.items:
        get_product(db, item.produto_id, user_id)
        total_value += item.quantidade_solicitada * item.preco_unitario

    # Create purchase order
    purchase_order = models.PurchaseOrder(
        fornecedor_id=data.fornecedor_id,
        user_id=user_id,
        status=models.PurchaseOrderStatus.DRAFT,
        total_value=total_value,
        observacoes=data.observacoes,
    )
    db.add(purchase_order)
    db.flush()  # Get the ID

    # Create purchase order items
    for item in data.items:
        po_item = models.PurchaseOrderItem(
            purchase_order_id=purchase_order.id,
            produto_id=item.produto_id,
            quantidade_solicitada=item.quantidade_solicitada,
            preco_unitario=item.preco_unitario,
        )
        db.add(po_item)

    db.commit()
    db.refresh(purchase_order)
    return purchase_order


def get_purchase_order(db: Session, po_id: int, user_id: int) -> models.PurchaseOrder:
    po = (
        db.query(models.PurchaseOrder)
        .filter(
            models.PurchaseOrder.id == po_id, models.PurchaseOrder.user_id == user_id
        )
        .first()
    )
    if not po:
        raise HTTPException(status_code=404, detail="Pedido de compra não encontrado.")
    return po


def list_purchase_orders(
    db: Session,
    user_id: int,
    status: Optional[models.PurchaseOrderStatus] = None,
    fornecedor_id: Optional[int] = None,
) -> List[models.PurchaseOrder]:
    q = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.user_id == user_id)
    if status:
        q = q.filter(models.PurchaseOrder.status == status)
    if fornecedor_id:
        q = q.filter(models.PurchaseOrder.fornecedor_id == fornecedor_id)
    return q.order_by(models.PurchaseOrder.criado_em.desc()).all()


def get_purchase_orders_statistics(db: Session, user_id: int) -> dict:
    """Retorna estatísticas das purchase orders"""
    total_orders = (
        db.query(models.PurchaseOrder)
        .filter(models.PurchaseOrder.user_id == user_id)
        .count()
    )

    pending_orders = (
        db.query(models.PurchaseOrder)
        .filter(
            models.PurchaseOrder.user_id == user_id,
            models.PurchaseOrder.status == models.PurchaseOrderStatus.PENDING_APPROVAL,
        )
        .count()
    )

    approved_orders = (
        db.query(models.PurchaseOrder)
        .filter(
            models.PurchaseOrder.user_id == user_id,
            models.PurchaseOrder.status == models.PurchaseOrderStatus.APPROVED,
        )
        .count()
    )

    # Calcula valor total apenas das aprovadas
    approved_value = (
        db.query(models.PurchaseOrder)
        .filter(
            models.PurchaseOrder.user_id == user_id,
            models.PurchaseOrder.status == models.PurchaseOrderStatus.APPROVED,
        )
        .with_entities(func.sum(models.PurchaseOrder.total_value))
        .scalar()
        or 0
    )

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "approved_orders": approved_orders,
        "approved_value": float(approved_value),
    }


def update_purchase_order(
    db: Session, po_id: int, data: schemas.PurchaseOrderUpdate, user_id: int
) -> models.PurchaseOrder:
    po = get_purchase_order(db, po_id, user_id)

    for k, v in data.model_dump(exclude_unset=True).items():
        if k == "status" and v == models.PurchaseOrderStatus.APPROVED:
            po.aprovado_em = datetime.now()
        setattr(po, k, v)

    db.commit()
    db.refresh(po)
    return po


def delete_purchase_order(db: Session, po_id: int, user_id: int):
    po = get_purchase_order(db, po_id, user_id)
    if po.status != models.PurchaseOrderStatus.DRAFT:
        raise HTTPException(
            status_code=400, detail="Apenas pedidos em rascunho podem ser excluídos."
        )
    db.delete(po)
    db.commit()


def approve_purchase_order(
    db: Session, po_id: int, user_id: int
) -> models.PurchaseOrder:
    po = get_purchase_order(db, po_id, user_id)
    if po.status != models.PurchaseOrderStatus.PENDING_APPROVAL:
        raise HTTPException(
            status_code=400, detail="Apenas pedidos pendentes podem ser aprovados."
        )

    po.status = models.PurchaseOrderStatus.APPROVED
    po.aprovado_em = datetime.now()

    db.commit()
    db.refresh(po)
    return po


def reject_purchase_order(
    db: Session, po_id: int, user_id: int, reason: Optional[str] = None
) -> models.PurchaseOrder:
    po = get_purchase_order(db, po_id, user_id)
    if po.status != models.PurchaseOrderStatus.PENDING_APPROVAL:
        raise HTTPException(
            status_code=400, detail="Apenas pedidos pendentes podem ser rejeitados."
        )

    po.status = models.PurchaseOrderStatus.CANCELLED
    po.rejeitado_em = datetime.now()
    po.motivo_rejeicao = reason

    db.commit()
    db.refresh(po)
    return po


def receive_purchase_order_items(
    db: Session, po_id: int, item_receipts: List[dict], user_id: int
) -> models.PurchaseOrder:
    """
    Receive items from a purchase order and update stock.
    item_receipts should be a list of dicts with 'item_id' and 'quantidade_recebida'
    """
    po = get_purchase_order(db, po_id, user_id)
    if po.status != models.PurchaseOrderStatus.APPROVED:
        raise HTTPException(
            status_code=400, detail="Apenas pedidos aprovados podem receber itens."
        )

    for receipt in item_receipts:
        item = db.get(models.PurchaseOrderItem, receipt["item_id"])
        if not item or item.purchase_order_id != po_id:
            raise HTTPException(
                status_code=404, detail="Item do pedido não encontrado."
            )

        # Update received quantity
        item.quantidade_recebida = receipt["quantidade_recebida"]

        # Add stock to product
        if receipt["quantidade_recebida"] > 0:
            product = get_product(db, item.produto_id, user_id)
            product.quantidade += receipt["quantidade_recebida"]
            _create_movement(
                db,
                product,
                models.MovementType.IN,
                receipt["quantidade_recebida"],
                f"Recebimento do pedido #{po_id}",
            )

    db.commit()
    db.refresh(po)
    return po


def auto_generate_purchase_order(
    db: Session, fornecedor_id: int, user_id: int
) -> models.PurchaseOrder:
    """Auto-generate a purchase order for a supplier based on low stock items."""
    # Get all products that need restocking for this supplier
    # Use 2x minimum stock as threshold for more useful auto-generation
    products = (
        db.query(models.Product)
        .filter(
            models.Product.user_id == user_id,
            models.Product.fornecedor_id == fornecedor_id,
            models.Product.quantidade < models.Product.estoque_minimo * 2,
        )
        .all()
    )

    if not products:
        raise HTTPException(
            status_code=404,
            detail="No products found that need restocking for this supplier",
        )

    # Create purchase order
    total_value = 0
    po = models.PurchaseOrder(
        user_id=user_id,
        fornecedor_id=fornecedor_id,
        status=models.PurchaseOrderStatus.DRAFT,
        observacoes="Auto-generated purchase order based on low stock items",
    )
    db.add(po)
    db.flush()  # Get the ID

    # Create purchase order items
    for product in products:
        # Calculate quantity needed (2x minimum stock for safety)
        recommended_stock = product.estoque_minimo * 2
        quantity_needed = max(0, recommended_stock - product.quantidade)

        if quantity_needed > 0:
            item = models.PurchaseOrderItem(
                purchase_order_id=po.id,
                produto_id=product.id,
                quantidade_solicitada=quantity_needed,
                preco_unitario=product.preco,
            )
            db.add(item)
            total_value += quantity_needed * product.preco

    # Update total value
    po.total_value = total_value

    db.commit()
    db.refresh(po)
    return po
