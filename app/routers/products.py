from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import get_current_active_user
from ..deps import get_db
from ..models import Product, User

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", response_model=schemas.Product)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    product = crud.create_product(db, payload, current_user.id)
    return product


@router.get("", response_model=List[schemas.Product])
def list_products(
    nome: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    fornecedor_id: Optional[int] = Query(None),
    em_estoque_baixo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    products = crud.list_products(
        db, current_user.id, nome, categoria, fornecedor_id, em_estoque_baixo
    )
    return products


@router.get("/low-stock", response_model=List[schemas.Product])
def low_stock(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    products = crud.list_products(db, current_user.id, low_stock=True)
    return products


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    product = crud.get_product(db, product_id, current_user.id)
    return product


@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    product = crud.update_product(db, product_id, payload, current_user.id)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    crud.delete_product(db, product_id, current_user.id)
    return


@router.post("/bulk-update-prices")
def bulk_update_prices(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    """Update all product prices to reasonable values"""
    try:
        # Price updates mapping
        price_updates = {
            "CPU-001": 899.90,  # AMD Ryzen 5 5600
            "CPU-002": 1099.90,  # Intel Core i5-12400F
            "CPU-003": 1599.90,  # AMD Ryzen 7 5800X
            "MB-001": 799.90,  # ASUS Prime B550M
            "MB-002": 899.90,  # MSI B660M-A WiFi
            "MB-003": 1299.90,  # Gigabyte X570 Aorus Elite
            "RAM-001": 349.90,  # Corsair Vengeance 16GB
            "RAM-002": 699.90,  # Kingston Fury 32GB
            "RAM-003": 199.90,  # G.Skill Ripjaws 8GB
            "SSD-001": 429.90,  # SSD NVMe 1TB Kingston
            "SSD-002": 299.90,  # SSD SATA 500GB Samsung
            "HDD-001": 199.90,  # HD 1TB Seagate Barracuda
            "GPU-001": 2199.90,  # NVIDIA RTX 4060 8GB
            "GPU-002": 1899.90,  # AMD RX 6600 8GB
            "GPU-003": 1299.90,  # NVIDIA GTX 1660 Super 6GB
            "PSU-001": 299.90,  # Fonte 650W 80+ Bronze
            "PSU-002": 499.90,  # Fonte 750W 80+ Gold
            "PSU-003": 199.90,  # Fonte 550W 80+ White
            "COOLER-001": 199.90,  # Cooler CPU Hyper 212
            "COOLER-002": 399.90,  # Water Cooler 240mm
            "CASE-001": 249.90,  # Gabinete ATX Mid Tower
            "CASE-002": 179.90,  # Gabinete mATX Mini Tower
            "KB-001": 299.90,  # Teclado Mecânico RGB
            "MOUSE-001": 149.90,  # Mouse Gamer 16000 DPI
            "MONITOR-001": 899.90,  # Monitor 24" 144Hz
        }

        updated_count = 0
        for codigo, new_price in price_updates.items():
            product = (
                db.query(Product)
                .filter(Product.codigo == codigo, Product.user_id == current_user.id)
                .first()
            )
            if product:
                product.preco = new_price
                updated_count += 1

        db.commit()

        # Get updated inventory summary
        products = db.query(Product).filter(Product.user_id == current_user.id).all()
        total_value = sum(p.preco * p.quantidade for p in products)
        low_stock = [p for p in products if p.quantidade <= p.estoque_minimo]

        return {
            "message": f"Successfully updated {updated_count} products with realistic prices",
            "updated_count": updated_count,
            "total_products": len(products),
            "total_inventory_value": round(total_value, 2),
            "low_stock_count": len(low_stock),
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update prices: {str(e)}")
