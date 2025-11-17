@echo off
echo ========================================
echo   GrenGcry Full Stack Development
echo ========================================
echo.

REM Check if MySQL is running
echo [1/3] Checking MySQL connection...
mysql -u root -p1691 -P 6969 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL on port 6969
    echo Please make sure MySQL is running and accessible
    echo.
    echo To start MySQL: net start MySQL80
    pause
    exit /b 1
)
echo ✓ MySQL is running

REM Check if database exists
echo [2/3] Checking database...
mysql -u root -p1691 -P 6969 -e "USE grengcry; SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Database 'grengcry' not found
    echo.
    set /p create_db="Do you want to create it now? (y/n): "
    if /i "%create_db%"=="y" (
        echo Creating database and tables...
        mysql -u root -p1691 -P 6969 < backend\schema.sql
        if %errorlevel% neq 0 (
            echo ERROR: Failed to create database
            pause
            exit /b 1
        )
        echo ✓ Database created successfully
    ) else (
        echo Please create the database manually and run this script again
        pause
        exit /b 1
    )
) else (
    echo ✓ Database exists
)

REM Check if node_modules exists
echo [3/3] Checking frontend dependencies...
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)
echo ✓ Dependencies ready

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.
echo Starting backend on http://localhost:8081
echo Starting frontend on http://localhost:5173
echo.
echo IMPORTANT:
echo - Backend will open in a new window
echo - Frontend will start in this window
echo - Keep both windows open while developing
echo - Press Ctrl+C in each window to stop
echo.
pause

REM Start backend in new window
start "GrenGcry Backend" cmd /k "cd backend && mvn spring-boot:run"

REM Wait a bit for backend to start
echo Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

REM Start frontend in current window
echo.
echo Starting frontend...
echo.
call npm run dev

REM If we get here, frontend was stopped
echo.
echo Frontend stopped. Backend is still running in separate window.
echo To stop backend, close the backend terminal window.
pause
