@echo off
echo Starting TBB App Mobile Development Server...
echo.

echo Step 1: Starting Laravel Server...
start "Laravel Server" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo Step 2: Starting Vite Development Server...
start "Vite Server" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo.
echo To access from smartphone:
echo 1. Find your computer's IP address using 'ipconfig'
echo 2. Access from smartphone: http://[YOUR_IP]:8000
echo.
echo Example: http://192.168.1.100:8000
echo.
echo Press any key to exit...
pause > nul 