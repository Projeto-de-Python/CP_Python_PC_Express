#!/usr/bin/env python3
"""
Migration script to add authentication and user isolation to existing database.
This script will:
1. Create the users table
2. Add user_id columns to existing tables
3. Create a default admin user
4. Migrate existing data to be owned by the admin user
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.auth import get_password_hash
from app.database import SQLALCHEMY_DATABASE_URL
from app.models import Product, PurchaseOrder, Sale, Supplier, User


def migrate_database():
    """Migrate the database to include authentication and user isolation."""

    # Create engine and session
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        print("Starting database migration for authentication...")

        # Check if users table exists
        result = db.execute(
            text(
                """
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='users'
        """
            )
        )

        if result.fetchone():
            print("Users table already exists. Skipping migration.")
            return

        print("Creating users table...")

        # Create users table
        db.execute(
            text(
                """
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                hashed_password VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """
            )
        )

        # Create indexes
        db.execute(text("CREATE INDEX ix_users_email ON users (email)"))
        db.execute(text("CREATE INDEX ix_users_id ON users (id)"))

        print("Adding user_id columns to existing tables...")

        # Add user_id column to suppliers table
        db.execute(text("ALTER TABLE suppliers ADD COLUMN user_id INTEGER"))

        # Add user_id column to products table
        db.execute(text("ALTER TABLE products ADD COLUMN user_id INTEGER"))

        # Add user_id column to sales table
        db.execute(text("ALTER TABLE sales ADD COLUMN user_id INTEGER"))

        # Add user_id column to purchase_orders table
        db.execute(text("ALTER TABLE purchase_orders ADD COLUMN user_id INTEGER"))

        # Create indexes for user_id columns
        db.execute(text("CREATE INDEX ix_suppliers_user_id ON suppliers (user_id)"))
        db.execute(text("CREATE INDEX ix_products_user_id ON products (user_id)"))
        db.execute(text("CREATE INDEX ix_sales_user_id ON sales (user_id)"))
        db.execute(text("CREATE INDEX ix_purchase_orders_user_id ON purchase_orders (user_id)"))

        print("Creating default admin user...")

        # Create default admin user
        admin_user = User(
            email="admin@pc-express.com", hashed_password=get_password_hash("admin123")
        )
        db.add(admin_user)
        db.flush()  # Get the ID

        print(f"Created admin user with ID: {admin_user.id}")

        print("Migrating existing data to admin user...")

        # Update existing suppliers
        db.execute(text("UPDATE suppliers SET user_id = :user_id"), {"user_id": admin_user.id})

        # Update existing products
        db.execute(text("UPDATE products SET user_id = :user_id"), {"user_id": admin_user.id})

        # Update existing sales
        db.execute(text("UPDATE sales SET user_id = :user_id"), {"user_id": admin_user.id})

        # Update existing purchase orders
        db.execute(
            text("UPDATE purchase_orders SET user_id = :user_id"), {"user_id": admin_user.id}
        )

        # Make user_id columns NOT NULL
        db.execute(
            text(
                """
            CREATE TABLE suppliers_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                telefone VARCHAR(50),
                cnpj VARCHAR(50),
                observacoes TEXT,
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """
            )
        )

        db.execute(
            text(
                """
            INSERT INTO suppliers_new 
            SELECT id, user_id, nome, email, telefone, cnpj, observacoes, criado_em 
            FROM suppliers
        """
            )
        )

        db.execute(text("DROP TABLE suppliers"))
        db.execute(text("ALTER TABLE suppliers_new RENAME TO suppliers"))

        # Recreate indexes
        db.execute(text("CREATE INDEX ix_suppliers_id ON suppliers (id)"))
        db.execute(text("CREATE INDEX ix_suppliers_user_id ON suppliers (user_id)"))

        db.commit()

        print("Migration completed successfully!")
        print("Default admin credentials:")
        print("Email: admin@pc-express.com")
        print("Password: admin123")
        print("\nPlease change these credentials after first login!")

    except Exception as e:
        db.rollback()
        print(f"Migration failed: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate_database()
