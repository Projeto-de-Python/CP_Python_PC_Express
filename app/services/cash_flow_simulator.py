import random
from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from ..models import Product, Sale, SaleItem, StockMovement, MovementType

class CashFlowSimulator:
    def __init__(self, db: Session):
        self.db = db

    def generate_realistic_sales(self, days_back: int = 30, user_id: int = None) -> List[Sale]:
        """Generate realistic sales data based on actual stock and prices"""
        products = self.db.query(Product).filter(
            Product.quantidade > 0,
            Product.user_id == user_id if user_id else True
        ).all()
        
        if not products:
            return []
        
        generated_sales = []
        
        for day_offset in range(days_back, 0, -1):
            date = datetime.now() - timedelta(days=day_offset)
            
            # Generate 0-3 sales per day (realistic)
            daily_sales_count = random.choices(
                [0, 1, 2, 3],
                weights=[0.4, 0.4, 0.15, 0.05]  # Most days have 0-1 sales
            )[0]
            
            for _ in range(daily_sales_count):
                # Select a random product that has stock
                available_products = [p for p in products if p.quantidade > 0]
                if not available_products:
                    break
                
                selected_product = random.choice(available_products)
                
                # Determine sale quantity (1-2 units, weighted towards 1)
                max_quantity = min(2, selected_product.quantidade)
                quantity = random.choices(
                    [1, 2],
                    weights=[0.8, 0.2] if max_quantity >= 2 else [1.0, 0.0]
                )[0]
                
                # Ensure we don't sell more than available
                quantity = min(quantity, selected_product.quantidade)
                
                if quantity <= 0:
                    continue
                
                # Calculate total value for the sale
                total_value = quantity * selected_product.preco
                
                # Create sale record
                sale = Sale(
                    total_value=total_value,
                    status="COMPLETED",
                    user_id=user_id
                )
                self.db.add(sale)
                self.db.flush()  # Get the sale ID
                
                # Create sale item
                sale_item = SaleItem(
                    sale_id=sale.id,
                    produto_id=selected_product.id,
                    quantidade=quantity,
                    preco_unitario=selected_product.preco,
                    preco_total=total_value
                )
                self.db.add(sale_item)
                
                # Update product stock
                selected_product.quantidade -= quantity
                selected_product.last_sale_date = date
                
                # Create stock movement
                movement = StockMovement(
                    produto_id=selected_product.id,
                    tipo=MovementType.OUT,
                    quantidade_alterada=-quantity,
                    quantidade_resultante=selected_product.quantidade,
                    motivo="Sale",
                    user_id=user_id
                )
                self.db.add(movement)
                
                generated_sales.append(sale)
        
        self.db.commit()
        return generated_sales
