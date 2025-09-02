#!/usr/bin/env python3
"""
Database setup script for PC-Express
This script will:
1. Create all database tables
2. Run auth migration
3. Seed initial data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models import Base
from app.auth import get_password_hash
from app.models import User, Supplier, Product

def setup_database():
    """Set up the complete database with tables, auth, and seed data."""
    
    print("🚀 Setting up PC-Express database...")
    
    # Step 1: Create all tables
    print("📋 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Step 2: Create admin user and seed data
    print("👤 Creating admin user and seeding data...")
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@pc-express.com").first()
        
        if not admin_user:
            # Create admin user
            admin_user = User(
                email="admin@pc-express.com",
                hashed_password=get_password_hash("admin123")
            )
            db.add(admin_user)
            db.flush()  # Get the ID
            print(f"✅ Created admin user with ID: {admin_user.id}")
        else:
            print(f"✅ Admin user already exists with ID: {admin_user.id}")
        
        # Check if suppliers already exist
        existing_suppliers = db.query(Supplier).count()
        if existing_suppliers == 0:
            # Create suppliers
            forn1 = Supplier(
                user_id=admin_user.id,
                nome="Tech Distribuidora", 
                email="contato@techdist.com", 
                telefone="(11) 3333-0000"
            )
            forn2 = Supplier(
                user_id=admin_user.id,
                nome="PC Parts Brasil", 
                email="vendas@pcparts.com.br", 
                telefone="(11) 4444-1111"
            )
            forn3 = Supplier(
                user_id=admin_user.id,
                nome="TechParts Ltda", 
                email="contato@techparts.com", 
                telefone="(11) 5555-2222"
            )
            db.add_all([forn1, forn2, forn3])
            db.flush()
            db.refresh(forn1)
            db.refresh(forn2)
            db.refresh(forn3)
            print("✅ Created 3 suppliers")
        else:
            print(f"✅ {existing_suppliers} suppliers already exist")
            # Get existing suppliers for product creation
            forn1, forn2, forn3 = db.query(Supplier).limit(3).all()
        
        # Check if products already exist
        existing_products = db.query(Product).count()
        if existing_products == 0:
            # Create products with realistic prices
            produtos = [
                # Processadores
                Product(user_id=admin_user.id, codigo="CPU-001", nome="AMD Ryzen 5 5600", categoria="processador", quantidade=22, preco=899.90, estoque_minimo=3, fornecedor_id=forn1.id, descricao="AM4, 6c/12t"),
                Product(user_id=admin_user.id, codigo="CPU-002", nome="Intel Core i5-12400F", categoria="processador", quantidade=15, preco=1099.90, estoque_minimo=3, fornecedor_id=forn1.id, descricao="LGA1700, 6c/12t"),
                Product(user_id=admin_user.id, codigo="CPU-003", nome="AMD Ryzen 7 5800X", categoria="processador", quantidade=8, preco=1599.90, estoque_minimo=2, fornecedor_id=forn1.id, descricao="AM4, 8c/16t"),
                
                # Placas-mãe
                Product(user_id=admin_user.id, codigo="MB-001", nome="ASUS Prime B550M", categoria="placa-mae", quantidade=0, preco=799.90, estoque_minimo=2, fornecedor_id=forn1.id, descricao="AM4, mATX"),
                Product(user_id=admin_user.id, codigo="MB-002", nome="MSI B660M-A WiFi", categoria="placa-mae", quantidade=12, preco=899.90, estoque_minimo=2, fornecedor_id=forn2.id, descricao="LGA1700, mATX"),
                Product(user_id=admin_user.id, codigo="MB-003", nome="Gigabyte X570 Aorus Elite", categoria="placa-mae", quantidade=6, preco=1299.90, estoque_minimo=1, fornecedor_id=forn1.id, descricao="AM4, ATX"),
                
                # Memórias
                Product(user_id=admin_user.id, codigo="RAM-001", nome="Corsair Vengeance 16GB (2x8) 3200MHz", categoria="memoria", quantidade=13, preco=349.90, estoque_minimo=8, fornecedor_id=forn2.id, descricao="DDR4, CL16"),
                Product(user_id=admin_user.id, codigo="RAM-002", nome="Kingston Fury 32GB (2x16) 3600MHz", categoria="memoria", quantidade=8, preco=699.90, estoque_minimo=4, fornecedor_id=forn2.id, descricao="DDR4, CL18"),
                Product(user_id=admin_user.id, codigo="RAM-003", nome="G.Skill Ripjaws 8GB 2666MHz", categoria="memoria", quantidade=25, preco=199.90, estoque_minimo=10, fornecedor_id=forn3.id, descricao="DDR4, CL19"),
                
                # Armazenamento
                Product(user_id=admin_user.id, codigo="SSD-001", nome="SSD NVMe 1TB Kingston", categoria="armazenamento", quantidade=3, preco=429.90, estoque_minimo=5, fornecedor_id=forn2.id, descricao="NVMe, 3500MB/s"),
                Product(user_id=admin_user.id, codigo="SSD-002", nome="SSD SATA 500GB Samsung", categoria="armazenamento", quantidade=18, preco=299.90, estoque_minimo=8, fornecedor_id=forn2.id, descricao="SATA III, 550MB/s"),
                Product(user_id=admin_user.id, codigo="HDD-001", nome="HD 1TB Seagate Barracuda", categoria="armazenamento", quantidade=30, preco=199.90, estoque_minimo=15, fornecedor_id=forn3.id, descricao="7200RPM, SATA III"),
                
                # Placas de Vídeo
                Product(user_id=admin_user.id, codigo="GPU-001", nome="NVIDIA RTX 4060 8GB", categoria="placa-de-video", quantidade=0, preco=2199.90, estoque_minimo=3, fornecedor_id=forn1.id, descricao="GDDR6, Ray Tracing"),
                Product(user_id=admin_user.id, codigo="GPU-002", nome="AMD RX 6600 8GB", categoria="placa-de-video", quantidade=5, preco=1899.90, estoque_minimo=2, fornecedor_id=forn1.id, descricao="GDDR6, FSR"),
                Product(user_id=admin_user.id, codigo="GPU-003", nome="NVIDIA GTX 1660 Super 6GB", categoria="placa-de-video", quantidade=8, preco=1299.90, estoque_minimo=3, fornecedor_id=forn2.id, descricao="GDDR6"),
                
                # Fontes
                Product(user_id=admin_user.id, codigo="PSU-001", nome="Fonte 650W 80+ Bronze", categoria="fonte", quantidade=1, preco=299.90, estoque_minimo=4, fornecedor_id=forn2.id, descricao="Semi-modular"),
                Product(user_id=admin_user.id, codigo="PSU-002", nome="Fonte 750W 80+ Gold", categoria="fonte", quantidade=6, preco=499.90, estoque_minimo=2, fornecedor_id=forn1.id, descricao="Full modular"),
                Product(user_id=admin_user.id, codigo="PSU-003", nome="Fonte 550W 80+ White", categoria="fonte", quantidade=20, preco=199.90, estoque_minimo=8, fornecedor_id=forn3.id, descricao="Básica"),
                
                # Coolers
                Product(user_id=admin_user.id, codigo="COOLER-001", nome="Cooler CPU Hyper 212", categoria="cooler", quantidade=0, preco=199.90, estoque_minimo=5, fornecedor_id=forn2.id, descricao="Air cooling"),
                Product(user_id=admin_user.id, codigo="COOLER-002", nome="Water Cooler 240mm", categoria="cooler", quantidade=4, preco=399.90, estoque_minimo=2, fornecedor_id=forn1.id, descricao="AIO liquid"),
                
                # Gabinetes
                Product(user_id=admin_user.id, codigo="CASE-001", nome="Gabinete ATX Mid Tower", categoria="gabinete", quantidade=12, preco=249.90, estoque_minimo=5, fornecedor_id=forn3.id, descricao="Com fans"),
                Product(user_id=admin_user.id, codigo="CASE-002", nome="Gabinete mATX Mini Tower", categoria="gabinete", quantidade=8, preco=179.90, estoque_minimo=3, fornecedor_id=forn3.id, descricao="Compacto"),
                
                # Periféricos
                Product(user_id=admin_user.id, codigo="KB-001", nome="Teclado Mecânico RGB", categoria="perifericos", quantidade=35, preco=299.90, estoque_minimo=15, fornecedor_id=forn3.id, descricao="Switches Blue"),
                Product(user_id=admin_user.id, codigo="MOUSE-001", nome="Mouse Gamer 16000 DPI", categoria="perifericos", quantidade=42, preco=149.90, estoque_minimo=20, fornecedor_id=forn3.id, descricao="RGB, 6 botões"),
                Product(user_id=admin_user.id, codigo="MONITOR-001", nome="Monitor 24\" 144Hz", categoria="perifericos", quantidade=6, preco=899.90, estoque_minimo=3, fornecedor_id=forn2.id, descricao="Full HD, IPS"),
            ]
            db.add_all(produtos)
            print(f"✅ Created {len(produtos)} products")
        else:
            print(f"✅ {existing_products} products already exist")
        
        db.commit()
        print("🎉 Database setup completed successfully!")
        print("\n📋 Default login credentials:")
        print("Email: admin@pc-express.com")
        print("Password: admin123")
        print("\n🌐 Access the application at:")
        print("Frontend: http://localhost:5173")
        print("Backend API: http://localhost:8000")
        print("API Docs: http://localhost:8000/docs")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Database setup failed: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    setup_database()
