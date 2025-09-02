from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
from ..database import get_db
from ..models import Product, PurchaseOrder, PurchaseOrderItem, Supplier
from ..auth import get_current_active_user
from ..models import User

router = APIRouter(prefix="/auto-restock", tags=["auto-restock"])

@router.get("/analysis")
def get_stock_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Analyze current stock levels and provide restock recommendations"""
    try:
        products = db.query(Product).filter(Product.user_id == current_user.id).all()
        
        restock_items = []
        
        for product in products:
            # Calculate recommended stock level (2x minimum stock for safety)
            recommended_stock = product.estoque_minimo * 2
            current_stock = product.quantidade
            restock_needed = max(0, recommended_stock - current_stock)
            
            if restock_needed > 0:
                # Get supplier info
                supplier = None
                if product.fornecedor_id:
                    supplier = db.query(Supplier).filter(
                        Supplier.id == product.fornecedor_id,
                        Supplier.user_id == current_user.id
                    ).first()
                
                restock_items.append({
                    "product": {
                        "id": product.id,
                        "nome": product.nome,
                        "codigo": product.codigo,
                        "categoria": product.categoria,
                        "quantidade": current_stock,
                        "estoque_minimo": product.estoque_minimo,
                        "preco": product.preco
                    },
                    "supplier": {
                        "id": supplier.id if supplier else None,
                        "nome": supplier.nome if supplier else "No supplier assigned"
                    } if supplier else None,
                    "restock_info": {
                        "current_stock": current_stock,
                        "recommended_stock": recommended_stock,
                        "restock_needed": restock_needed,
                        "estimated_cost": restock_needed * product.preco,
                        "urgency": "critical" if current_stock == 0 else "high" if current_stock <= product.estoque_minimo else "medium"
                    }
                })
        
        # Sort by urgency (critical first, then high, then medium)
        urgency_order = {"critical": 0, "high": 1, "medium": 2}
        restock_items.sort(key=lambda x: urgency_order[x["restock_info"]["urgency"]])
        
        return {
            "restock_items": restock_items,
            "total_items": len(restock_items),
            "total_cost": sum(item["restock_info"]["estimated_cost"] for item in restock_items),
            "critical_count": len([item for item in restock_items if item["restock_info"]["urgency"] == "critical"]),
            "high_count": len([item for item in restock_items if item["restock_info"]["urgency"] == "high"]),
            "medium_count": len([item for item in restock_items if item["restock_info"]["urgency"] == "medium"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze stock: {str(e)}")

@router.post("/restock-all")
def restock_all_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Restock all products to recommended levels with one click"""
    try:
        products = db.query(Product).filter(Product.user_id == current_user.id).all()
        
        restock_orders = []
        total_value = 0
        
        for product in products:
            # Calculate recommended stock level
            recommended_stock = product.estoque_minimo * 2
            current_stock = product.quantidade
            restock_needed = max(0, recommended_stock - current_stock)
            
            # Only restock if needed and product has a supplier
            if restock_needed > 0 and product.fornecedor_id:
                supplier = db.query(Supplier).filter(
                    Supplier.id == product.fornecedor_id,
                    Supplier.user_id == current_user.id
                ).first()
                
                if supplier:
                    # Calculate order value
                    order_value = restock_needed * product.preco
                    total_value += order_value
                    
                    # Create purchase order
                    purchase_order = PurchaseOrder(
                        fornecedor_id=supplier.id,
                        user_id=current_user.id,
                        status="PENDING_APPROVAL",
                        total_value=order_value,
                        observacoes=f"Auto-restock: {product.nome} - Restock to {recommended_stock} units"
                    )
                    db.add(purchase_order)
                    db.flush()
                    
                    # Create purchase order item
                    order_item = PurchaseOrderItem(
                        purchase_order_id=purchase_order.id,
                        produto_id=product.id,
                        quantidade_solicitada=restock_needed,
                        preco_unitario=product.preco
                    )
                    db.add(order_item)
                    
                    restock_orders.append({
                        "product": product.nome,
                        "supplier": supplier.nome,
                        "restock_amount": restock_needed,
                        "order_value": order_value,
                        "purchase_order_id": purchase_order.id
                    })
        
        db.commit()
        
        return {
            "message": f"Created {len(restock_orders)} restock orders",
            "orders": restock_orders,
            "total_value": total_value,
            "orders_created": len(restock_orders)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create restock orders: {str(e)}")

@router.post("/restock-product/{product_id}")
def restock_single_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Restock a specific product to recommended levels"""
    try:
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.user_id == current_user.id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if not product.fornecedor_id:
            raise HTTPException(status_code=400, detail="Product has no supplier assigned")
        
        supplier = db.query(Supplier).filter(
            Supplier.id == product.fornecedor_id,
            Supplier.user_id == current_user.id
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        # Calculate recommended stock level
        recommended_stock = product.estoque_minimo * 2
        current_stock = product.quantidade
        restock_needed = max(0, recommended_stock - current_stock)
        
        if restock_needed <= 0:
            return {"message": "Product is already at recommended stock levels"}
        
        # Create purchase order
        order_value = restock_needed * product.preco
        purchase_order = PurchaseOrder(
            fornecedor_id=supplier.id,
            user_id=current_user.id,
            status="PENDING_APPROVAL",
            total_value=order_value,
            observacoes=f"Restock: {product.nome} - Restock to {recommended_stock} units"
        )
        db.add(purchase_order)
        db.flush()
        
        # Create purchase order item
        order_item = PurchaseOrderItem(
            purchase_order_id=purchase_order.id,
            produto_id=product.id,
            quantidade_solicitada=restock_needed,
            preco_unitario=product.preco
        )
        db.add(order_item)
        
        db.commit()
        
        return {
            "message": "Restock order created successfully",
            "order": {
                "purchase_order_id": purchase_order.id,
                "product": product.nome,
                "supplier": supplier.nome,
                "restock_amount": restock_needed,
                "order_value": order_value,
                "current_stock": current_stock,
                "recommended_stock": recommended_stock
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create restock order: {str(e)}")
