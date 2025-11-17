@echo off
echo ========================================
echo   GrenGcry - Full Stack Startup
echo   Frontend + Backend Connection
echo ========================================
echo.

REM Step 1: Verify MySQL
echo [Step 1/5] Verifying MySQL connection...
mysql -u root -p1691 -P 6969 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not running on port 6969
    echo Please start MySQL: net start MySQL80
    pause
    exit /b 1
)
echo [OK] MySQL is running

REM Step 2: Verify Database
echo [Step 2/5] Verifying database...
mysql -u root -p1691 -P 6969 -e "USE grengcry; SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Database 'grengcry' not found
    set /p create_db="Create database now? (y/n): "
    if /i "!create_db!"=="y" (
        echo Creating database...
        mysql -u root -p1691 -P 6969 < backend\schema.sql
        if !errorlevel! neq 0 (
            echo [ERROR] Failed to create database
            pause
            exit /b 1
        )
        echo [OK] Database created
    ) else (
        echo Please create database manually
        pause
        exit /b 1
    )
) else (
    echo [OK] Database exists
)

REM Step 3: Verify Frontend Dependencies
echo [Step 3/5] Verifying frontend dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)
echo [OK] Dependencies ready

REM Step 4: Verify Environment Configuration
echo [Step 4/5] Verifying environment configuration...
if not exist ".env" (
    echo [WARNING] .env file not found, creating from .env.example
    copy .env.example .env >nul
)
findstr "VITE_API_BASE" .env >nul 2>&1
if %errorlevel% neq 0 (
    echo VITE_API_BASE=http://localhost:8081/api >> .env
)
echo [OK] Environment configured

REM Step 5: Check if ports are available
echo [Step 5/5] Checking port availability...
netstat -ano | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use
    set /p kill_8081="Kill process on port 8081? (y/n): "
    if /i "!kill_8081!"=="y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do (
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is already in use
    set /p kill_5173="Kill process on port 5173? (y/n): "
    if /i "!kill_5173!"=="y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)
echo [OK] Ports ready

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.
echo Backend will start on: http://localhost:8081/api
echo Frontend will start on: http://localhost:5173
echo.
echo IMPORTANT:
echo - Backend opens in a new window (keep it open)
echo - Frontend starts in this window
echo - Press Ctrl+C to stop each service
echo.
echo API Endpoints will be available at:
echo - Products: http://localhost:8081/api/products
echo - Auth: http://localhost:8081/api/auth/login
echo - Orders: http://localhost:8081/api/orders
echo - Feedback: http://localhost:8081/api/feedback
echo.
pause

REM Start backend in new window
echo Starting backend...
start "GrenGcry Backend (Port 8081)" cmd /k "cd backend && echo Starting Spring Boot Backend... && mvn spring-boot:run"

REM Wait for backend to initialize
echo.
echo Waiting for backend to start (20 seconds)...
echo You can check the backend window for startup progress.
timeout /t 20 /nobreak >nul

REM Test backend
echo.
echo Testing backend connection...
curl -s http://localhost:8081/api/products >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is responding
) else (
    echo [WARNING] Backend may still be starting...
    echo Check the backend window for errors
)

REM Start frontend
echo.
echo Starting frontend...
echo.
call npm run dev

REM If we get here, frontend was stopped
echo.
echo ========================================
echo Frontend stopped.
echo Backend is still running in the other window.
echo To stop backend, close the backend window.
echo ========================================
pause
