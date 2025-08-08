from fastapi import FastAPI
from .database import Base, engine
from .routers import suppliers, products, stock, alerts

# cria as tabelas no primeiro run
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Manager - Peças de Computador",
    version="0.1.0",
    description="API para gerenciamento de produtos e estoque, com alertas de estoque baixo."
)

app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(alerts.router)

@app.get("/health")
def health():
    return {"status": "ok"}
