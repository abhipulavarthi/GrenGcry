@echo off
echo ========================================
echo   Starting Frontend (Vite Dev Server)
echo ========================================
echo.

echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Vite dev server on http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev

pause
