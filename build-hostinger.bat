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

REM Remove React-specific files but preserve Laravel files
if exist "Backend\public\assets" rd /s /q Backend\public\assets
if exist "Backend\public\images" rd /s /q Backend\public\images
if exist "Backend\public\index.html" del Backend\public\index.html
if exist "Backend\public\robots.txt" del Backend\public\robots.txt
if exist "Backend\public\sitemap.xml" del Backend\public\sitemap.xml
if exist "Backend\public\google20ef713f750a3bec.html" del Backend\public\google20ef713f750a3bec.html
if exist "Backend\public\logo.png" del Backend\public\logo.png

REM Copy React build files
xcopy /E /I /Y Frontend\dist\assets Backend\public\assets
xcopy /E /I /Y Frontend\dist\images Backend\public\images
copy /Y Frontend\dist\index.html Backend\public\index.html
copy /Y Frontend\dist\robots.txt Backend\public\robots.txt
copy /Y Frontend\dist\sitemap.xml Backend\public\sitemap.xml
copy /Y Frontend\dist\google20ef713f750a3bec.html Backend\public\google20ef713f750a3bec.html
copy /Y Frontend\dist\logo.png Backend\public\logo.png

REM Step 3: Ensure Laravel entry point and .htaccess exist
echo 🔧 Ensuring Laravel entry point and .htaccess exist...
if not exist "Backend\public\index.php" (
    echo ⚠️  Warning: index.php not found
)
if not exist "Backend\public\.htaccess" (
    echo ⚠️  Warning: .htaccess not found
)

echo ✅ Build completed successfully!
echo 📁 Output: Backend\public\
echo 🚀 Ready for Hostinger deployment
pause