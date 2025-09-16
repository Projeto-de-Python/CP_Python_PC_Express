import os

from app import models
from app.database import Base, engine


def recreate_database():
    """Recreate the database with the correct structure"""
    try:
        # Drop all tables
        print("🗑️  Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)

        # Create all tables
        print("🏗️  Creating new tables...")
        Base.metadata.create_all(bind=engine)

        print("✅ Database recreated successfully!")
        print("📝 Next steps:")
        print(
            "   1. Run: python -c \"import sys; sys.path.append('.'); from scripts.seed import run; run()\""
        )
        print(
            "   2. Run: python -c \"import sys; sys.path.append('.'); from scripts.update_prices import update_prices; update_prices()\""
        )
        print("   3. Start the backend server")

    except Exception as e:
        print(f"❌ Error recreating database: {e}")


if __name__ == "__main__":
    recreate_database()
