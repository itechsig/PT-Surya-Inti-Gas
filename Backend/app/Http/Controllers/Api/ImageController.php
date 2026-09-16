<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /** Longest edge, in px, that a served image is allowed to keep. */
    private const MAX_DIMENSION = 1000;
    private const JPEG_QUALITY = 78;
    private const WEBP_QUALITY = 78;
    private const PNG_COMPRESSION = 6;

    /**
     * Serve images from storage to work around Railway storage link issues
     */
    public function serve(Request $request, string $path)
    {
        // Handle CORS preflight request
        if ($request->method() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        // Don't decode - use path as-is since we're not encoding anymore

        // Try to find the file in public storage
        $disk = Storage::disk('public');

        if ($disk->exists($path)) {
            $mimeType = $disk->mimeType($path);
            $file = $this->optimized($disk, $path, $mimeType);

            $response = response($file, 200)
                ->header('Content-Type', $mimeType)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                ->header('Access-Control-Expose-Headers', 'Content-Length, Content-Type')
                ->header('Cross-Origin-Resource-Policy', 'cross-origin')
                ->header('Cache-Control', 'public, max-age=31536000');

            return $response;
        }

        abort(404, 'Image not found');
    }

    /**
     * Admin uploads are stored verbatim (see ProductController::storeProductImage) with
     * no resizing, so some are several-thousand-px originals shown at a few hundred px on
     * the site. Downscale + recompress oversized JPEG/PNG/WEBP on first request and cache
     * the result next to the original, so repeat requests just read the cached file. Any
     * failure (GD missing, corrupt image, unsupported format) falls back to the original
     * bytes untouched - this must never be the reason an image stops loading.
     */
    private function optimized($disk, string $path, string $mimeType): string
    {
        $canEncode = match ($mimeType) {
            'image/jpeg' => function_exists('imagejpeg'),
            'image/png' => function_exists('imagepng'),
            'image/webp' => function_exists('imagewebp'),
            default => false,
        };

        if (! $canEncode || ! extension_loaded('gd')) {
            return $disk->get($path);
        }

        $cachePath = 'optimized-cache/' . $path;

        if ($disk->exists($cachePath) && $disk->lastModified($cachePath) >= $disk->lastModified($path)) {
            return $disk->get($cachePath);
        }

        $original = $disk->get($path);

        try {
            $size = @getimagesizefromstring($original);
            if (! $size) {
                return $original;
            }
            [$width, $height] = $size;

            if ($width <= self::MAX_DIMENSION && $height <= self::MAX_DIMENSION) {
                return $original;
            }

            $source = @imagecreatefromstring($original);
            if ($source === false) {
                return $original;
            }

            // GD drops EXIF metadata on re-encode, so the Orientation tag phones write
            // (e.g. "rotate 90deg to display correctly") would otherwise be lost, leaving
            // the resized image tilted. Bake the correct rotation into the pixels first.
            if ($mimeType === 'image/jpeg' && function_exists('exif_read_data')) {
                $source = $this->applyExifOrientation($source, $original);
                $width = imagesx($source);
                $height = imagesy($source);
            }

            $ratio = self::MAX_DIMENSION / max($width, $height);
            $newWidth = max(1, (int) round($width * $ratio));
            $newHeight = max(1, (int) round($height * $ratio));

            $resized = imagecreatetruecolor($newWidth, $newHeight);

            if ($mimeType !== 'image/jpeg') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
            }

            imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($source);

            ob_start();
            match ($mimeType) {
                'image/png' => imagepng($resized, null, self::PNG_COMPRESSION),
                'image/webp' => imagewebp($resized, null, self::WEBP_QUALITY),
                default => imagejpeg($resized, null, self::JPEG_QUALITY),
            };
            $bytes = ob_get_clean();
            imagedestroy($resized);

            if (! $bytes) {
                return $original;
            }

            $disk->put($cachePath, $bytes);

            return $bytes;
        } catch (\Throwable $e) {
            return $original;
        }
    }

    /**
     * Rotate/flip a GD image resource so its pixels match the JPEG's EXIF Orientation
     * tag, since GD itself ignores that tag when decoding and would otherwise discard it.
     */
    private function applyExifOrientation($source, string $original)
    {
        $exif = @exif_read_data('data://image/jpeg;base64,' . base64_encode($original));
        $orientation = $exif['Orientation'] ?? 1;

        switch ($orientation) {
            case 2:
                imageflip($source, IMG_FLIP_HORIZONTAL);
                break;
            case 3:
                $source = imagerotate($source, 180, 0);
                break;
            case 4:
                imageflip($source, IMG_FLIP_VERTICAL);
                break;
            case 5:
                imageflip($source, IMG_FLIP_VERTICAL);
                $source = imagerotate($source, -90, 0);
                break;
            case 6:
                $source = imagerotate($source, -90, 0);
                break;
            case 7:
                imageflip($source, IMG_FLIP_HORIZONTAL);
                $source = imagerotate($source, -90, 0);
                break;
            case 8:
                $source = imagerotate($source, 90, 0);
                break;
        }

        return $source;
    }
}