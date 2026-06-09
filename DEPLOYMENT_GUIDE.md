# Deployment Guide - PT Surya Inti Gas

## Free Deployment Setup Options

This guide explains how to deploy your Laravel + React application for FREE using:

### Option 1: Vercel + Fly.io (Recommended - No Credit Card Required)
- **Frontend (React)**: Vercel (No credit card required)
- **Backend (Laravel)**: Fly.io (No credit card required)
- **Database**: Fly.io PostgreSQL (No credit card required)

### Option 2: Vercel + Railway (Alternative)
- **Frontend (React)**: Vercel (No credit card required)
- **Backend (Laravel)**: Railway ($5 free credit/month, may require card)
- **Database**: Railway PostgreSQL ($5 free credit/month)

### Option 3: Vercel + Zeabur (Alternative)
- **Frontend (React)**: Vercel (No credit card required)
- **Backend (Laravel)**: Zeabur (Free tier, no credit card required)
- **Database**: Zeabur PostgreSQL (Free tier)

---

## Prerequisites

1. Push your code to GitHub (both Frontend and Backend should be in the same repository)
2. Create accounts:
   - [Vercel](https://vercel.com/signup) (for Frontend - No credit card required)
   - [Fly.io](https://fly.io/register) (for Backend + Database - No credit card required)
   OR
   - [Railway](https://railway.app/) (for Backend + Database - May require card for verification)
   OR
   - [Zeabur](https://zeabur.com/) (for Backend + Database - No credit card required)

---

## Option 1: Deploy to Fly.io (Recommended - No Credit Card Required)

### Step 1: Install Fly.io CLI

```bash
# Install Fly.io CLI (Windows)
iwr https://fly.io/install.ps1 -useb | iex

# Or download from: https://fly.io/docs/hands-on/install-flyctl/

# Login to Fly.io
flyctl auth signup
flyctl auth login
```

### Step 2: Deploy Backend to Fly.io

```bash
# Navigate to Backend directory
cd Backend

# Initialize Fly.io deployment
flyctl launch --yes --region sin --no-deploy

# This will create fly.toml configuration
```

### Step 3: Configure Fly.toml

Update the generated `fly.toml` file (I've created a sample at root directory):

```toml
app = 'pt-surya-inti-gas-backend'
primary_region = 'sin'

[build]
  dockerfile = './Backend/Dockerfile'

[env]
  APP_ENV = 'production'
  APP_DEBUG = 'false'
  DB_CONNECTION = 'pgsql'

[http_service]
  internal_port = 8000
  force_https = true
```

### Step 4: Create PostgreSQL Database on Fly.io

```bash
# Create PostgreSQL database
flyctl postgres create --name pt-surya-inti-gas-db --region sin

# This will output connection details like:
# Host: xx.xx.xx.xx
# User: postgres
# Password: ********
# Database: pt_surya_inti_gas_db
# Connection string: postgres://...
```

### Step 5: Set Environment Variables

```bash
# Get the database connection string
flyctl postgres connect -a pt-surya-inti-gas-db

# Set environment variables for your app
flyctl secrets set DB_HOST=<db-host> --app pt-surya-inti-gas-backend
flyctl secrets set DB_PORT=5432 --app pt-surya-inti-gas-backend
flyctl secrets set DB_DATABASE=<db-name> --app pt-surya-inti-gas-backend
flyctl secrets set DB_USERNAME=<db-user> --app pt-surya-inti-gas-backend
flyctl secrets set DB_PASSWORD=<db-password> --app pt-surya-inti-gas-backend
flyctl secrets set APP_KEY=<your-app-key> --app pt-surya-inti-gas-backend
flyctl secrets set CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app --app pt-surya-inti-gas-backend
```

### Step 6: Deploy Backend

```bash
# Deploy the application
flyctl deploy --app pt-surya-inti-gas-backend

# Get your backend URL (usually: https://pt-surya-inti-gas-backend.fly.dev)
flyctl info --app pt-surya-inti-gas-backend
```

### Step 7: Run Database Migrations

```bash
# SSH into the running app
flyctl ssh console --app pt-surya-inti-gas-backend

# Inside the container, run migrations
php artisan migrate --force
php artisan db:seed --force

# Exit the container
exit
```

---

## Option 2: Deploy to Railway (Alternative)

### Step 1: Deploy Backend on Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect Laravel and set up automatically
5. Add PostgreSQL database from the "New" → "Database" menu
6. Update environment variables with database connection details

### Step 2: Update CORS and App URL

Add these environment variables in Railway:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
APP_URL=https://your-backend-url.railway.app
```

---

## Option 3: Deploy to Zeabur (Alternative)

### Step 1: Deploy Backend on Zeabur

1. Go to [Zeabur](https://zeabur.com/)
2. Connect GitHub repository
3. Create PostgreSQL service
4. Create Backend service using Docker
5. Configure environment variables
6. Deploy

---

## Deploy Frontend to Vercel (Common for All Backend Options)

### Option A: Deploy via Vercel Dashboard (Recommended for first deployment)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure deployment settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your Backend URL (get from backend deployment after deploying)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to Frontend directory
cd Frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## Step 2: Update Frontend Environment Variables

After deploying the Backend (using any of the options above):

1. Get your Backend URL from the chosen platform:
   - Fly.io: `https://pt-surya-inti-gas-backend.fly.dev`
   - Railway: `https://your-backend-name.railway.app`
   - Zeabur: `https://your-backend-name.zeabur.app`

2. Get your Frontend URL from Vercel (e.g., `https://pt-surya-inti-gas-frontend.vercel.app`)

3. Update Vercel environment variables:
   - Go to your Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` to your Backend URL
4. Redeploy Frontend:
   ```bash
   vercel --prod
   ```
   Or via Vercel Dashboard: Deployments → Redeploy

---

## Step 3: Update Frontend Environment Variables

After deploying the Backend:

1. Get your Backend URL from Render (e.g., `https://pt-surya-inti-gas-backend.onrender.com`)
2. Get your Frontend URL from Vercel (e.g., `https://pt-surya-inti-gas-frontend.vercel.app`)
3. Update Vercel environment variables:
   - Go to your Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` to your Backend URL
4. Redeploy Frontend:
   ```bash
   vercel --prod
   ```
   Or via Vercel Dashboard: Deployments → Redeploy

---

## Step 4: Update CORS Configuration

Update your Backend CORS settings to allow your Frontend URL:

In `Backend/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')],
```

Add this to your Backend `.env`:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

---

## Step 4: Run Database Migrations

After deploying Backend with database:

### For Fly.io:
```bash
# SSH into the running app
flyctl ssh console --app pt-surya-inti-gas-backend

# Inside the container, run migrations
php artisan migrate --force
php artisan db:seed --force

# Exit the container
exit
```

### For Railway:
Use Railway's console to access the container and run the same migration commands.

### For Zeabur:
Use Zeabur's terminal to access the container and run the same migration commands.

---

## Important Notes

### Why Not Render?
⚠️ **Render now requires a credit card** even for free tier deployment. That's why we recommend the alternatives above.

### Free Tier Limitations

**Vercel (Frontend)**:
- Unlimited bandwidth
- 100GB bandwidth per month
- Automatic SSL
- Unlimited deployments
- Fast global CDN
- **No credit card required**

**Fly.io (Backend + Database)** - Recommended:
- **Free Web Service**: 3 free VMs, 160GB outbound transfer per month
- **Free PostgreSQL**: 1GB database included
- No spin-down (always available)
- Automatic SSL
- Global deployment regions
- **No credit card required**

**Railway (Backend + Database)**:
- $5 free credit per month
- Good for small projects
- Easy setup
- May require credit card verification

**Zeabur (Backend + Database)**:
- Free tier available
- Good performance
- Simple deployment
- **No credit card required**

### Platform Comparison

| Platform | Credit Card | Always-on | Database | Setup Difficulty |
|----------|-------------|-----------|----------|------------------|
| Fly.io | ❌ Not required | ✅ Yes | ✅ Included | Medium |
| Railway | ⚠️ May require | ✅ Yes | ✅ Included | Easy |
| Zeabur | ❌ Not required | ✅ Yes | ✅ Included | Easy |
| Render | ✅ Required | ❌ No | ✅ Available | Easy |

### Troubleshooting

**Fly.io deployment issues?**
- Ensure flyctl CLI is installed and you're logged in
- Check that fly.toml configuration is correct
- Verify database creation before app deployment
- Check Fly.io logs: `flyctl logs --app pt-surya-inti-gas-backend`

**CORS errors?**
- Check that Frontend URL is added to Backend CORS configuration
- Verify `CORS_ALLOWED_ORIGINS` in Backend environment variables
- Ensure the URL includes https://

**Database connection issues?**
- Ensure database is running
- Check database credentials match environment variables
- For Fly.io, verify database and app are in the same region

**Deployment fails?**
- Check platform deployment logs
- Ensure all environment variables are set
- Verify database is created before deploying backend
- Check Dockerfile compatibility

---

## Cost Summary

### Option 1: Fly.io (Recommended)
| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel (Frontend) | $0 | Free forever, no credit card |
| Fly.io (Backend) | $0 | 3 free VMs, 160GB transfer |
| Fly.io (PostgreSQL) | $0 | 1GB database included |

**Total**: $0 (Truly free, no credit card required)

### Option 2: Railway
| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel (Frontend) | $0 | Free forever |
| Railway (Backend + DB) | $0-$5 | $5 free credit, may need card |

**Total**: $0 for small projects (with $5 free credit)

### Option 3: Zeabur
| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel (Frontend) | $0 | Free forever |
| Zeabur (Backend + DB) | $0 | Free tier available |

**Total**: $0 (No credit card required)

---

## Recommendation

**Use Fly.io** because:
- ✅ No credit card required
- ✅ Always-on deployment (no spin-down)
- ✅ Included PostgreSQL database
- ✅ Good performance
- ✅ Generous free limits

---

## Next Steps

1. Deploy following the steps above (start with Fly.io)
2. Test the deployed application
3. Update any hardcoded URLs in your code
4. Set up monitoring (optional)
5. Configure custom domains (optional)

For support or issues:
- Vercel: https://vercel.com/docs
- Fly.io: https://fly.io/docs
- Railway: https://docs.railway.app/
- Zeabur: https://zeabur.com/docs

---

## Quick Start Summary (Fly.io - Recommended)

```bash
# 1. Install Fly.io CLI
iwr https://fly.io/install.ps1 -useb | iex  # Windows
flyctl auth login

# 2. Navigate to Backend directory
cd Backend

# 3. Create PostgreSQL database
flyctl postgres create --name pt-surya-inti-gas-db --region sin

# 4. Initialize deployment
flyctl launch --yes --region sin --no-deploy

# 5. Update fly.toml with database settings
# (Use the fly.toml file I created in the root directory)

# 6. Set environment variables
flyctl secrets set DB_HOST=<db-host> --app pt-surya-inti-gas-backend
flyctl secrets set DB_DATABASE=<db-name> --app pt-surya-inti-gas-backend
flyctl secrets set DB_USERNAME=<db-user> --app pt-surya-inti-gas-backend
flyctl secrets set DB_PASSWORD=<db-password> --app pt-surya-inti-gas-backend
flyctl secrets set APP_KEY=<generate-with-php-artisan-key-generate> --app pt-surya-inti-gas-backend

# 7. Deploy
flyctl deploy

# 8. Run migrations
flyctl ssh console --app pt-surya-inti-gas-backend
php artisan migrate --force
exit

# 9. Get backend URL
flyctl info --app pt-surya-inti-gas-backend

# 10. Deploy frontend to Vercel with backend URL
# (Follow Vercel deployment steps)
```
