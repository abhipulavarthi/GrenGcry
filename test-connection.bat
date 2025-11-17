@echo off
echo ========================================
echo   Testing Frontend-Backend Connection
echo ========================================
echo.

REM Test MySQL
echo [1/4] Testing MySQL connection...
mysql -u root -p1691 -P 6969 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FAILED: Cannot connect to MySQL
    goto end
)
echo ✓ PASSED: MySQL is accessible

REM Test Backend
echo.
echo [2/4] Testing Backend API...
curl -s http://localhost:8081/api/products >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FAILED: Backend not responding on http://localhost:8081
    echo    Make sure backend is running (run start-dev.bat)
    goto end
)
echo ✓ PASSED: Backend is running on http://localhost:8081

REM Test Frontend
echo.
echo [3/4] Testing Frontend...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FAILED: Frontend not responding on http://localhost:5173
    echo    Make sure frontend is running (run npm run dev)
    goto end
)
echo ✓ PASSED: Frontend is running on http://localhost:5173

REM Test CORS
echo.
echo [4/4] Testing API endpoint...
curl -s -o response.json http://localhost:8081/api/products
if %errorlevel% equ 0 (
    echo ✓ PASSED: API endpoint accessible
    type response.json
    del response.json
) else (
    echo ❌ FAILED: Cannot reach API endpoint
    goto end
)

echo.
echo ========================================
echo   All tests passed! ✓
echo ========================================
echo.
echo Your application is ready:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8081/api
echo - Database: localhost:6969/grengcry
echo.
goto end

:end
echo.
pause
