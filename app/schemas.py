from pydantic import BaseModel, PositiveInt, NonNegativeInt, NonNegativeFloat, constr
from typing import Optional
from datetime import datetime
from enum import Enum

class MovementType(str, Enum):
    IN = "IN"
    OUT = "OUT"
    ADJUST = "ADJUST"

# Supplier
class SupplierBase(BaseModel):
    nome: constr(min_length=1)
    email: Optional[str] = None
    telefone: Optional[str] = None
    cnpj: Optional[str] = None
    observacoes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    nome: Optional[constr(min_length=1)] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    cnpj: Optional[str] = None
    observacoes: Optional[str] = None

class SupplierOut(SupplierBase):
    id: int
    criado_em: datetime
    class Config:
        from_attributes = True

# Product
class ProductBase(BaseModel):
    codigo: constr(min_length=1)
    nome: constr(min_length=1)
    categoria: Optional[str] = None
    quantidade: NonNegativeInt = 0
    preco: NonNegativeFloat = 0.0
    descricao: Optional[str] = None
    fornecedor_id: Optional[int] = None
    estoque_minimo: NonNegativeInt = 5

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    nome: Optional[constr(min_length=1)] = None
    categoria: Optional[str] = None
    quantidade: Optional[NonNegativeInt] = None
    preco: Optional[NonNegativeFloat] = None
    descricao: Optional[str] = None
    fornecedor_id: Optional[int] = None
    estoque_minimo: Optional[NonNegativeInt] = None

class ProductOut(BaseModel):
    id: int
    codigo: str
    nome: str
    categoria: Optional[str]
    quantidade: int
    preco: float
    descricao: Optional[str]
    fornecedor_id: Optional[int]
    estoque_minimo: int
    criado_em: datetime
    atualizado_em: datetime
    em_estoque_baixo: bool
    class Config:
        from_attributes = True

# Stock
class StockChangeIn(BaseModel):
    quantidade: PositiveInt
    motivo: Optional[str] = None

class StockSetIn(BaseModel):
    quantidade: NonNegativeInt
    motivo: Optional[str] = None

class StockMovementOut(BaseModel):
    id: int
    produto_id: int
    tipo: MovementType
    quantidade_alterada: int
    quantidade_resultante: int
    motivo: Optional[str]
    criado_em: datetime
    class Config:
        from_attributes = True

