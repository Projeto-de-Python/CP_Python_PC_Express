from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class MovementType(str, enum.Enum):
    IN = "IN"
    OUT = "OUT"
    ADJUST = "ADJUST"

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    telefone = Column(String(50), nullable=True)
    cnpj = Column(String(50), nullable=True)
    observacoes = Column(Text, nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    produtos = relationship("Product", back_populates="fornecedor")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(100), unique=True, index=True, nullable=False)
    nome = Column(String(255), nullable=False)
    categoria = Column(String(100), nullable=True)  # ex.: processador, memoria, armazenamento...
    quantidade = Column(Integer, nullable=False, default=0)
    preco = Column(Float, nullable=False, default=0.0)
    descricao = Column(Text, nullable=True)
    fornecedor_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    estoque_minimo = Column(Integer, nullable=False, default=5)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    fornecedor = relationship("Supplier", back_populates="produtos")
    movimentos = relationship("StockMovement", back_populates="produto", cascade="all, delete-orphan")

class StockMovement(Base):
    __tablename__ = "stock_movements"
    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    tipo = Column(Enum(MovementType), nullable=False)
    quantidade_alterada = Column(Integer, nullable=False)
    quantidade_resultante = Column(Integer, nullable=False)
    motivo = Column(String(255), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    produto = relationship("Product", back_populates="movimentos")

