<?php

namespace App\Http\Controllers;

use App\Support\SiteUrls;
use Illuminate\Http\Response;

/**
 * Serves /sitemap.xml from the database so newly published products, portfolios
 * and job vacancies are discoverable without a frontend rebuild. Every URL is
 * listed once per language with hreflang alternates (same set as the <Seo>
 * component emits); the Indonesian-only landing pages have no alternates.
 */
class SitemapController extends Controller
{
    public function index(): Response
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";
        foreach (SiteUrls::entries() as [$path, $updatedAt, $langs]) {
            foreach ($langs as $lang) {
                $xml .= "  <url>\n    <loc>" . $this->url($lang, $path) . "</loc>\n";
                if ($updatedAt) {
                    $xml .= '    <lastmod>' . $updatedAt->toAtomString() . "</lastmod>\n";
                }
                if (count($langs) > 1) {
                    foreach ($langs as $alt) {
                        $xml .= '    <xhtml:link rel="alternate" hreflang="' . $alt . '" href="' . $this->url($alt, $path) . "\"/>\n";
                    }
                    $xml .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . $this->url('id', $path) . "\"/>\n";
                }
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
        return htmlspecialchars(SiteUrls::url($lang, $path), ENT_XML1);
    }
}
