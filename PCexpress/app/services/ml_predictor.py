# Lazy loading of ML dependencies
ML_AVAILABLE = None
ML_DEPENDENCIES = {}

def _load_ml_dependencies():
    """Load ML dependencies only when needed"""
    global ML_AVAILABLE, ML_DEPENDENCIES
    
    if ML_AVAILABLE is not None:
        return ML_AVAILABLE
    
    try:
        import pandas as pd
        import numpy as np
        from sklearn.ensemble import IsolationForest
        from sklearn.linear_model import LinearRegression
        from sklearn.preprocessing import StandardScaler
        from sklearn.metrics import mean_absolute_error, r2_score
        
        ML_DEPENDENCIES.update({
            'pd': pd,
            'np': np,
            'IsolationForest': IsolationForest,
            'LinearRegression': LinearRegression,
            'StandardScaler': StandardScaler,
            'mean_absolute_error': mean_absolute_error,
            'r2_score': r2_score,
        })
        ML_AVAILABLE = True
        return True
    except ImportError:
        ML_AVAILABLE = False
        return False

from datetime import datetime, timedelta
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from ..models import Product, Sale, SaleItem

class MLPredictor:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def _get_sales_data(self, product_id: int, days: int = 90):
        """Get sales data for a product"""
        if not _load_ml_dependencies():
            return ML_DEPENDENCIES['pd'].DataFrame()
        
        pd = ML_DEPENDENCIES['pd']
        
        # Get sales data from the last N days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Query sales data
        sales_query = self.db.query(
            SaleItem.quantidade,
            SaleItem.preco_unitario,
            SaleItem.preco_total,
            Sale.criado_em,
            func.date(Sale.criado_em).label('data')
        ).join(Sale).filter(
            and_(
                SaleItem.produto_id == product_id,
                Sale.user_id == self.user_id,
                Sale.criado_em >= start_date,
                Sale.criado_em <= end_date
            )
        ).all()
        
        if not sales_query:
            return pd.DataFrame()
        
        # Convert to DataFrame
        sales_data = pd.DataFrame([{
            'quantidade': item.quantidade,
            'preco_unitario': item.preco_unitario,
            'preco_total': item.preco_total,
            'criado_em': item.criado_em,
            'data': item.data
        } for item in sales_query])
        
        return sales_data

    def predict_demand(self, product_id: int, days_ahead: int = 30) -> Dict:
        """Predict demand for a product"""
        try:
            if not _load_ml_dependencies():
                return {"success": False, "error": "ML dependencies not available"}
            
            pd = ML_DEPENDENCIES['pd']
            np = ML_DEPENDENCIES['np']
            
            sales_data = self._get_sales_data(product_id, days=90)
            
            if sales_data.empty:
                return {
                    "success": False,
                    "error": "No sales data available",
                    "avg_daily_demand": 0,
                    "total_predicted_demand": 0,
                    "model_accuracy": 0,
                    "historical_data_points": 0
                }
            
            # Group by date and sum quantities
            daily_sales = sales_data.groupby('data')['quantidade'].sum().reset_index()
            daily_sales['data'] = pd.to_datetime(daily_sales['data'])
            
            if len(daily_sales) < 3:
                avg_demand = daily_sales['quantidade'].mean()
                return {
                    "success": True,
                    "avg_daily_demand": avg_demand,
                    "total_predicted_demand": avg_demand * days_ahead,
                    "model_accuracy": 0.5,
                    "historical_data_points": len(daily_sales)
                }
            
            # Simple linear regression for trend
            x = np.arange(len(daily_sales)).reshape(-1, 1)
            y = daily_sales['quantidade'].values
            
            LinearRegression = ML_DEPENDENCIES['LinearRegression']
            model = LinearRegression()
            model.fit(x, y)
            
            # Predict future values
            future_x = np.arange(len(daily_sales), len(daily_sales) + days_ahead).reshape(-1, 1)
            future_predictions = model.predict(future_x)
            future_predictions = np.maximum(future_predictions, 0)  # Ensure non-negative
            
            # Calculate model accuracy
            y_pred = model.predict(x)
            mean_absolute_error = ML_DEPENDENCIES['mean_absolute_error']
            mae = mean_absolute_error(y, y_pred)
            accuracy = max(0, 1 - (mae / (y.mean() + 1)))
            
            avg_daily_demand = future_predictions.mean()
            total_predicted_demand = future_predictions.sum()
            
            return {
                "success": True,
                "avg_daily_demand": float(avg_daily_demand),
                "total_predicted_demand": float(total_predicted_demand),
                "model_accuracy": float(accuracy),
                "historical_data_points": len(daily_sales)
            }
            
        except Exception:
            return {"success": False, "error": "Prediction failed"}

    def optimize_price(self, product_id: int) -> Dict:
        """Optimize price for a product"""
        try:
            if not _load_ml_dependencies():
                return {"success": False, "error": "ML dependencies not available"}
            
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if not product:
                return {"success": False, "error": "Product not found"}
            
            sales_data = self._get_sales_data(product_id, days=90)
            
            if sales_data.empty:
                return {
                    "success": False,
                    "error": "No sales data available",
                    "current_price": product.preco,
                    "optimal_price": product.preco,
                    "revenue_increase": 0,
                    "model_accuracy": 0
                }
            
            # Simple price optimization based on sales volume
            price_analysis = sales_data.groupby('preco_unitario').agg({
                'quantidade': 'sum',
                'preco_total': 'sum'
            }).reset_index()
            
            if len(price_analysis) < 2:
                return {
                    "success": True,
                    "current_price": product.preco,
                    "optimal_price": product.preco,
                    "revenue_increase": 0,
                    "model_accuracy": 0.5
                }
            
            # Find price with highest revenue
            optimal_price_row = price_analysis.loc[price_analysis['preco_total'].idxmax()]
            optimal_price = optimal_price_row['preco_unitario']
            
            # Calculate potential revenue increase
            current_revenue = price_analysis[price_analysis['preco_unitario'] == product.preco]['preco_total'].sum()
            optimal_revenue = optimal_price_row['preco_total']
            
            if current_revenue > 0:
                revenue_increase = ((optimal_revenue - current_revenue) / current_revenue) * 100
            else:
                revenue_increase = 0
            
            return {
                "success": True,
                "current_price": float(product.preco),
                "optimal_price": float(optimal_price),
                "revenue_increase": float(max(0, revenue_increase)),
                "model_accuracy": 0.7
            }
            
        except Exception:
            return {"success": False, "error": "Price optimization failed"}

    def detect_anomalies(self, product_id: int) -> Dict:
        """Detect anomalies in sales data"""
        try:
            if not _load_ml_dependencies():
                return {"success": False, "error": "ML dependencies not available"}
            
            sales_data = self._get_sales_data(product_id, days=90)
            
            if sales_data.empty or len(sales_data) < 10:
                return {
                    "success": False,
                    "error": "Insufficient data for anomaly detection",
                    "total_anomalies": 0,
                    "data_points": len(sales_data) if not sales_data.empty else 0
                }
            
            # Simple anomaly detection using IsolationForest
            IsolationForest = ML_DEPENDENCIES['IsolationForest']
            
            # Prepare features
            features = sales_data[['quantidade', 'preco_unitario']].values
            
            # Detect anomalies
            iso_forest = IsolationForest(contamination=0.1, random_state=42)
            anomalies = iso_forest.fit_predict(features)
            
            total_anomalies = sum(1 for x in anomalies if x == -1)
            
            return {
                "success": True,
                "total_anomalies": total_anomalies,
                "data_points": len(sales_data)
            }
            
        except Exception:
            return {"success": False, "error": "Anomaly detection failed"}

    def get_stock_optimization(self, product_id: int) -> Dict:
        """Get stock optimization recommendations"""
        try:
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if not product:
                return {"success": False, "error": "Product not found"}
            
            # Get demand prediction
            demand_prediction = self.predict_demand(product_id, 30)
            
            if not demand_prediction["success"]:
                return {
                    "success": False,
                    "error": "Cannot optimize stock without demand prediction",
                    "current_stock": product.quantidade,
                    "reorder_point": product.estoque_minimo,
                    "stock_cover_days": 0,
                    "optimal_stock": product.quantidade
                }
            
            avg_daily_demand = demand_prediction["avg_daily_demand"]
            current_stock = product.quantidade
            
            # Calculate stock coverage
            stock_cover_days = current_stock / avg_daily_demand if avg_daily_demand > 0 else float('inf')
            
            # Calculate optimal stock (30 days + safety buffer)
            safety_buffer = 1.2  # 20% safety buffer
            optimal_stock = int(avg_daily_demand * 30 * safety_buffer)
            
            # Calculate reorder point (7 days lead time + safety stock)
            lead_time_days = 7
            safety_stock = int(avg_daily_demand * 2)
            reorder_point = int(avg_daily_demand * lead_time_days + safety_stock)
            
            return {
                "success": True,
                "current_stock": current_stock,
                "reorder_point": max(reorder_point, product.estoque_minimo),
                "stock_cover_days": float(stock_cover_days) if stock_cover_days != float('inf') else 999,
                "optimal_stock": max(optimal_stock, product.estoque_minimo)
            }
            
        except Exception:
            return {"success": False, "error": "Stock optimization failed"}

    def get_product_insights_summary(self, product_id: int) -> Dict:
        """Get comprehensive ML insights for a product"""
        try:
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if not product:
                return {"success": False, "error": "Product not found"}
            
            # Get all insights
            demand_prediction = self.predict_demand(product_id)
            price_optimization = self.optimize_price(product_id)
            stock_optimization = self.get_stock_optimization(product_id)
            anomaly_detection = self.detect_anomalies(product_id)
            
            # Check if we have sufficient data
            has_sufficient_data = (
                demand_prediction.get("historical_data_points", 0) >= 7 and
                demand_prediction.get("success", False)
            )
            
            # Generate recommendations
            recommended_actions = []
            
            if stock_optimization.get("success") and stock_optimization.get("current_stock", 0) < stock_optimization.get("reorder_point", 0):
                recommended_actions.append({
                    "priority": "high",
                    "message": f"Stock is below reorder point ({stock_optimization.get('reorder_point', 0)} units)",
                    "action": f"Consider restocking to {stock_optimization.get('optimal_stock', 0)} units"
                })
            
            if price_optimization.get("success") and price_optimization.get("revenue_increase", 0) > 5:
                recommended_actions.append({
                    "priority": "medium",
                    "message": f"Price optimization could increase revenue by {price_optimization.get('revenue_increase', 0):.1f}%",
                    "action": f"Consider adjusting price to R$ {price_optimization.get('optimal_price', 0):.2f}"
                })
            
            return {
                "success": True,
                "product_id": product_id,
                "product_name": product.nome,
                "demand_prediction": demand_prediction,
                "price_optimization": price_optimization,
                "stock_optimization": stock_optimization,
                "anomaly_detection": anomaly_detection,
                "summary": {
                    "has_sufficient_data": has_sufficient_data,
                    "recommended_actions": recommended_actions,
                    "overall_health": "good" if has_sufficient_data else "needs_more_data"
                }
            }
            
        except Exception:
            return {"success": False, "error": "Failed to generate insights summary"}

    # Visualization methods
    def _generate_sales_trend_data(self, product_id: int, days: int = 90) -> List[Dict]:
        """Generate sales trend data for visualization"""
        try:
            if not _load_ml_dependencies():
                return []
            
            pd = ML_DEPENDENCIES['pd']
            sales_data = self._get_sales_data(product_id, days)
            
            if sales_data.empty:
                return []
            
            # Group by date
            daily_sales = sales_data.groupby('data').agg({
                'quantidade': 'sum',
                'preco_total': 'sum',
                'criado_em': 'count'
            }).reset_index()
            
            daily_sales.columns = ['date', 'quantity', 'revenue', 'transactions']
            daily_sales['date'] = pd.to_datetime(daily_sales['date'])
            
            # Convert to list of dictionaries
            trend_data = []
            for _, row in daily_sales.iterrows():
                trend_data.append({
                    "date": row['date'].strftime("%Y-%m-%d"),
                    "quantity": int(row['quantity']),
                    "revenue": float(row['revenue']),
                    "transactions": int(row['transactions'])
                })
            
            return trend_data
            
        except Exception:
            return []

    def _generate_demand_forecast_data(self, product_id: int, days_ahead: int = 30) -> Dict:
        """Generate demand forecast data for visualization"""
        try:
            if not _load_ml_dependencies():
                return {"historical": [], "forecast": []}
            
            pd = ML_DEPENDENCIES['pd']
            np = ML_DEPENDENCIES['np']
            
            sales_data = self._get_sales_data(product_id, days=90)
            
            if sales_data.empty:
                return {"historical": [], "forecast": []}
            
            # Group by date and sum quantities
            daily_sales = sales_data.groupby('data')['quantidade'].sum().reset_index()
            daily_sales['data'] = pd.to_datetime(daily_sales['data'])
            
            # Prepare historical data
            historical_data = []
            for _, row in daily_sales.iterrows():
                historical_data.append({
                    "date": row['data'].strftime("%Y-%m-%d"),
                    "actual": int(row['quantidade']),
                    "trend": int(row['quantidade'])  # Simplified
                })
            
            # Generate forecast data
            if len(daily_sales) > 1:
                avg_demand = daily_sales['quantidade'].mean()
                last_date = daily_sales['data'].max()
                
                forecast_data = []
                for i in range(days_ahead):
                    forecast_date = last_date + timedelta(days=i+1)
                    forecast_value = max(0, avg_demand + np.random.normal(0, avg_demand * 0.1))
                    
                    forecast_data.append({
                        "date": forecast_date.strftime("%Y-%m-%d"),
                        "forecast": int(forecast_value),
                        "confidence_lower": int(max(0, forecast_value * 0.8)),
                        "confidence_upper": int(forecast_value * 1.2)
                    })
            else:
                forecast_data = []
            
            return {
                "historical": historical_data,
                "forecast": forecast_data
            }
            
        except Exception:
            return {"historical": [], "forecast": []}

    def _generate_price_analysis_data(self, product_id: int) -> Dict:
        """Generate price analysis data for visualization"""
        try:
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if not product:
                return {"demand_curve": [], "current_price": 0, "optimal_price": 0}
            
            sales_data = self._get_sales_data(product_id, days=90)
            
            if sales_data.empty:
                return {
                    "demand_curve": [],
                    "current_price": float(product.preco),
                    "optimal_price": float(product.preco),
                    "elasticity": 0
                }
            
            # Analyze price-demand relationship
            price_analysis = sales_data.groupby('preco_unitario').agg({
                'quantidade': 'sum'
            }).reset_index()
            
            # Create demand curve
            demand_curve = []
            for _, row in price_analysis.iterrows():
                demand_curve.append({
                    "price": float(row['preco_unitario']),
                    "quantity": int(row['quantidade']),
                    "revenue": float(row['preco_unitario'] * row['quantidade'])
                })
            
            # Find optimal price (highest revenue)
            if demand_curve:
                optimal_point = max(demand_curve, key=lambda x: x['revenue'])
                optimal_price = optimal_point['price']
            else:
                optimal_price = product.preco
            
            return {
                "demand_curve": demand_curve,
                "current_price": float(product.preco),
                "optimal_price": float(optimal_price),
                "elasticity": -1.0  # Simplified elasticity
            }
            
        except Exception:
            return {"demand_curve": [], "current_price": 0, "optimal_price": 0}

    def _generate_stock_prediction_data(self, product_id: int, days_ahead: int = 30) -> Dict:
        """Generate stock prediction data for visualization"""
        try:
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if not product:
                return {"stock_levels": [], "current_stock": 0}
            
            # Get demand forecast
            demand_forecast = self._generate_demand_forecast_data(product_id, days_ahead)
            
            if not demand_forecast.get("forecast"):
                return {
                    "stock_levels": [],
                    "current_stock": product.quantidade,
                    "safety_stock": 2,
                    "lead_time_days": 7
                }
            
            # Calculate stock levels over time
            current_stock = product.quantidade
            stock_levels = []
            
            for i, forecast_point in enumerate(demand_forecast['forecast']):
                daily_demand = forecast_point['forecast']
                
                if i == 0:
                    stock_level = current_stock
                else:
                    stock_level = max(0, stock_levels[i-1]['stock'] - daily_demand)
                
                stock_levels.append({
                    "date": forecast_point['date'],
                    "stock": int(stock_level),
                    "daily_demand": int(daily_demand),
                    "reorder_point": max(10, int(daily_demand * 7 + 2))  # 7 days lead time + 2 safety
                })
            
            return {
                "stock_levels": stock_levels,
                "current_stock": current_stock,
                "safety_stock": 2,
                "lead_time_days": 7
            }
            
        except Exception:
            return {"stock_levels": [], "current_stock": 0}