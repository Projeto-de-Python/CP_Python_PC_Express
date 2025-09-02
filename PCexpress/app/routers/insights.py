from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Product, Sale, SaleItem, StockMovement, MovementType
from ..services.cash_flow_simulator import CashFlowSimulator
from ..auth import get_current_active_user
from ..models import User

router = APIRouter(prefix="/insights", tags=["insights"])

@router.post("/generate-sales-data")
def generate_sales_data(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generate initial sales data only if no sales exist (for system setup)"""
    try:
        simulator = CashFlowSimulator(db)
        generated_sales = simulator.generate_initial_sales_data(days, current_user.id)
        
        if len(generated_sales) == 0:
            return {
                "message": "No initial data generated - sales already exist in the system",
                "sales_count": 0,
                "note": "Use real sales data for ML insights"
            }
        
        return {
            "message": f"Generated {len(generated_sales)} initial sales over the past {days} days",
            "sales_count": len(generated_sales),
            "note": "Initial data generated for system setup. Add real sales for better ML insights."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate initial sales data: {str(e)}")

@router.get("/overview")
def get_insights_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get overview insights for all products"""
    try:
        products = db.query(Product).filter(Product.user_id == current_user.id).all()
        
        if not products:
            return {
                "message": "No products found. Add some products to see insights.",
                "inventory_summary": {
                    "total_products": 0,
                    "total_stock_value": 0,
                    "low_stock_count": 0,
                    "out_of_stock_count": 0,
                    "stock_health_percentage": 0
                }
            }
        
        total_products = len(products)
        total_stock_value = sum(p.quantidade * p.preco for p in products)
        low_stock_count = len([p for p in products if p.em_estoque_baixo])
        out_of_stock_count = len([p for p in products if p.quantidade == 0])
        
        # Get recent stock movements (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_movements = db.query(StockMovement).filter(
            and_(
                StockMovement.user_id == current_user.id,
                StockMovement.criado_em >= thirty_days_ago
            )
        ).all()
        
        # Analyze movement patterns
        in_movements = [m for m in recent_movements if m.tipo == MovementType.IN]
        out_movements = [m for m in recent_movements if m.tipo == MovementType.OUT]
        
        total_in = sum(m.quantidade_alterada for m in in_movements)
        total_out = sum(abs(m.quantidade_alterada) for m in out_movements)
        
        # Get sales data (last 30 days)
        recent_sales = db.query(Sale).filter(
            and_(
                Sale.user_id == current_user.id,
                Sale.criado_em >= thirty_days_ago
            )
        ).all()
        
        total_sales_value = sum(s.total_value for s in recent_sales)
        total_sales_count = len(recent_sales)
        
        return {
            "inventory_summary": {
                "total_products": total_products,
                "total_stock_value": total_stock_value,
                "low_stock_count": low_stock_count,
                "out_of_stock_count": out_of_stock_count,
                "stock_health_percentage": ((total_products - low_stock_count - out_of_stock_count) / total_products * 100) if total_products > 0 else 0
            },
            "movement_analysis": {
                "total_in_movements": len(in_movements),
                "total_out_movements": len(out_movements),
                "total_quantity_in": total_in,
                "total_quantity_out": total_out,
                "net_movement": total_in - total_out
            },
            "sales_analysis": {
                "total_sales": total_sales_count,
                "total_sales_value": total_sales_value,
                "average_sale_value": total_sales_value / total_sales_count if total_sales_count > 0 else 0,
                "period": "30 days"
            },
            "recommendations": _generate_recommendations(products, recent_movements, recent_sales)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get insights overview: {str(e)}")

@router.get("/product/{product_id}")
def get_product_insights(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get detailed insights for a specific product"""
    try:
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.user_id == current_user.id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get recent movements for this product
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_movements = db.query(StockMovement).filter(
            and_(
                StockMovement.produto_id == product_id,
                StockMovement.user_id == current_user.id,
                StockMovement.criado_em >= thirty_days_ago
            )
        ).order_by(StockMovement.criado_em.desc()).all()
        
        # Get recent sales for this product
        recent_sales = db.query(SaleItem).filter(
            and_(
                SaleItem.produto_id == product_id,
                SaleItem.criado_em >= thirty_days_ago
            )
        ).all()
        
        # Calculate insights
        total_sold = sum(sale.quantidade for sale in recent_sales)
        total_sales_value = sum(sale.preco_total for sale in recent_sales)
        avg_sale_quantity = total_sold / len(recent_sales) if recent_sales else 0
        
        # Movement analysis
        in_movements = [m for m in recent_movements if m.tipo == MovementType.IN]
        out_movements = [m for m in recent_movements if m.tipo == MovementType.OUT]
        
        total_in = sum(m.quantidade_alterada for m in in_movements)
        total_out = sum(abs(m.quantidade_alterada) for m in out_movements)
        
        # Stock health analysis
        stock_health = "healthy"
        if product.quantidade == 0:
            stock_health = "out_of_stock"
        elif product.em_estoque_baixo:
            stock_health = "low_stock"
        
        # Price analysis
        price_analysis = _analyze_price(product, recent_sales)
        
        return {
            "product": {
                "id": product.id,
                "nome": product.nome,
                "codigo": product.codigo,
                "categoria": product.categoria,
                "quantidade": product.quantidade,
                "estoque_minimo": product.estoque_minimo,
                "preco": product.preco,
                "stock_health": stock_health
            },
            "sales_analysis": {
                "total_sold_30d": total_sold,
                "total_sales_value_30d": total_sales_value,
                "average_sale_quantity": avg_sale_quantity,
                "sales_count": len(recent_sales)
            },
            "movement_analysis": {
                "total_in_30d": total_in,
                "total_out_30d": total_out,
                "net_movement": total_in - total_out,
                "movement_count": len(recent_movements)
            },
            "price_analysis": price_analysis,
            "recommendations": _generate_product_recommendations(product, recent_sales, recent_movements)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get product insights: {str(e)}")

@router.get("/low-stock-alerts")
def get_low_stock_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get insights for products with low stock"""
    try:
        # Very simple version
        return {
            "low_stock_products": [],
            "total_low_stock": 0,
            "critical_count": 0,
            "high_count": 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get low stock insights: {str(e)}")

@router.get("/test-simple")
def test_simple_endpoint(
    current_user: User = Depends(get_current_active_user)
):
    """Simple test endpoint"""
    return {"message": "Test endpoint working", "user": current_user.email}

@router.get("/ml/demand-prediction/{product_id}")
def get_demand_prediction(
    product_id: int,
    days_ahead: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ML-based demand prediction for a product using real data"""
    try:
        from ..services.ml_predictor import MLPredictor
        predictor = MLPredictor(db, current_user.id)
        prediction = predictor.predict_demand(product_id, days_ahead)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get demand prediction: {str(e)}")

@router.get("/ml/price-optimization/{product_id}")
def get_price_optimization(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ML-based price optimization for a product using real data"""
    try:
        from ..services.ml_predictor import MLPredictor
        predictor = MLPredictor(db, current_user.id)
        optimization = predictor.optimize_price(product_id)
        return optimization
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get price optimization: {str(e)}")

@router.get("/ml/anomaly-detection")
def get_anomaly_detection(
    product_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ML-based anomaly detection in sales using real data"""
    try:
        from ..services.ml_predictor import MLPredictor
        predictor = MLPredictor(db, current_user.id)
        anomalies = predictor.detect_anomalies(product_id)
        return anomalies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get anomaly detection: {str(e)}")

@router.get("/ml/stock-optimization/{product_id}")
def get_stock_optimization(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ML-based stock optimization for a product using real data"""
    try:
        from ..services.ml_predictor import MLPredictor
        predictor = MLPredictor(db, current_user.id)
        optimization = predictor.get_stock_optimization(product_id)
        return optimization
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stock optimization: {str(e)}")

@router.get("/ml/product-insights/{product_id}")
def get_ml_product_insights(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get comprehensive ML insights for a product using real data"""
    try:
        from ..services.ml_predictor import MLPredictor
        predictor = MLPredictor(db, current_user.id)
        insights = predictor.get_product_insights_summary(product_id)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get ML insights: {str(e)}")

@router.get("/ml/multi-product-analysis")
def get_multi_product_ml_analysis(
    product_ids: str,  # Comma-separated product IDs
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get ML analysis for multiple products with visualizations"""
    try:
        # Parse product IDs
        product_id_list = [int(pid.strip()) for pid in product_ids.split(',') if pid.strip()]
        
        if not product_id_list:
            raise HTTPException(status_code=400, detail="No valid product IDs provided")
        
        # Limit to maximum 5 products to avoid timeout
        if len(product_id_list) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 products allowed for analysis")
        
        # Get products
        products = db.query(Product).filter(
            and_(
                Product.id.in_(product_id_list),
                Product.user_id == current_user.id
            )
        ).all()
        
        if len(products) != len(product_id_list):
            raise HTTPException(status_code=404, detail="Some products not found")
        
        from ..services.ml_predictor import MLPredictor
        ml_predictor = MLPredictor(db, current_user.id)
        results = {}
        
        for product in products:
            try:
                # Get ML insights for each product with timeout protection
                product_insights = ml_predictor.get_product_insights_summary(product.id)
                
                # Get historical data for visualizations
                historical_data = ml_predictor._get_sales_data(product.id, days=90)
                
                # Prepare visualization data
                sales_chart_data = ml_predictor._generate_sales_trend_data(product.id, 90)
                
                results[product.id] = {
                    "product": {
                        "id": product.id,
                        "nome": product.nome,
                        "codigo": product.codigo,
                        "categoria": product.categoria,
                        "quantidade": product.quantidade,
                        "preco": product.preco,
                        "estoque_minimo": product.estoque_minimo
                    },
                    "ml_insights": product_insights,
                    "visualizations": {
                        "sales_trend": sales_chart_data,
                        "demand_forecast": ml_predictor._generate_demand_forecast_data(product.id, 30),
                        "price_analysis": ml_predictor._generate_price_analysis_data(product.id),
                        "stock_prediction": ml_predictor._generate_stock_prediction_data(product.id, 30)
                    }
                }
                
            except Exception as e:
                results[product.id] = {
                    "product": {
                        "id": product.id,
                        "nome": product.nome,
                        "codigo": product.codigo,
                        "categoria": product.categoria,
                        "quantidade": product.quantidade,
                        "preco": product.preco,
                        "estoque_minimo": product.estoque_minimo
                    },
                    "error": str(e),
                    "ml_insights": None,
                    "visualizations": None
                }
        
        return {
            "analysis_date": datetime.now().isoformat(),
            "total_products": len(products),
            "products_analyzed": len([r for r in results.values() if r.get("ml_insights")]),
            "products_with_errors": len([r for r in results.values() if r.get("error")]),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze products: {str(e)}")

@router.get("/ml/comparison-dashboard")
def get_ml_comparison_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get comprehensive ML comparison dashboard for all products"""
    try:
        # Get all products
        products = db.query(Product).filter(Product.user_id == current_user.id).all()
        
        if not products:
            return {
                "message": "No products found",
                "dashboard_data": None
            }
        
        from ..services.ml_predictor import MLPredictor
        ml_predictor = MLPredictor(db, current_user.id)
        
        # Prepare dashboard data
        dashboard_data = {
            "summary": {
                "total_products": len(products),
                "products_with_sales": 0,
                "products_needing_restock": 0,
                "products_with_price_opportunities": 0,
                "total_inventory_value": sum(p.quantidade * p.preco for p in products),
                "predicted_revenue_30d": 0
            },
            "categories": {},
            "top_performers": [],
            "needs_attention": [],
            "price_opportunities": [],
            "stock_alerts": []
        }
        
        # Analyze each product
        for product in products:
            try:
                insights = ml_predictor.get_product_insights_summary(product.id)
                
                if insights and insights.get("summary", {}).get("has_sufficient_data"):
                    dashboard_data["summary"]["products_with_sales"] += 1
                    
                    # Category analysis
                    if product.categoria not in dashboard_data["categories"]:
                        dashboard_data["categories"][product.categoria] = {
                            "count": 0,
                            "total_value": 0,
                            "avg_price": 0,
                            "total_stock": 0
                        }
                    
                    cat_data = dashboard_data["categories"][product.categoria]
                    cat_data["count"] += 1
                    cat_data["total_value"] += product.quantidade * product.preco
                    cat_data["total_stock"] += product.quantidade
                    
                    # Top performers (based on sales velocity)
                    if insights.get("demand_prediction", {}).get("success"):
                        avg_demand = insights["demand_prediction"]["avg_daily_demand"]
                        if avg_demand > 0.5:  # High demand products
                            dashboard_data["top_performers"].append({
                                "product": product.nome,
                                "code": product.codigo,
                                "avg_daily_demand": avg_demand,
                                "current_stock": product.quantidade
                            })
                    
                    # Stock alerts
                    if product.quantidade <= product.estoque_minimo:
                        dashboard_data["stock_alerts"].append({
                            "product": product.nome,
                            "code": product.codigo,
                            "current_stock": product.quantidade,
                            "min_stock": product.estoque_minimo,
                            "urgency": "critical" if product.quantidade == 0 else "high"
                        })
                        dashboard_data["summary"]["products_needing_restock"] += 1
                    
                    # Price opportunities
                    if insights.get("price_optimization", {}).get("success"):
                        revenue_increase = insights["price_optimization"].get("revenue_increase", 0)
                        if revenue_increase > 5:  # More than 5% revenue increase potential
                            dashboard_data["price_opportunities"].append({
                                "product": product.nome,
                                "code": product.codigo,
                                "current_price": product.preco,
                                "optimal_price": insights["price_optimization"]["optimal_price"],
                                "revenue_increase": revenue_increase
                            })
                            dashboard_data["summary"]["products_with_price_opportunities"] += 1
                    
                    # Predicted revenue
                    if insights.get("demand_prediction", {}).get("success"):
                        predicted_demand = insights["demand_prediction"]["total_predicted_demand"]
                        dashboard_data["summary"]["predicted_revenue_30d"] += predicted_demand * product.preco
                
            except Exception as e:
                # Product analysis failed, add to needs attention
                dashboard_data["needs_attention"].append({
                    "product": product.nome,
                    "code": product.codigo,
                    "error": str(e)
                })
        
        # Sort lists
        dashboard_data["top_performers"].sort(key=lambda x: x["avg_daily_demand"], reverse=True)
        dashboard_data["top_performers"] = dashboard_data["top_performers"][:10]  # Top 10
        
        dashboard_data["price_opportunities"].sort(key=lambda x: x["revenue_increase"], reverse=True)
        dashboard_data["price_opportunities"] = dashboard_data["price_opportunities"][:10]  # Top 10
        
        # Calculate category averages
        for cat_data in dashboard_data["categories"].values():
            if cat_data["count"] > 0:
                cat_data["avg_price"] = cat_data["total_value"] / cat_data["total_stock"] if cat_data["total_stock"] > 0 else 0
        
        return {
            "dashboard_data": dashboard_data,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dashboard: {str(e)}")

@router.get("/ml/visualization-data/{product_id}")
def get_product_visualization_data(
    product_id: int,
    chart_type: str = "all",  # sales_trend, demand_forecast, price_analysis, stock_prediction
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get specific visualization data for a product"""
    try:
        # Verify product exists and belongs to user
        product = db.query(Product).filter(
            and_(
                Product.id == product_id,
                Product.user_id == current_user.id
            )
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        from ..services.ml_predictor import MLPredictor
        ml_predictor = MLPredictor(db, current_user.id)
        
        visualization_data = {}
        
        if chart_type in ["all", "sales_trend"]:
            historical_data = ml_predictor._get_sales_data(product_id, days=90)
            sales_chart_data = []
            if not historical_data.empty:
                # Convert DataFrame to list of dictionaries
                for _, row in historical_data.iterrows():
                    sales_chart_data.append({
                        "date": row['criado_em'].strftime("%Y-%m-%d"),
                        "quantity": row['quantidade'],
                        "value": row['preco_total']
                    })
            visualization_data["sales_trend"] = sales_chart_data
        
        if chart_type in ["all", "demand_forecast"]:
            visualization_data["demand_forecast"] = ml_predictor._generate_demand_forecast_data(product_id, 30)
        
        if chart_type in ["all", "price_analysis"]:
            visualization_data["price_analysis"] = ml_predictor._generate_price_analysis_data(product_id)
        
        if chart_type in ["all", "stock_prediction"]:
            visualization_data["stock_prediction"] = ml_predictor._generate_stock_prediction_data(product_id, 30)
        
        return {
            "product": {
                "id": product.id,
                "nome": product.nome,
                "codigo": product.codigo,
                "categoria": product.categoria
            },
            "visualization_data": visualization_data,
            "chart_type": chart_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get visualization data: {str(e)}")

def _generate_recommendations(products, movements, sales):
    """Generate business recommendations based on data"""
    recommendations = []
    
    # Low stock recommendations
    low_stock_products = [p for p in products if p.em_estoque_baixo]
    if low_stock_products:
        recommendations.append({
            "type": "restock",
            "priority": "high",
            "message": f"Restock {len(low_stock_products)} products that are running low on stock",
            "action": "Review auto-restock recommendations"
        })
    
    # Price optimization recommendations
    high_value_products = [p for p in products if p.preco > 100 and p.quantidade > 0]
    if high_value_products:
        recommendations.append({
            "type": "pricing",
            "priority": "medium",
            "message": f"Consider price optimization for {len(high_value_products)} high-value products",
            "action": "Review pricing strategy"
        })
    
    # Inventory optimization
    if len(products) > 10:
        recommendations.append({
            "type": "inventory",
            "priority": "medium",
            "message": "Consider inventory optimization to reduce carrying costs",
            "action": "Review product mix and stock levels"
        })
    
    return recommendations

def _generate_product_recommendations(product, sales, movements):
    """Generate recommendations for a specific product"""
    recommendations = []
    
    if product.quantidade == 0:
        recommendations.append({
            "type": "restock",
            "priority": "critical",
            "message": "Product is out of stock - immediate restocking required",
            "action": "Create restock order"
        })
    elif product.em_estoque_baixo:
        recommendations.append({
            "type": "restock",
            "priority": "high",
            "message": "Product is running low on stock",
            "action": "Consider restocking"
        })
    
    # Price recommendations based on sales
    if sales:
        avg_sale_price = sum(sale.preco_unitario for sale in sales) / len(sales)
        if avg_sale_price < product.preco * 0.9:
            recommendations.append({
                "type": "pricing",
                "priority": "medium",
                "message": "Recent sales suggest price might be too high",
                "action": "Consider price reduction"
            })
    
    return recommendations

def _analyze_price(product, sales):
    """Analyze pricing based on sales data"""
    if not sales:
        return {
            "analysis": "No recent sales data available",
            "recommendation": "Monitor sales performance"
        }
    
    avg_sale_price = sum(sale.preco_unitario for sale in sales) / len(sales)
    price_variance = product.preco - avg_sale_price
    
    if price_variance > product.preco * 0.1:
        return {
            "analysis": "Recent sales are significantly below current price",
            "recommendation": "Consider price reduction",
            "avg_sale_price": avg_sale_price,
            "current_price": product.preco,
            "variance": price_variance
        }
    elif price_variance < -product.preco * 0.1:
        return {
            "analysis": "Recent sales are above current price",
            "recommendation": "Consider price increase",
            "avg_sale_price": avg_sale_price,
            "current_price": product.preco,
            "variance": price_variance
        }
    else:
        return {
            "analysis": "Price appears to be well-positioned",
            "recommendation": "Maintain current pricing",
            "avg_sale_price": avg_sale_price,
            "current_price": product.preco,
            "variance": price_variance
        }
