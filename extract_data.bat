@echo off
echo 🥭 Mango B2C - Data Extractor
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

REM Check if requests is installed
python -c "import requests" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing required packages...
    pip install -r requirements.txt
)

echo 📊 Extracting data from Supabase...
python supabase_extractor.py

echo.
echo ✅ Data extraction complete!
echo 📁 Check the 'exports' folder for CSV files
echo.
pause
