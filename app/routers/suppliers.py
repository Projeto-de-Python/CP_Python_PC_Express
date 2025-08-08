from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..deps import get_db

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.post("", response_model=schemas.SupplierOut)
def create_supplier(payload: schemas.SupplierCreate, db: Session = Depends(get_db)):
    return crud.create_supplier(db, payload)

@router.get("", response_model=List[schemas.SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    return crud.list_suppliers(db)

@router.get("/{supplier_id}", response_model=schemas.SupplierOut)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    return crud.get_supplier(db, supplier_id)

@router.put("/{supplier_id}", response_model=schemas.SupplierOut)
def update_supplier(supplier_id: int, payload: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    return crud.update_supplier(db, supplier_id, payload)

@router.delete("/{supplier_id}", status_code=204)
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    crud.delete_supplier(db, supplier_id)
    return
