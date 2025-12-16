@echo off
echo ========================================
echo    VORO-BOT PORTABLE LAUNCHER
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and install it.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected
node --version
echo.

REM Navigate to backend directory
cd /d "%~dp0voro-bot\backend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] First time setup - Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Start the server
echo ========================================
echo    Starting Voro-Bot Server...
echo ========================================
echo.
echo Server will start on: http://localhost:3000
echo.
echo Chatbot Interface: http://localhost:3000/
echo Admin Panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server and open browser
start http://localhost:3000/
call npm start
