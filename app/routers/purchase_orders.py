from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import get_current_active_user
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])


@router.post("", response_model=schemas.PurchaseOrder)
def create_purchase_order(
    payload: schemas.PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new purchase order."""
    return crud.create_purchase_order(db, payload, current_user.id)


@router.get("", response_model=List[schemas.PurchaseOrder])
def list_purchase_orders(
    status: Optional[schemas.PurchaseOrderStatus] = Query(None),
    fornecedor_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """List all purchase orders with optional filtering."""
    purchase_orders = crud.list_purchase_orders(
        db, current_user.id, status, fornecedor_id
    )
    return purchase_orders


@router.get("/statistics")
def get_purchase_orders_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get purchase orders statistics including approved value."""
    return crud.get_purchase_orders_statistics(db, current_user.id)


@router.get("/{po_id}", response_model=schemas.PurchaseOrderOut)
def get_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific purchase order by ID."""
    po = crud.get_purchase_order_with_details(db, po_id, current_user.id)
    return po


@router.put("/{po_id}", response_model=schemas.PurchaseOrder)
def update_purchase_order(
    po_id: int,
    payload: schemas.PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a purchase order."""
    po = crud.update_purchase_order(db, po_id, payload, current_user.id)
    return po


@router.delete("/{po_id}", status_code=204)
def delete_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a purchase order (only if in DRAFT status)."""
    crud.delete_purchase_order(db, po_id, current_user.id)
    return


@router.post("/{po_id}/approve", response_model=schemas.PurchaseOrder)
def approve_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Approve a purchase order."""
    po = crud.approve_purchase_order(db, po_id, current_user.id)
    return po


@router.post("/{po_id}/reject", response_model=schemas.PurchaseOrder)
def reject_purchase_order(
    po_id: int,
    reason: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Reject a purchase order."""
    po = crud.reject_purchase_order(db, po_id, current_user.id, reason)
    return po


@router.post("/{po_id}/receive")
def receive_purchase_order_items(
    po_id: int,
    item_receipts: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Receive items from a purchase order and update stock."""
    crud.receive_purchase_order_items(db, po_id, item_receipts, current_user.id)
    return {"message": "Items received successfully", "purchase_order_id": po_id}


@router.post("/auto-generate", response_model=schemas.PurchaseOrder)
def auto_generate_purchase_order(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Auto-generate a purchase order for a supplier based on low stock items."""
    fornecedor_id = payload.get("fornecedor_id")
    if not fornecedor_id:
        raise HTTPException(status_code=400, detail="Supplier ID is required")

    return crud.auto_generate_purchase_order(db, fornecedor_id, current_user.id)
