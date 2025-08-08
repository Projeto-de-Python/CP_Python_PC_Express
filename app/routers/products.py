from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..deps import get_db

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=schemas.ProductOut)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = crud.create_product(db, payload)
    return _to_product_out(product)

@router.get("", response_model=List[schemas.ProductOut])
def list_products(
    nome: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    fornecedor_id: Optional[int] = Query(None),
    em_estoque_baixo: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    products = crud.list_products(db, nome, categoria, fornecedor_id, em_estoque_baixo)
    return [_to_product_out(p) for p in products]

@router.get("/low-stock", response_model=List[schemas.ProductOut])
def low_stock(db: Session = Depends(get_db)):
    products = crud.list_products(db, low_stock=True)
    return [_to_product_out(p) for p in products]

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    return _to_product_out(product)

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, payload: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = crud.update_product(db, product_id, payload)
    return _to_product_out(product)

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, product_id)
    return

def _to_product_out(p):
    return {
        "id": p.id,
        "codigo": p.codigo,
        "nome": p.nome,
        "categoria": p.categoria,
        "quantidade": p.quantidade,
        "preco": p.preco,
        "descricao": p.descricao,
        "fornecedor_id": p.fornecedor_id,
        "estoque_minimo": p.estoque_minimo,
        "criado_em": p.criado_em,
        "atualizado_em": p.atualizado_em,
        "em_estoque_baixo": p.quantidade <= p.estoque_minimo
    }
