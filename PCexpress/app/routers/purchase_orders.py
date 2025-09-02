from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db
from ..auth import get_current_active_user
from ..models import User

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.post("", response_model=schemas.PurchaseOrder)
def create_purchase_order(
    payload: schemas.PurchaseOrderCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new purchase order."""
    return crud.create_purchase_order(db, payload, current_user.id)

@router.get("", response_model=List[schemas.PurchaseOrder])
def list_purchase_orders(
    status: Optional[schemas.PurchaseOrderStatus] = Query(None),
    fornecedor_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all purchase orders with optional filtering."""
    purchase_orders = crud.list_purchase_orders(db, current_user.id, status, fornecedor_id)
    return purchase_orders

@router.get("/{po_id}", response_model=schemas.PurchaseOrder)
def get_purchase_order(
    po_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific purchase order by ID."""
    po = crud.get_purchase_order(db, po_id, current_user.id)
    return po

@router.put("/{po_id}", response_model=schemas.PurchaseOrder)
def update_purchase_order(
    po_id: int, 
    payload: schemas.PurchaseOrderUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a purchase order."""
    po = crud.update_purchase_order(db, po_id, payload, current_user.id)
    return po

@router.delete("/{po_id}", status_code=204)
def delete_purchase_order(
    po_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a purchase order (only if in DRAFT status)."""
    crud.delete_purchase_order(db, po_id, current_user.id)
    return

@router.post("/{po_id}/approve", response_model=schemas.PurchaseOrder)
def approve_purchase_order(
    po_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Approve a purchase order."""
    po = crud.approve_purchase_order(db, po_id, current_user.id)
    return po

@router.post("/{po_id}/receive")
def receive_purchase_order_items(
    po_id: int, 
    item_receipts: List[dict], 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Receive items from a purchase order and update stock."""
    po = crud.receive_purchase_order_items(db, po_id, item_receipts, current_user.id)
    return {"message": "Items received successfully", "purchase_order_id": po_id}


