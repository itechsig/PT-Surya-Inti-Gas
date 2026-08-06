<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Resolves a stored image path/URL to an absolute URL on the current APP_URL.
 *
 * The "image" columns across Gallery/Portfolio/Product/HeroSlide are meant to hold
 * relative paths (e.g. "gallery/foo.webp") returned by Storage::store(), but some
 * rows historically got saved as absolute URLs (e.g. baked with a stale/localhost
 * APP_URL). resolve() re-anchors those to the current APP_URL instead of trusting
 * the stored host, so a DB row never permanently "locks in" a wrong domain.
 */
class ImageUrl
{
    public static function resolve(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http')) {
            $marker = '/storage/';
            $pos = strpos($path, $marker);

            // No "/storage/" segment means this is a genuinely external URL
            // (e.g. a CDN link), not one of our own stored files. Leave it alone.
            if ($pos === false) {
                return $path;
            }

            $path = substr($path, $pos + strlen($marker));
        }

        return Storage::disk('public')->url($path);
    }
}
