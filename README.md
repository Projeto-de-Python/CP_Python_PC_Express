<p align="center
  
<picture>
  <source srcset="logo.png">
  <img alt="PC EXPRESS" src="logo.png" width="240">
</picture>

</p

# **PC-Express**
**Projeto de Python** da Aula de Python na **FIAP**. Uma loja de peça de computadores com estoque e gestão do estoque.

**API em FastAPI para gestão de produtos e estoque, com histórico e alertas de baixo estoque.**

## Requisitos
- Python 3.10+
- pip

## Instalação
python -m venv .venv
# Linux/Mac
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt

## Rodando
uvicorn app.main:app --reload

Acesse:
- http://127.0.0.1:8000/health
- http://127.0.0.1:8000/docs (Swagger)
- http://127.0.0.1:8000/redoc

## Dados de exemplo (opcional)
python -m scripts.seed

## Endpoints principais
- Suppliers
  - POST /suppliers
  - GET /suppliers
  - GET /suppliers/{id}
  - PUT /suppliers/{id}
  - DELETE /suppliers/{id}
- Products
  - POST /products
  - GET /products?nome=&categoria=&fornecedor_id=&em_estoque_baixo=true
  - GET /products/{id}
  - PUT /products/{id}
  - DELETE /products/{id}
  - GET /products/low-stock
- Stock
  - POST /products/{id}/stock/add
  - POST /products/{id}/stock/remove
  - PUT /products/{id}/stock/set
  - GET /products/{id}/movements
- Alerts
  - GET /alerts/low-stock

## Exemplos rápidos (HTTP)
- Criar produto:
  POST /products
  {
    "codigo": "COOLER-001",
    "nome": "Cooler CPU Hyper 212",
    "categoria": "cooler",
    "quantidade": 15,
    "preco": 199.90,
    "estoque_minimo": 5
  }

- Remover 2 unidades (venda):
  POST /products/1/stock/remove
  { "quantidade": 2, "motivo": "Venda balcão" }

- Produtos com baixo estoque:
  GET /products/low-stock

## Observações
- Estoque nunca fica negativo; remoção acima do disponível retorna 400.
- Código do produto é único; duplicado retorna 409.
