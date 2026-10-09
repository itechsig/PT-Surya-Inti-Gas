<?php

namespace App\Support;

use App\Models\JobVacancy;
use App\Models\Portfolio;
use App\Models\Product;

/**
 * The public URLs of the SPA, shared by the sitemap (SitemapController) and
 * IndexNow submissions so both always describe the same set of pages.
 */
class SiteUrls
{
    public const SITE = 'https://suryaintigas.com';
    public const LANGS = ['id', 'en', 'zh'];

    /**
     * Public static routes (path after /{lang}). Legal pages are noindex, so omitted.
     * Keep in sync with ROUTES in Frontend/scripts/prerender-seo.mjs and the
     * prerender RewriteRule in public/.htaccess.
     */
    public const STATIC_PAGES = [
        '',
        'tentang-kami',
        'produk',
        'jaringan-distribusi',
        'portofolio',
        'galeri',
        'karir',
        'kontak',
    ];

    /**
     * Indonesian-only keyword landing pages (/id/{slug}). Keep in sync with
     * Frontend/src/data/landingPages.json and the landing RewriteRules in public/.htaccess.
     */
    public const LANDING_PAGES = [
        'supplier-gas-industri',
        'supplier-gas-medis',
        'peralatan-gas-industri',
        'distributor-gas-surabaya-sidoarjo',
        'distributor-gas-balikpapan',
    ];

    /**
     * Every indexable page as [path after /{lang}, last modified or null, languages].
     * If the DB is unreachable the static pages are still returned.
     *
     * @return array<int, array{0: string, 1: \Carbon\CarbonInterface|null, 2: string[]}>
     */
    public static function entries(): array
    {
        $entries = [];
        foreach (self::STATIC_PAGES as $segment) {
            $entries[] = [$segment === '' ? '' : "/$segment", null, self::LANGS];
        }
        foreach (self::LANDING_PAGES as $slug) {
            $entries[] = ["/$slug", null, ['id']];
        }

        try {
            Product::where('is_published', true)->orderBy('display_order')->get(['slug', 'updated_at'])
                ->each(function ($p) use (&$entries) {
                    $entries[] = [self::productPath($p->slug), $p->updated_at, self::LANGS];
                });

            Portfolio::where('is_published', true)->orderBy('display_order')->get(['slug', 'updated_at'])
                ->each(function ($p) use (&$entries) {
                    $entries[] = [self::portfolioPath($p->slug), $p->updated_at, self::LANGS];
                });

            JobVacancy::where('is_active', true)->orderBy('display_order')->get(['id', 'updated_at'])
                ->each(function ($j) use (&$entries) {
                    $entries[] = [self::jobPath($j->id), $j->updated_at, self::LANGS];
                });
        } catch (\Throwable $e) {
            report($e);
        }

        return $entries;
    }

    /** Every indexable absolute URL, one per language. */
    public static function all(): array
    {
        $urls = [];
        foreach (self::entries() as [$path, , $langs]) {
            foreach ($langs as $lang) {
                $urls[] = self::url($lang, $path);
            }
        }
        return $urls;
    }

    /** The absolute URL of a path in every language. */
    public static function localized(string $path): array
    {
        return array_map(fn ($lang) => self::url($lang, $path), self::LANGS);
    }

    public static function url(string $lang, string $path): string
    {
        return self::SITE . "/$lang$path";
    }

    public static function productPath(string $slug): string
    {
        return '/produk/detail?id=' . rawurlencode($slug);
    }

    public static function portfolioPath(string $slug): string
    {
        return '/portofolio/' . rawurlencode($slug);
    }

    public static function jobPath(int|string $id): string
    {
        return '/karir/' . $id;
    }
}
