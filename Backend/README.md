# PT Surya Inti Gas — Backend (Laravel API)

Laravel 13 API backend. For the full-stack setup (Backend + Frontend + Docker), see the
[repository root README](../README.md). This file covers backend-specific details.

## Requirements

- **PHP 8.4+** (see `composer.json`, `Dockerfile`, `railway.toml` — all target 8.4)
- Composer 2.x
- MySQL 8.0+ / MariaDB 10.6+ (or PostgreSQL — used in production on Railway)
- Required PHP extensions (already bundled with any standard PHP install): `ctype`, `filter`, `hash`,
  `mbstring`, `openssl`, `session`, `tokenizer`, `json`, `pdo`, `pdo_mysql`, `fileinfo`, `curl`
- Recommended extensions: `gd`, `zip`, `intl` (not strictly required today, but enable them if available —
  `pcntl` is Unix-only and not available on native Windows PHP builds)

Run `composer check-env` (or `php scripts/check-environment.php`) to check all of this automatically.

## Installation

```bash
composer install
copy .env.example .env      # Windows; use `cp` on macOS/Linux
php artisan key:generate
```

Edit `.env` and set your database credentials (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`,
`DB_USERNAME`, `DB_PASSWORD`) to point at a database you've already created, then:

```bash
php artisan migrate
php artisan storage:link
php artisan serve
```

Optionally seed reference/admin data:

```bash
php artisan db:seed
```
 
### Running everything together (server + queue worker + logs + Vite)

```bash
composer dev
```

## Validating your environment

```bash
composer check-env
```

Checks PHP version/extensions, Composer/Node/npm, `.env`/`APP_KEY`, `vendor/`, `storage:link`, folder
permissions, and live DB connectivity — with the exact fix command for anything missing.

## API documentation

Swagger/OpenAPI docs are generated via `darkaonline/l5-swagger`:

```bash
php artisan l5-swagger:generate
```

Then visit `/api/documentation`.

## Testing

```bash
composer test
```

## Deployment

Production targets are configured for:

- **Docker** (`Dockerfile`) — PHP 8.4-cli image, installs `pdo_mysql`, `pdo_pgsql`, `mbstring`, `exif`,
  `pcntl`, `bcmath`, `gd`.
- **Railway** (`railway.toml`) — uses PostgreSQL via Railway's managed Postgres plugin.

## License

The Laravel framework this backend is built on is open-sourced software licensed under the
[MIT license](https://opensource.org/licenses/MIT).
