from app.database import SessionLocal
from app import models

def run():
    db = SessionLocal()
    try:
        # Fornecedores
        forn1 = models.Supplier(nome="Tech Distribuidora", email="contato@techdist.com", telefone="(11) 3333-0000")
        forn2 = models.Supplier(nome="PC Parts Brasil", email="vendas@pcparts.com.br", telefone="(11) 4444-1111")
        db.add_all([forn1, forn2])
        db.commit()
        db.refresh(forn1); db.refresh(forn2)

        # Produtos
        produtos = [
            models.Product(codigo="CPU-001", nome="AMD Ryzen 5 5600", categoria="processador", quantidade=10, preco=899.90, estoque_minimo=3, fornecedor_id=forn1.id, descricao="AM4, 6c/12t"),
            models.Product(codigo="MB-001", nome="ASUS Prime B550M", categoria="placa-mae", quantidade=5, preco=799.90, estoque_minimo=2, fornecedor_id=forn1.id),
            models.Product(codigo="RAM-001", nome="Corsair Vengeance 16GB (2x8) 3200MHz", categoria="memoria", quantidade=25, preco=349.90, estoque_minimo=8, fornecedor_id=forn2.id),
            models.Product(codigo="SSD-001", nome="SSD NVMe 1TB Kingston", categoria="armazenamento", quantidade=7, preco=429.90, estoque_minimo=5, fornecedor_id=forn2.id),
            models.Product(codigo="GPU-001", nome="NVIDIA RTX 4060 8GB", categoria="placa-de-video", quantidade=2, preco=2199.90, estoque_minimo=3, fornecedor_id=forn1.id, descricao="Alerta: baixo estoque"),
            models.Product(codigo="PSU-001", nome="Fonte 650W 80+ Bronze", categoria="fonte", quantidade=12, preco=299.90, estoque_minimo=4, fornecedor_id=forn2.id),
        ]
        db.add_all(produtos)
        db.commit()

        print("Seed concluído com sucesso.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
