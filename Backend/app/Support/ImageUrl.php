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
            // Check if this is a localhost URL that needs to be re-resolved
            if (str_contains($path, 'localhost') || str_contains($path, '127.0.0.1')) {
                $apiMarker = '/api/v1/image/';
                $storageMarker = '/storage/';
                
                $pos = strpos($path, $apiMarker);
                if ($pos !== false) {
                    // Extract the path after /api/v1/image/
                    $path = substr($path, $pos + strlen($apiMarker));
                    $path = urldecode($path); // Decode URL-encoded path
                } else {
                    $pos = strpos($path, $storageMarker);
                    if ($pos !== false) {
                        // A legacy absolute URL built on the old /storage/ symlink route - recover
                        // the relative path so it can be re-resolved through the API endpoint below.
                        $path = substr($path, $pos + strlen($storageMarker));
                    } else {
                        // Not our URL pattern, return as-is
                        return $path;
                    }
                }
            } else {
                // Non-localhost URL - keep it as-is (might be CDN or external)
                return $path;
            }
        }

        $baseUrl = rtrim(env('APP_URL', 'http://localhost'), '/');
        return "{$baseUrl}/api/v1/image/" . urlencode($path);
    }
}
