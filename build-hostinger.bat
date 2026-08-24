@echo off
REM Build script for Hostinger deployment (Windows version)
REM This script builds React frontend and copies it to Laravel public folder

echo 🔨 Starting build process for Hostinger deployment...

REM Step 1: Build React frontend
echo 📦 Building React frontend...
cd Frontend
call npm install
call npm run build

REM Step 2: Copy React build to Laravel public folder
echo 📋 Copying React build to Laravel public folder...
cd ..
rd /s /q Backend\public
xcopy /E /I /Y Frontend\dist Backend\public

REM Step 3: Ensure Laravel entry point exists
echo 🔧 Ensuring Laravel entry point exists...
if not exist "Backend\public\index.php" (
    echo ⚠️  Warning: index.php not found
)

echo ✅ Build completed successfully!
echo 📁 Output: Backend\public\
echo 🚀 Ready for Hostinger deployment
pause