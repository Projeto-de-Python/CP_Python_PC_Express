from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import get_current_active_user
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("", response_model=List[schemas.SaleOut])
def list_sales(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """List all sales for the current user."""
    sales = crud.get_sales(db, current_user.id, limit)
    return sales


@router.get("/{sale_id}", response_model=schemas.SaleOut)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific sale by ID with product details."""
    sale = crud.get_sale_with_details(db, sale_id, current_user.id)
    return sale


@router.get("/analytics/top-products")
def get_top_selling_products(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get top selling products based on sales data."""
    top_products = crud.get_top_selling_products(db, current_user.id, limit)
    return {
        "top_products": top_products,
        "total_products": len(top_products)
    }
