# PC-Express 🖥️

A simple and efficient inventory management system for computer parts and electronics.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd PC-Express
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirement.txt

# Initialize database
python scripts/seed.py
python scripts/migrate_auth.py
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

**Option 1: Use the simple start script**
```bash
python start.py
```

**Option 2: Start manually**
```bash
# Terminal 1 - Backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Default Login
- **Email**: admin@pc-express.com
- **Password**: admin123

## 📋 Features

- **Product Management**: Add, edit, and track computer parts
- **Stock Control**: Monitor inventory levels and movements
- **Supplier Management**: Manage supplier information
- **Purchase Orders**: Create and track orders
- **Auto-Restock**: Automatic restock suggestions based on stock levels
- **Business Insights**: Sales analytics and stock health monitoring
- **User Authentication**: Secure login system

## 🏗️ Architecture

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React + Material-UI
- **Database**: SQLite (included)

## 📁 Project Structure

```
PC-Express/
├── app/                    # Backend application
│   ├── routers/           # API endpoints
│   ├── models.py          # Database models
│   ├── crud.py            # Database operations
│   └── main.py            # FastAPI app
├── frontend/              # React frontend
│   └── src/
│       ├── components/    # React components
│       └── services/      # API services
├── scripts/               # Database setup scripts
└── start.py              # Simple startup script
```

## 🔧 Development

The application uses a simple architecture:
- **Models**: Define database structure
- **CRUD**: Handle database operations
- **Routers**: Define API endpoints
- **Components**: React UI components
- **Services**: Frontend API communication

## 📝 License

This project is for educational and personal use.
