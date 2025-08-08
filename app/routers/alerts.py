from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..deps import get_db

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/low-stock", response_model=List[schemas.ProductOut])
def low_stock(db: Session = Depends(get_db)):
    products = crud.list_products(db, low_stock=True)
    return [{
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
        "em_estoque_baixo": True
    } for p in products]
