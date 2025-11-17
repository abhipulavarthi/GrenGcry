@echo off
echo =====================================
echo   GrenGcry Backend - Quick Start
echo =====================================
echo.

echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo Checking Maven installation...
call mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven 3.6 or higher
    pause
    exit /b 1
)

echo.
echo Cleaning previous builds...
call mvn clean

echo.
echo Building application...
call mvn install -DskipTests

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo =====================================
echo Starting GrenGcry Backend...
echo Application will run on http://localhost:8081
echo Press Ctrl+C to stop
echo =====================================
echo.

call mvn spring-boot:run

pause
