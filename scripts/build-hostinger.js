const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Starting build process for Hostinger deployment...');

try {
  // Step 1: Build React frontend
  console.log('📦 Building React frontend...');
  process.chdir('Frontend');
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Copy React build to Laravel public folder
  console.log('📋 Copying React build to Laravel public folder...');
  process.chdir('..');
  
  const distPath = path.join(__dirname, '../Frontend/dist');
  const publicPath = path.join(__dirname, '../Backend/public');
  
  // Clear public folder
  if (fs.existsSync(publicPath)) {
    fs.readdirSync(publicPath).forEach(file => {
      const filePath = path.join(publicPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
  
  // Copy files recursively
  function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyRecursive(distPath, publicPath);
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Output: Backend/public/');
  console.log('🚀 Ready for Hostinger deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}