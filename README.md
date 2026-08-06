# PT Surya Inti Gas — Company Profile & Admin Platform

Company profile website for PT Surya Inti Gas (industrial, medical & speciality gas distributor),
with a trilingual (Indonesian/English/Chinese) public site and a full admin dashboard for managing
all content.

- **`Backend/`** — Laravel 13 REST API (PHP 8.4). API-only; no server-rendered pages.
- **`Frontend/`** — React 18 + Vite + TypeScript single-page app. Talks to the backend purely over
  HTTP/JSON (see [How it fits together](#how-it-fits-together)).

## Features

- Public site: Home, Products (gas/package/services catalog), Gallery, Career + job application
  form, Distribution Network map, Contact, About Us, **Portfolio** (client case studies), Chatbot.
- Admin dashboard (`/admin`): CRUD for every content type above, role-based access
  (`super_admin` / `admin` / `editor` / `hr`), audit log, user management, forced password change
  on first login.
- Trilingual content (ID/EN/ZH) throughout — both the public UI strings (i18next) and the content
  itself (every content model stores `_id`/`_en`/`_zh` fields).
- Security: Sanctum token auth, brute-force lockout, rate limiting, security headers, CORS
  allowlist, audit logging. See `Backend/app/Http/Middleware/`.

## Requirements

| Tool     | Required version | Notes |
|----------|-------------------|-------|
| PHP      | **8.4+**          | Matches `Backend/composer.json`, `Backend/Dockerfile` (`php:8.4-cli`), and the Railway deploy config. |
| Composer | 2.x               | https://getcomposer.org/download/ |
| Node.js  | **20+**           | Matches `Frontend/Dockerfile` (`node:20`). |
| npm      | 10+               | Ships with Node 20. |
| MySQL    | 8.0+ (or MariaDB 10.6+) | PostgreSQL also works (used in production on Railway) — see `Backend/config/database.php`. |
| Git      | any recent version | To clone the repo. |

Run `npm run check-env` (or `php Backend/scripts/check-environment.php`) at any time to verify your machine
satisfies all of the above — see [Environment validation](#environment-validation) below.

> **Don't have PHP 8.4 locally?** Skip straight to [Option B: Docker](#option-b-docker-no-local-php-required) —
> it builds the exact PHP 8.4 environment for you and you never need to touch your system PHP install.

## Clone

```bash
git clone <repository-url> PT_SURYA_INTI_GAS
cd PT_SURYA_INTI_GAS
```

Replace `<repository-url>` with this repo's actual Git remote URL (HTTPS or SSH, from your Git host).

## Installation

### Option A: Native (PHP 8.4+ / Node 20+ installed locally)

```bash
# 1. Backend
cd Backend
composer install
copy .env.example .env        # Windows (PowerShell/cmd)
# cp .env.example .env        # macOS/Linux
php artisan key:generate
```

Now edit `Backend/.env`:

- Create an empty database first (e.g. `CREATE DATABASE surya_inti_gas;` in MySQL), then set
  `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` to match.
- `APP_URL` should match wherever the backend will actually be served (default `http://localhost:8000`) —
  it's used to build absolute image URLs (`Storage::url()`), so a wrong value here breaks every
  `<img>` on the frontend even though the API itself still responds fine.
- `CORS_ALLOWED_ORIGINS` must list the frontend's exact origin (default `http://localhost:3000`). This
  is an **exact string match**, not a wildcard — `http://localhost:3000` and `http://127.0.0.1:3000`
  are treated as different origins and one being missing silently breaks every frontend `fetch()` call
  with a CORS error (no data ever reaches the UI, no obvious error either unless you check devtools).

```bash
php artisan migrate --seed    # creates all tables and seeds demo content + admin accounts
php artisan storage:link      # required for uploaded images (products, gallery, portfolio, ...) to be servable
composer check-env            # optional: re-validate everything is wired up correctly

# 2. Frontend (in a second terminal)
cd Frontend
npm install
copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux
# Edit Frontend/.env: VITE_API_URL should point at the backend (default http://localhost:8000)

# 3. Run both
cd Backend && php artisan serve   # http://localhost:8000
cd Frontend && npm run dev        # http://localhost:3000
```

Or, from the repo root, once both `Backend/` and `Frontend/` are installed:

```bash
npm install         # installs `concurrently` for the root scripts below
npm start           # runs backend (:8000) and frontend (:3000) together
```

### Option B: Docker (no local PHP required)

```bash
docker compose up --build
```

This starts `mysql` (port 3306), the Laravel API (port 8000), and the Vite dev server (port 3000) using the
versions pinned in `Backend/Dockerfile` (PHP 8.4) and `Frontend/Dockerfile` (Node 20) — no local PHP/Node
version conflicts possible. Run migrations inside the container once it's up:

```bash
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan storage:link
```

## Default admin login

`php artisan migrate --seed` creates four admin accounts (see `Backend/database/seeders/AdminUserSeeder.php`),
all with the same starting password:

| Email | Role |
|---|---|
| `itechsig0510@gmail.com` | `super_admin` |
| `admin@suryaintigas.com` | `admin` |
| `editor@suryaintigas.com` | `editor` |
| `fauzanafiflutfiansah04@gmail.com` | `hr` |

**Password for all of them:** `Password@123`

Log in at `http://localhost:3000/admin/login`. On first login you'll immediately be forced to set your
own password (`RequirePasswordChangeMiddleware`) — this is expected, not a bug.

> If you ever get locked out (wrong password, forgot it after changing it), reset it directly via
> `php artisan tinker`:
> ```php
> $u = App\Models\User::where('email', 'itechsig0510@gmail.com')->first();
> $u->password = Hash::make('NewTemp123!');
> $u->must_change_password = true;
> $u->save();
> ```

## How it fits together

The frontend is a **static SPA build** — it never runs PHP and never renders HTML server-side. Every
piece of dynamic content (products, gallery, portfolio, job listings, ...) is fetched at runtime from
the Laravel API as JSON:

```
Browser ──(loads static JS/CSS)──► Frontend (Vite dev server / static hosting)
Browser ──(fetch, JSON)──────────► Backend  (Laravel API, /api/v1/...)
```

- `Frontend/src/config/api.ts` — base URL (from `VITE_API_URL`) + every endpoint path.
- `Frontend/src/utils/apiClient.ts` — thin `fetch()` wrapper: attaches the admin's Bearer token,
  parses JSON, normalizes errors.
- Admin auth is **token-based** (Laravel Sanctum), not cookie/session — the token lives in the
  browser's `localStorage` and is sent as `Authorization: Bearer <token>` on every admin request.
- Uploaded images (products, gallery, portfolio thumbnails, ...) are served from the backend as
  **absolute URLs** (`http://<backend-host>/storage/...`), so the frontend can `<img src=...>` them
  directly regardless of which origin it's running on.

## Environment validation

```bash
php Backend/scripts/check-environment.php
# or
npm run check-env
# or, from Backend/
composer check-env
```

This is a dependency-free PHP script (it runs *before* `composer install` too) that checks: PHP version,
required/recommended PHP extensions, Composer/Node/npm availability, `.env` files, `APP_KEY`, `vendor/` and
`node_modules/` presence, the `storage:link` symlink, writable `storage/`/`bootstrap/cache`, and live database
connectivity. It prints a pass/warn/fail report and exits non-zero if anything blocking is found.

## Troubleshooting

- **`Composer detected issues in your platform: ... PHP version ">= 8.4.0"`** — your PHP is older than 8.4.
  Install PHP 8.4+ (or use [Docker](#option-b-docker-no-local-php-required)). On Windows with XAMPP/Laragon,
  this means installing/switching to an 8.4 PHP build; these tools do not upgrade PHP automatically.
- **Images/uploads 404 in the browser** — run `php artisan storage:link` from `Backend/`.
- **API calls from the frontend fail / CORS errors** — confirm `Backend/.env`'s `CORS_ALLOWED_ORIGINS`
  includes your frontend's **exact** origin (default `http://localhost:3000`), and that `Frontend/.env`'s
  `VITE_API_URL` points at the backend (default `http://localhost:8000`). `localhost` and `127.0.0.1` are
  different origins to the browser even when they resolve to the same machine — pick one and use it
  consistently everywhere (browser address bar, `.env` files) or CORS will silently reject every request.
- **`SQLSTATE[HY000] [2002] ...` on migrate, or the site suddenly stops loading any data** — your database
  server (MySQL/MariaDB) isn't running. On Laragon/XAMPP this needs to be started explicitly from the control
  panel; it doesn't start automatically with Windows. Confirm with `mysqladmin ping` or by trying to connect
  with any MySQL client.
- **Admin dashboard feels slow or "sometimes works, sometimes doesn't" with several tabs/panels open** —
  `php artisan serve` uses PHP's built-in development server, which on Windows handles **one request at a
  time** (no worker forking, unlike on Linux/macOS). Pages that fire several API calls at once (e.g. the
  admin dashboard loading a list + its filter dropdowns simultaneously) will queue up rather than run in
  parallel, and can feel like it's hanging for a second or two. This is expected for local development; for
  production, or if it bothers you locally, serve the backend through a real web server (Nginx/Apache +
  PHP-FPM, e.g. via Laragon's virtual host) instead of `artisan serve`.
- **`php artisan serve` window was closed / process died and now nothing loads** — restart it
  (`cd Backend && php artisan serve`) and keep that terminal window open for as long as you're developing.
- **`APP_KEY` missing / "No application encryption key"** — run `php artisan key:generate` from `Backend/`.
- **Can't log into `/admin` at all** — see [Default admin login](#default-admin-login) above for the
  seeded accounts, and the tinker snippet to reset a password directly.

## Project structure

```
Backend/
  app/Http/Controllers/Api/   REST controllers (one per resource: Product, Gallery, Portfolio, ...)
  app/Http/Requests/          Form Request validation classes (Store*/Update* per resource)
  app/Http/Middleware/        Auth, CORS, brute-force protection, audit logging, security headers
  app/Models/                 Eloquent models
  database/migrations/        Schema history
  database/seeders/           Demo content + admin account seeders (see DatabaseSeeder.php)
  routes/api.php              All API routes (/api/v1/..., public + admin)

Frontend/
  src/app/components/         Public-facing pages (Product.tsx, Portfolio.tsx, ...)
  src/app/admin/              Admin dashboard (one folder per module: products/, portfolios/, ...)
  src/app/components/ui/      shadcn/ui primitives
  src/hooks/                  Data-fetching hooks (usePortfolioCatalog, useProductCatalog, ...)
  src/config/api.ts           API base URL + endpoint paths
  src/locales/{id,en,zh}.json UI translation strings
```

---

This repository also contains a Figma-generated code bundle for the original static design
(https://www.figma.com/design/Kk89QPumcZPPBTkn5Z8el2/Desain-Website-Company-Profile--Community-) —
most of its structure now lives under `Frontend/`.