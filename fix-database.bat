@echo off
echo ========================================
echo   Fix Database Issue
echo ========================================
echo.

echo This script will create the 'grengcry' database.
echo.
echo Please follow these steps:
echo.
echo 1. Open MySQL Workbench or MySQL Command Line Client
echo 2. Connect to MySQL on port 6969
echo 3. Run this command:
echo.
echo    CREATE DATABASE IF NOT EXISTS grengcry;
echo.
echo 4. Verify with:
echo.
echo    SHOW DATABASES LIKE 'grengcry';
echo.
echo.
echo Alternatively, if you have mysql in PATH:
echo.
echo    mysql -u root -p -P 6969 -e "CREATE DATABASE IF NOT EXISTS grengcry"
echo.
echo.
echo After creating the database:
echo 1. Restart the backend (Ctrl+C and run again)
echo 2. The tables will be auto-created by Spring Boot
echo.
pause

REM Try to find MySQL installation
echo.
echo Searching for MySQL installation...
echo.

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    echo Found MySQL at: C:\Program Files\MySQL\MySQL Server 8.0\bin\
    echo.
    set /p create="Create database now? (y/n): "
    if /i "!create!"=="y" (
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p1691 -P 6969 -e "CREATE DATABASE IF NOT EXISTS grengcry"
        if !errorlevel! equ 0 (
            echo.
            echo [SUCCESS] Database created!
            "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p1691 -P 6969 -e "SHOW DATABASES LIKE 'grengcry'"
        ) else (
            echo.
            echo [ERROR] Failed to create database. Please check your MySQL password.
        )
    )
) else if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
    echo Found MySQL at: C:\Program Files\MySQL\MySQL Server 8.4\bin\
    echo.
    set /p create="Create database now? (y/n): "
    if /i "!create!"=="y" (
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p1691 -P 6969 -e "CREATE DATABASE IF NOT EXISTS grengcry"
        if !errorlevel! equ 0 (
            echo.
            echo [SUCCESS] Database created!
            "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p1691 -P 6969 -e "SHOW DATABASES LIKE 'grengcry'"
        ) else (
            echo.
            echo [ERROR] Failed to create database. Please check your MySQL password.
        )
    )
) else (
    echo MySQL executable not found in common locations.
    echo Please create the database manually using MySQL Workbench.
)

echo.
pause
