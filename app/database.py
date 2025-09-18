from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./inventory.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False,  # necessário para SQLite com threads
        "timeout": 30,  # Timeout de 30 segundos para operações
    },
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
