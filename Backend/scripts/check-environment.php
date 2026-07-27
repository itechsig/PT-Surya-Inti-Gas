<?php
/**
 * Environment validator for the PT Surya Inti Gas backend (and its Frontend sibling).
 *
 * Deliberately dependency-free: it does NOT use vendor/autoload.php, so it can run
 * BEFORE `composer install` and still tell you why composer install would fail.
 *
 * Usage:
 *   php scripts/check-environment.php
 *   composer check-env
 */

const REQUIRED_PHP_VERSION = '8.4.0';

const REQUIRED_EXTENSIONS = [
    'ctype', 'filter', 'hash', 'mbstring', 'openssl', 'session',
    'tokenizer', 'json', 'pdo', 'pdo_mysql', 'fileinfo', 'curl',
];

const RECOMMENDED_EXTENSIONS = [
    'gd' => 'image resizing/thumbnails (Illuminate\\Http\\Testing\\FileFactory::image, future image features)',
    'zip' => 'ZIP archive handling (exports/imports, if added later)',
    'intl' => 'locale-aware formatting (dates/numbers) for the id/en/zh locales',
    'pcntl' => 'graceful signal handling for `php artisan queue:listen` / `pail` (Unix only, unavailable on native Windows PHP)',
];

$isWindows = str_starts_with(PHP_OS_FAMILY, 'Win');
$backendRoot = dirname(__DIR__);
$repoRoot = dirname($backendRoot);
$frontendRoot = $repoRoot . DIRECTORY_SEPARATOR . 'Frontend';

$results = []; // ['ok'|'warn'|'fail', label, detail]

function check(string $label, string $status, string $detail = ''): void
{
    global $results;
    $results[] = [$status, $label, $detail];
}

/**
 * Runs `$cmd $args...` and returns the first output line, or null if the
 * command couldn't be found / exited non-zero.
 *
 * Note: deliberately does NOT escapeshellarg() the command name itself.
 * On Windows, wrapping a bare command like `composer` in quotes stops
 * cmd.exe's PATHEXT resolution from finding the .bat/.cmd shim, which
 * silently resolves to something else entirely. Args here are always
 * fixed internal literals (e.g. "--version"), never user input.
 */
function commandVersion(string $cmd, array $args = ['--version']): ?string
{
    $full = $cmd . ' ' . implode(' ', $args);
    exec("$full 2>&1", $output, $exitCode);
    if ($exitCode !== 0 || empty($output)) {
        return null;
    }
    return trim($output[0]);
}

function parseEnvFile(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $values = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $value = trim($value);
        if (strlen($value) >= 2 && $value[0] === '"' && str_ends_with($value, '"')) {
            $value = substr($value, 1, -1);
        }
        $values[trim($key)] = $value;
    }
    return $values;
}

// ---------------------------------------------------------------------------
// 1. PHP version
// ---------------------------------------------------------------------------
if (version_compare(PHP_VERSION, REQUIRED_PHP_VERSION, '>=')) {
    check('PHP version', 'ok', PHP_VERSION);
} else {
    check(
        'PHP version',
        'fail',
        sprintf(
            "Found PHP %s, but this project requires PHP >= %s (see Backend/composer.json and Dockerfile).\n" .
            "      Fix: install PHP 8.4+ and make sure it's first on PATH, OR use Docker (docker-compose.yml)\n" .
            "      to avoid touching your system PHP at all: `docker compose up --build`.",
            PHP_VERSION,
            REQUIRED_PHP_VERSION
        )
    );
}

// ---------------------------------------------------------------------------
// 2. Required PHP extensions
// ---------------------------------------------------------------------------
$missingRequired = [];
foreach (REQUIRED_EXTENSIONS as $ext) {
    if (!extension_loaded($ext)) {
        $missingRequired[] = $ext;
    }
}
if (empty($missingRequired)) {
    check('Required PHP extensions', 'ok', implode(', ', REQUIRED_EXTENSIONS));
} else {
    check(
        'Required PHP extensions',
        'fail',
        'Missing: ' . implode(', ', $missingRequired) . "\n" .
        '      Fix: enable them in php.ini (uncomment the matching `extension=` lines), then restart the server.'
    );
}

$missingRecommended = [];
foreach (RECOMMENDED_EXTENSIONS as $ext => $why) {
    if ($ext === 'pcntl' && $isWindows) {
        continue; // never available on native Windows PHP builds
    }
    if (!extension_loaded($ext)) {
        $missingRecommended[$ext] = $why;
    }
}
if (empty($missingRecommended)) {
    check('Recommended PHP extensions', 'ok', 'all present');
} else {
    $detail = implode("\n      ", array_map(fn ($ext) => "- $ext: {$missingRecommended[$ext]}", array_keys($missingRecommended)));
    check('Recommended PHP extensions', 'warn', "Not enabled (optional for now):\n      $detail");
}

// ---------------------------------------------------------------------------
// 3. Composer
// ---------------------------------------------------------------------------
$composerVersion = commandVersion('composer', ['--version', '--no-ansi']);
if ($composerVersion) {
    check('Composer', 'ok', $composerVersion);
} else {
    check('Composer', 'fail', 'Composer not found on PATH. Install from https://getcomposer.org/download/');
}

// ---------------------------------------------------------------------------
// 4. Node / npm
// ---------------------------------------------------------------------------
$nodeVersion = commandVersion('node', ['-v']);
if ($nodeVersion) {
    $major = (int) preg_replace('/[^0-9].*/', '', ltrim($nodeVersion, 'v'));
    if ($major >= 20) {
        check('Node.js', 'ok', $nodeVersion);
    } else {
        check('Node.js', 'warn', "$nodeVersion found; Node 20+ recommended (matches Frontend/Dockerfile: node:20).");
    }
} else {
    check('Node.js', 'fail', 'Node.js not found on PATH. Install Node 20+ from https://nodejs.org/');
}

$npmVersion = commandVersion('npm', ['-v']);
if ($npmVersion) {
    check('npm', 'ok', $npmVersion);
} else {
    check('npm', 'fail', 'npm not found on PATH (should ship with Node.js).');
}

// ---------------------------------------------------------------------------
// 5. .env files
// ---------------------------------------------------------------------------
$backendEnvPath = $backendRoot . '/.env';
if (is_file($backendEnvPath)) {
    check('Backend/.env', 'ok', 'exists');
    $backendEnv = parseEnvFile($backendEnvPath);
    if (!empty($backendEnv['APP_KEY'])) {
        check('APP_KEY', 'ok', 'set');
    } else {
        check('APP_KEY', 'fail', 'Empty. Fix: run `php artisan key:generate` in Backend/.');
    }
} else {
    check(
        'Backend/.env',
        'fail',
        'Missing. Fix: copy Backend/.env.example to Backend/.env, then run `php artisan key:generate`.'
    );
    $backendEnv = [];
}

$frontendEnvPath = $frontendRoot . '/.env';
if (is_file($frontendEnvPath)) {
    check('Frontend/.env', 'ok', 'exists');
} else {
    check('Frontend/.env', 'warn', 'Missing. Fix: copy Frontend/.env.example to Frontend/.env.');
}

// ---------------------------------------------------------------------------
// 6. vendor / node_modules
// ---------------------------------------------------------------------------
check(
    'Backend/vendor',
    is_dir($backendRoot . '/vendor') ? 'ok' : 'fail',
    is_dir($backendRoot . '/vendor') ? 'installed' : 'Missing. Fix: run `composer install` in Backend/.'
);
check(
    'Backend/node_modules',
    is_dir($backendRoot . '/node_modules') ? 'ok' : 'warn',
    is_dir($backendRoot . '/node_modules') ? 'installed' : 'Missing. Fix: run `npm install` in Backend/ (needed for Vite asset building).'
);
check(
    'Frontend/node_modules',
    is_dir($frontendRoot . '/node_modules') ? 'ok' : 'fail',
    is_dir($frontendRoot . '/node_modules') ? 'installed' : 'Missing. Fix: run `npm install` in Frontend/.'
);

// ---------------------------------------------------------------------------
// 7. storage symlink + writable folders
// ---------------------------------------------------------------------------
$storageLink = $backendRoot . '/public/storage';
// file_exists() (not is_link()/is_dir()) because PHP's link detection is
// unreliable on Windows for the reparse-point symlinks `artisan storage:link`
// creates there.
if (file_exists($storageLink)) {
    check('storage:link', 'ok', 'public/storage exists');
} else {
    check('storage:link', 'warn', 'Missing. Fix: run `php artisan storage:link` in Backend/ (needed for uploaded images to be publicly reachable).');
}

foreach (['storage', 'bootstrap/cache'] as $dir) {
    $path = $backendRoot . '/' . $dir;
    if (!is_dir($path)) {
        check("Backend/$dir", 'fail', 'Directory does not exist.');
    } elseif (!is_writable($path)) {
        check("Backend/$dir", 'fail', 'Not writable. Fix: chmod -R 775 ' . $dir . ' (or grant write permission on Windows).');
    } else {
        check("Backend/$dir", 'ok', 'writable');
    }
}

// ---------------------------------------------------------------------------
// 8. Database connectivity (best-effort, uses raw PDO — no framework needed)
// ---------------------------------------------------------------------------
if (!empty($backendEnv)) {
    $driver = $backendEnv['DB_CONNECTION'] ?? 'mysql';
    if (in_array($driver, ['mysql', 'mariadb', 'pgsql'], true) && extension_loaded('pdo_' . ($driver === 'pgsql' ? 'pgsql' : 'mysql'))) {
        $host = $backendEnv['DB_HOST'] ?? '127.0.0.1';
        $port = $backendEnv['DB_PORT'] ?? ($driver === 'pgsql' ? '5432' : '3306');
        $db = $backendEnv['DB_DATABASE'] ?? '';
        $user = $backendEnv['DB_USERNAME'] ?? 'root';
        $pass = $backendEnv['DB_PASSWORD'] ?? '';
        $dsn = $driver === 'pgsql'
            ? "pgsql:host=$host;port=$port;dbname=$db;connect_timeout=3"
            : "mysql:host=$host;port=$port;dbname=$db";
        try {
            new PDO($dsn, $user, $pass, [PDO::ATTR_TIMEOUT => 3]);
            check('Database connection', 'ok', "connected to $driver database `$db` at $host:$port");
        } catch (PDOException $e) {
            check(
                'Database connection',
                'warn',
                "Could not connect to $driver at $host:$port (db `$db`): {$e->getMessage()}\n" .
                '      Fix: start MySQL/MariaDB/Postgres, then create the database and run `php artisan migrate`.'
            );
        }
    } elseif ($driver === 'sqlite') {
        check('Database connection', 'ok', 'using sqlite (no server needed)');
    } else {
        check('Database connection', 'warn', "DB_CONNECTION=$driver — required PDO driver not loaded.");
    }
} else {
    check('Database connection', 'warn', 'Skipped (no Backend/.env found).');
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
$supportsColor = function_exists('sapi_windows_vt100_support')
    ? (defined('STDOUT') && sapi_windows_vt100_support(STDOUT))
    : (getenv('NO_COLOR') === false && stream_isatty(STDOUT ?? fopen('php://stdout', 'w')));

function paint(string $text, string $status, bool $color): string
{
    if (!$color) {
        return $text;
    }
    $codes = ['ok' => '32', 'warn' => '33', 'fail' => '31'];
    return "\033[{$codes[$status]}m$text\033[0m";
}

$icons = ['ok' => '[OK]  ', 'warn' => '[WARN]', 'fail' => '[FAIL]'];

echo "\n=== PT Surya Inti Gas — Environment Check ===\n\n";

$failCount = 0;
$warnCount = 0;
foreach ($results as [$status, $label, $detail]) {
    if ($status === 'fail') $failCount++;
    if ($status === 'warn') $warnCount++;
    $line = sprintf('%s %-28s %s', $icons[$status], $label, $detail !== '' ? "— $detail" : '');
    echo paint($line, $status, $supportsColor) . "\n";
}

echo "\n-----------------------------------------------\n";
if ($failCount > 0) {
    echo paint("$failCount blocking issue(s) found. Fix these before the app will run.", 'fail', $supportsColor) . "\n";
} elseif ($warnCount > 0) {
    echo paint("All critical checks passed. $warnCount item(s) worth reviewing above.", 'warn', $supportsColor) . "\n";
} else {
    echo paint('Everything looks good. You are ready to run the app.', 'ok', $supportsColor) . "\n";
}
echo "-----------------------------------------------\n\n";

exit($failCount > 0 ? 1 : 0);
