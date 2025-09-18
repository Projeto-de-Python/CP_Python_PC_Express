from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./inventory.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False,  # necessário para SQLite com threads
        "timeout": 30,  # Timeout de 30 segundos para operações
        "isolation_level": None,  # Autocommit mode para melhor performance
        "journal_mode": "WAL",  # Write-Ahead Logging para melhor performance
        "synchronous": "NORMAL",  # Balance entre performance e segurança
        "cache_size": 10000,  # Cache maior para melhor performance
        "temp_store": "MEMORY",  # Usa memória para tabelas temporárias
    },
    pool_pre_ping=True,  # Verifica conexões antes de usar
    pool_recycle=3600,  # Recicla conexões a cada hora
    pool_size=5,  # Tamanho do pool de conexões
    max_overflow=10,  # Máximo de conexões extras
    echo=False,  # Desabilita logs SQL em produção
    future=True,  # Usa SQLAlchemy 2.0 style
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
