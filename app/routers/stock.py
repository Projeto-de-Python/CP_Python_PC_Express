from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..deps import get_db

router = APIRouter(prefix="/products", tags=["Stock"])

@router.post("/{product_id}/stock/add", response_model=schemas.ProductOut)
def add_stock(product_id: int, payload: schemas.StockChangeIn, db: Session = Depends(get_db)):
    product = crud.add_stock(db, product_id, payload.quantidade, payload.motivo)
    return _to_product_out(product)

@router.post("/{product_id}/stock/remove", response_model=schemas.ProductOut)
def remove_stock(product_id: int, payload: schemas.StockChangeIn, db: Session = Depends(get_db)):
    product = crud.remove_stock(db, product_id, payload.quantidade, payload.motivo)
    return _to_product_out(product)

@router.put("/{product_id}/stock/set", response_model=schemas.ProductOut)
def set_stock(product_id: int, payload: schemas.StockSetIn, db: Session = Depends(get_db)):
    product = crud.set_stock(db, product_id, payload.quantidade, payload.motivo)
    return _to_product_out(product)

@router.get("/{product_id}/movements", response_model=List[schemas.StockMovementOut])
def list_movements(product_id: int, db: Session = Depends(get_db)):
    return crud.list_movements(db, product_id)

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
