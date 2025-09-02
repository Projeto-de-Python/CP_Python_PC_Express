from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import suppliers, products, stock, alerts, purchase_orders, auth, insights, auto_restock

# cria as tabelas no primeiro run
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PC Express API",
    description="API para gerenciamento de estoque de produtos de informática",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(alerts.router)
app.include_router(purchase_orders.router)
app.include_router(insights.router)
app.include_router(auto_restock.router)

@app.get("/health")
def health():
    return {"status": "ok"}
