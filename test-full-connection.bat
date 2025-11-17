@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   GrenGcry Connection Test
echo ========================================
echo.

set "PASS_COUNT=0"
set "FAIL_COUNT=0"

REM Test 1: Check MySQL
echo [1/8] Testing MySQL connection...
mysql -u root -p1691 -P 6969 -e "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] MySQL is running on port 6969
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] MySQL is not accessible
    set /a FAIL_COUNT+=1
)

REM Test 2: Check Database
echo [2/8] Testing database existence...
mysql -u root -p1691 -P 6969 -e "USE grengcry; SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Database 'grengcry' exists
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Database 'grengcry' not found
    set /a FAIL_COUNT+=1
)

REM Test 3: Check Backend Port
echo [3/8] Testing backend port availability...
netstat -ano | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Backend is running on port 8081
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Backend is not running on port 8081
    set /a FAIL_COUNT+=1
)

REM Test 4: Check Frontend Port
echo [4/8] Testing frontend port availability...
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Frontend is running on port 5173
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Frontend is not running on port 5173
    set /a FAIL_COUNT+=1
)

REM Test 5: Check Backend API
echo [5/8] Testing backend API endpoint...
curl -s http://localhost:8081/api/products >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Backend API is responding
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Backend API is not responding
    set /a FAIL_COUNT+=1
)

REM Test 6: Check Frontend
echo [6/8] Testing frontend accessibility...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Frontend is accessible
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Frontend is not accessible
    set /a FAIL_COUNT+=1
)

REM Test 7: Check .env file
echo [7/8] Testing environment configuration...
if exist ".env" (
    findstr "VITE_API_BASE" .env >nul 2>&1
    if !errorlevel! equ 0 (
        echo [PASS] Environment file configured
        set /a PASS_COUNT+=1
    ) else (
        echo [FAIL] VITE_API_BASE not found in .env
        set /a FAIL_COUNT+=1
    )
) else (
    echo [FAIL] .env file not found
    set /a FAIL_COUNT+=1
)

REM Test 8: Check node_modules
echo [8/8] Testing frontend dependencies...
if exist "node_modules\" (
    echo [PASS] Frontend dependencies installed
    set /a PASS_COUNT+=1
) else (
    echo [FAIL] Frontend dependencies not installed
    set /a FAIL_COUNT+=1
)

echo.
echo ========================================
echo   Test Results
echo ========================================
echo Passed: !PASS_COUNT!/8
echo Failed: !FAIL_COUNT!/8
echo.

if !FAIL_COUNT! equ 0 (
    echo [SUCCESS] All tests passed! Frontend and backend are fully connected.
    echo.
    echo You can now:
    echo - Access frontend at http://localhost:5173
    echo - Access backend API at http://localhost:8081/api
    echo - Test products endpoint: http://localhost:8081/api/products
) else (
    echo [WARNING] Some tests failed. Please check the following:
    echo.
    if !FAIL_COUNT! gtr 5 (
        echo - Start MySQL: net start MySQL80
        echo - Start backend: cd backend ^&^& mvn spring-boot:run
        echo - Start frontend: npm run dev
    ) else (
        echo - Review failed tests above
        echo - Check FRONTEND_BACKEND_CONNECTION.md for troubleshooting
    )
)

echo.
pause
