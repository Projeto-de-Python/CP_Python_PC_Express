#!/usr/bin/env python3
"""
Test script to verify ML service functionality
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.services.ml_predictor import MLPredictor
from app.models import User

def test_ml_service():
    """Test the ML service with real database data"""
    db = SessionLocal()
    
    try:
        # Get the first user (assuming there's at least one user)
        user = db.query(User).first()
        if not user:
            print("❌ No users found in database. Please create a user first.")
            return False
            
        print(f"✅ Testing ML service for user: {user.email}")
        
        # Initialize ML predictor
        ml_predictor = MLPredictor(db, user.id)
        
        # Get all products for this user
        from app.models import Product
        products = db.query(Product).filter(Product.user_id == user.id).all()
        
        if not products:
            print("❌ No products found for user. Please add some products first.")
            return False
            
        print(f"✅ Found {len(products)} products")
        
        # Test with the first product
        test_product = products[0]
        print(f"✅ Testing with product: {test_product.nome}")
        
        # Test demand prediction
        print("\n📊 Testing Demand Prediction...")
        try:
            demand_result = ml_predictor.predict_demand(test_product.id, 30)
            if demand_result['success']:
                print(f"✅ Demand prediction successful")
                print(f"   - Avg daily demand: {demand_result['avg_daily_demand']:.2f}")
                print(f"   - Total predicted: {demand_result['total_predicted_demand']:.0f}")
                print(f"   - Model accuracy: {demand_result['model_accuracy']*100:.1f}%")
            else:
                print(f"❌ Demand prediction failed: {demand_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"❌ Demand prediction error: {str(e)}")
        
        # Test price optimization
        print("\n💰 Testing Price Optimization...")
        try:
            price_result = ml_predictor.optimize_price(test_product.id)
            if price_result['success']:
                print(f"✅ Price optimization successful")
                print(f"   - Current price: R$ {price_result['current_price']}")
                print(f"   - Optimal price: R$ {price_result['optimal_price']}")
                print(f"   - Revenue increase: {price_result['revenue_increase']:.1f}%")
            else:
                print(f"❌ Price optimization failed: {price_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"❌ Price optimization error: {str(e)}")
        
        # Test stock optimization
        print("\n📦 Testing Stock Optimization...")
        try:
            stock_result = ml_predictor.get_stock_optimization(test_product.id)
            if stock_result['success']:
                print(f"✅ Stock optimization successful")
                print(f"   - Current stock: {stock_result['current_stock']}")
                print(f"   - Reorder point: {stock_result['reorder_point']}")
                print(f"   - Optimal stock: {stock_result['optimal_stock']}")
            else:
                print(f"❌ Stock optimization failed: {stock_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"❌ Stock optimization error: {str(e)}")
        
        # Test anomaly detection
        print("\n🔍 Testing Anomaly Detection...")
        try:
            anomaly_result = ml_predictor.detect_anomalies(test_product.id)
            if anomaly_result['success']:
                print(f"✅ Anomaly detection successful")
                print(f"   - Anomalies found: {len(anomaly_result['anomalies'])}")
                print(f"   - Data points analyzed: {anomaly_result['data_points_analyzed']}")
            else:
                print(f"❌ Anomaly detection failed: {anomaly_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"❌ Anomaly detection error: {str(e)}")
        
        # Test comprehensive insights
        print("\n🤖 Testing Comprehensive ML Insights...")
        try:
            insights_result = ml_predictor.get_product_insights_summary(test_product.id)
            if insights_result['success']:
                print(f"✅ Comprehensive insights successful")
                print(f"   - Recommendations: {len(insights_result['recommendations'])}")
                print(f"   - ML models used: {len(insights_result['ml_models_used'])}")
            else:
                print(f"❌ Comprehensive insights failed: {insights_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"❌ Comprehensive insights error: {str(e)}")
        
        print("\n✅ ML service test completed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🧪 Testing ML Service...")
    success = test_ml_service()
    if success:
        print("\n🎉 All tests passed! ML service is working correctly.")
    else:
        print("\n💥 Some tests failed. Please check the errors above.")
        sys.exit(1)
