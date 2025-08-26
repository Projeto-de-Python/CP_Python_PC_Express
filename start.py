#!/usr/bin/env python3
"""
Simple startup script for PC-Express
"""
import subprocess
import sys
import os
import time
from pathlib import Path

def main():
    print("🚀 Starting PC-Express...")
    
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    
    # Start backend
    print("📡 Starting backend server...")
    backend_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "app.main:app", 
        "--reload", "--host", "0.0.0.0", "--port", "8000"
    ], cwd=script_dir)
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend
    print("🎨 Starting frontend server...")
    frontend_process = subprocess.Popen([
        "npm", "run", "dev"
    ], cwd=script_dir / "frontend")
    
    print("✅ Both servers started!")
    print("🌐 Backend: http://localhost:8000")
    print("🎨 Frontend: http://localhost:5173")
    print("📖 API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop both servers")
    
    try:
        # Wait for both processes
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped")

if __name__ == "__main__":
    main()
