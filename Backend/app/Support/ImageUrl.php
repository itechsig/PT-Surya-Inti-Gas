<?php

namespace App\Support;

/**
 * Resolves a stored image path/URL to an absolute URL on the current APP_URL.
 *
 * The "image" columns across Gallery/Portfolio/Product/HeroSlide are meant to hold
 * relative paths (e.g. "gallery/foo.webp") returned by Storage::store(), but some
 * rows historically got saved as absolute URLs (e.g. baked with a stale/localhost
 * APP_URL, or on the old /storage/ symlink route). resolve() re-anchors those to
 * the current APP_URL instead of trusting the stored host, so a DB row never
 * permanently "locks in" a wrong domain.
 *
 * Resolved URLs are always served through the /api/v1/image/{path} endpoint
 * (ImageController::serve, reading straight off the `public` disk) rather than
 * Storage::disk('public')->url(), which depends on Railway's storage symlink -
 * unreliable in production, which is exactly why that endpoint exists.
 */
class ImageUrl
{
    public static function resolve(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $marker = '/storage/';
            $pos = strpos($path, $marker);

            if ($pos === false) {
                // No "/storage/" segment means this is either already one of our own
                // /api/v1/image/... URLs, or a genuinely external URL (e.g. a CDN
                // link) - not a stored file path we need to re-resolve. Leave it alone.
                return $path;
            }

            // A legacy absolute URL built on the old /storage/ symlink route - recover
            // the relative path so it can be re-resolved through the API endpoint below.
            $path = substr($path, $pos + strlen($marker));
        }

        $baseUrl = rtrim(env('APP_URL', 'http://localhost'), '/');
        // Don't encode anything - just use the path as-is
        return "{$baseUrl}/api/v1/image/" . $path;
    }
}
