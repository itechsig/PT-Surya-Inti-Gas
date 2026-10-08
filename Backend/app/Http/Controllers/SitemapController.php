<?php

namespace App\Http\Controllers;

use App\Models\JobVacancy;
use App\Models\Portfolio;
use App\Models\Product;
use Illuminate\Http\Response;

/**
 * Serves /sitemap.xml from the database so newly published products, portfolios
 * and job vacancies are discoverable without a frontend rebuild. Every URL is
 * listed once per language with hreflang alternates (same set as the <Seo>
 * component emits). If the DB is unreachable the static pages are still listed.
 */
class SitemapController extends Controller
{
    private const SITE = 'https://suryaintigas.com';
    private const LANGS = ['id', 'en', 'zh'];

    /** Public static routes (path after /{lang}). Legal pages are noindex, so omitted. */
    private const STATIC_PAGES = [
        '',
        'tentang-kami',
        'produk',
        'jaringan-distribusi',
        'portofolio',
        'galeri',
        'karir',
        'kontak',
    ];

    public function index(): Response
    {
        $entries = [];
        foreach (self::STATIC_PAGES as $segment) {
            $entries[] = [$segment === '' ? '' : "/$segment", null];
        }

        try {
            Product::where('is_published', true)->orderBy('display_order')->get(['slug', 'updated_at'])
                ->each(function ($p) use (&$entries) {
                    $entries[] = ['/produk/detail?id=' . rawurlencode($p->slug), $p->updated_at];
                });

            Portfolio::where('is_published', true)->orderBy('display_order')->get(['slug', 'updated_at'])
                ->each(function ($p) use (&$entries) {
                    $entries[] = ['/portofolio/' . rawurlencode($p->slug), $p->updated_at];
                });

            JobVacancy::where('is_active', true)->orderBy('display_order')->get(['id', 'updated_at'])
                ->each(function ($j) use (&$entries) {
                    $entries[] = ['/karir/' . $j->id, $j->updated_at];
                });
        } catch (\Throwable $e) {
            report($e);
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";
        foreach ($entries as [$path, $updatedAt]) {
            foreach (self::LANGS as $lang) {
                $xml .= "  <url>\n    <loc>" . $this->url($lang, $path) . "</loc>\n";
                if ($updatedAt) {
                    $xml .= '    <lastmod>' . $updatedAt->toAtomString() . "</lastmod>\n";
                }
                foreach (self::LANGS as $alt) {
                    $xml .= '    <xhtml:link rel="alternate" hreflang="' . $alt . '" href="' . $this->url($alt, $path) . "\"/>\n";
                }
                $xml .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . $this->url('id', $path) . "\"/>\n";
                $xml .= "  </url>\n";
            }
        }
        $xml .= "</urlset>\n";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    private function url(string $lang, string $path): string
    {
        return htmlspecialchars(self::SITE . "/$lang$path", ENT_XML1);
    }
}
