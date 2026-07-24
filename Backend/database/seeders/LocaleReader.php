<?php

namespace Database\Seeders;

/**
 * Reads the frontend's id/en/zh locale JSON files so seeders can source real
 * translated copy instead of placeholder text, keeping the CMS cutover visually
 * identical to the static site it replaces.
 */
class LocaleReader
{
    private static ?array $cache = null;

    public static function load(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $dir = base_path('../Frontend/src/locales');
        $locales = [];

        foreach (['id', 'en', 'zh'] as $lang) {
            $path = $dir . "/{$lang}.json";
            $locales[$lang] = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        }

        return self::$cache = $locales;
    }

    public static function imagesDir(): string
    {
        return base_path('../Frontend/public/images/products');
    }
}
