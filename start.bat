@echo off
echo ========================================================
echo   Memulai DuoVenture - Bucketlist & Catatan Keuangan 
echo ========================================================
echo.

start "DuoVenture Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "DuoVenture Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Aplikasi sedang dijalankan!
echo Silakan buka browser di: http://localhost:3000
echo.
pause
