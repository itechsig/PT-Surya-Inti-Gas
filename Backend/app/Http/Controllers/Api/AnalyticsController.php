<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use App\Models\WebsiteVisitor;
use App\Services\Analytics\SearchConsoleService;
use App\Support\AnalyticsPeriod;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * New, self-contained controller for the admin Analytics dashboard enhancement
 * (Traffic Source, Google Search, Social & Campaign, Top Pages, User Journey, Events).
 * Reads only from the new `analytics_events` table (plus a read-only device/browser
 * breakdown from the existing `website_visitors` table) — DashboardController and
 * VisitorTrackingController are untouched.
 */
class AnalyticsController extends Controller
{
    use HandlesApiErrors;

    private const CLICK_EVENT_TYPES = ['whatsapp_click', 'phone_click', 'email_click'];
    private const EVENT_TYPES = ['page_view', 'whatsapp_click', 'phone_click', 'email_click', 'product_view', 'catalog_download'];

    private const CHANNEL_LABELS = [
        'instagram' => 'Instagram',
        'tiktok' => 'TikTok',
        'whatsapp' => 'WhatsApp',
        'linkedin' => 'LinkedIn',
        'facebook' => 'Facebook',
        'youtube' => 'YouTube',
        'google' => 'Google Organic',
    ];

    private const PAGE_LABELS = [
        '' => 'Beranda',
        'produk' => 'Produk',
        'galeri' => 'Galeri',
        'portofolio' => 'Portofolio',
        'karir' => 'Karir',
        'kontak' => 'Kontak',
        'tentang-kami' => 'Tentang Kami',
        'jaringan-distribusi' => 'Jaringan Distribusi',
        'kebijakan-privasi' => 'Kebijakan Privasi',
        'ketentuan-layanan' => 'Ketentuan Layanan',
    ];

    /**
     * Public: record a page view or a contact-intent click from the public site.
     * Fire-and-forget from the frontend, intentionally tolerant of bad input —
     * mirrors ProductInteractionController::track().
     */
    public function trackEvent(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'event_type' => 'required|in:' . implode(',', self::EVENT_TYPES),
                'page' => 'nullable|string|max:500',
                'label' => 'nullable|string|max:255',
                'session_id' => 'nullable|string|max:255',
                'utm_source' => 'nullable|string|max:100',
                'utm_medium' => 'nullable|string|max:100',
                'utm_campaign' => 'nullable|string|max:150',
                'utm_content' => 'nullable|string|max:150',
                'referrer' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => 'Invalid event payload'], 422);
            }

            AnalyticsEvent::create([
                ...$validator->validated(),
                'page' => $this->normalizePagePath($request->input('page')),
                'created_at' => now(),
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to record event', 'analytics_event_track_failed');
        }
    }

    /**
     * Admin: daily visit trend for the date-range filter, date-range aware from day one.
     * Same {date, count} shape as VisitorTrackingController::timeline() (which stays
     * fixed at 14 days, untouched) so the existing "Tren Kunjungan" chart only needs
     * its data source swapped, not its rendering code.
     */
    public function trafficTrend(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            $counts = AnalyticsEvent::type('page_view')->between($start, $end)
                ->get(['session_id', 'created_at'])
                ->groupBy(fn ($row) => $row->created_at->format('Y-m-d'))
                ->map(fn ($rows) => $rows->pluck('session_id')->filter()->unique()->count());

            $days = (int) $start->diffInDays($end) + 1;
            $timeline = collect(range(0, $days - 1))->map(function ($offset) use ($start, $counts) {
                $key = $start->copy()->addDays($offset)->format('Y-m-d');

                return ['date' => $key, 'count' => $counts->get($key, 0)];
            });

            return response()->json(['success' => true, 'data' => $timeline]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get traffic trend', 'analytics_traffic_trend_failed');
        }
    }

    /** Admin: channel breakdown — where visits came from. */
    public function trafficSource(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);
            $firstTouches = $this->firstTouchPerSession($start, $end);

            $buckets = [];
            foreach ($firstTouches as $touch) {
                $channel = $this->classifyChannel($touch->utm_source, $touch->referrer);
                $buckets[$channel] = ($buckets[$channel] ?? 0) + 1;
            }

            arsort($buckets);
            $total = array_sum($buckets) ?: 1;

            $data = [];
            foreach ($buckets as $channel => $count) {
                $data[] = [
                    'channel' => $channel,
                    'users' => $count,
                    'sessions' => $count,
                    'percentage' => round($count / $total * 100, 1),
                ];
            }

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get traffic source data', 'analytics_traffic_source_failed');
        }
    }

    /** Admin: UTM-tagged campaign performance (Instagram/TikTok/WhatsApp/LinkedIn/Facebook/YouTube). */
    public function campaigns(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);
            $firstTouches = $this->firstTouchPerSession($start, $end)
                ->filter(fn ($touch) => !empty($touch->utm_source));

            $groups = $firstTouches->groupBy(fn ($touch) => ($touch->utm_source ?: '-') . '|' . ($touch->utm_campaign ?: '-'));

            $data = $groups->map(function ($rows, $key) use ($start, $end) {
                [$source, $campaign] = explode('|', $key, 2);
                $sessionIds = $rows->pluck('session_id')->filter()->values();

                $conversions = AnalyticsEvent::whereIn('event_type', self::CLICK_EVENT_TYPES)
                    ->whereIn('session_id', $sessionIds)
                    ->between($start, $end)
                    ->distinct()
                    ->count('session_id');

                return [
                    'source' => $this->channelLabel($source),
                    'campaign' => $campaign === '-' ? null : $campaign,
                    'users' => $rows->count(),
                    'sessions' => $rows->count(),
                    'conversions' => $conversions,
                ];
            })->sortByDesc('users')->values();

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get campaign performance', 'analytics_campaigns_failed');
        }
    }

    /** Admin: most-visited sections of the site, locale-prefix normalized. */
    public function topPages(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            $rows = AnalyticsEvent::type('page_view')
                ->between($start, $end)
                ->get(['page', 'session_id']);

            $grouped = $rows->groupBy(fn ($row) => $this->normalizePageSegment($row->page));

            $data = $grouped->map(function ($rows, $segment) {
                return [
                    'page' => self::PAGE_LABELS[$segment] ?? ucfirst(str_replace('-', ' ', $segment)),
                    'views' => $rows->count(),
                    'users' => $rows->pluck('session_id')->filter()->unique()->count(),
                ];
            })->sortByDesc('views')->take(10)->values();

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get top pages', 'analytics_top_pages_failed');
        }
    }

    /**
     * Admin: a simple, honest funnel. "Visitor" and "Landing Page" collapse into one
     * stage on purpose — in this data model every visitor's first action is a page
     * view, so they're always identical numbers; showing both would look like a bug.
     * "Conversion" here means a contact-intent click (WhatsApp/phone/email) — a
     * click-based proxy, not e-commerce checkout data we don't have.
     */
    public function funnel(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            $visitors = AnalyticsEvent::type('page_view')->between($start, $end)
                ->distinct()->count('session_id');

            $viewedProduct = AnalyticsEvent::type('page_view')->between($start, $end)
                ->where('page', 'like', '%/produk%')
                ->distinct()->count('session_id');

            $viewedContact = AnalyticsEvent::type('page_view')->between($start, $end)
                ->where('page', 'like', '%/kontak%')
                ->distinct()->count('session_id');

            $converted = AnalyticsEvent::whereIn('event_type', self::CLICK_EVENT_TYPES)->between($start, $end)
                ->distinct()->count('session_id');

            $stages = [
                ['stage' => 'Pengunjung', 'count' => $visitors],
                ['stage' => 'Melihat Produk', 'count' => $viewedProduct],
                ['stage' => 'Membuka Halaman Kontak', 'count' => $viewedContact],
                ['stage' => 'Konversi (Klik WhatsApp/Telepon/Email)', 'count' => $converted],
            ];

            $base = $visitors ?: 1;
            foreach ($stages as &$stage) {
                $stage['percentage'] = round($stage['count'] / $base * 100, 1);
            }

            return response()->json(['success' => true, 'data' => $stages]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get funnel data', 'analytics_funnel_failed');
        }
    }

    /** Admin: counts per tracked event type — including types with zero events so far. */
    public function events(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            $counts = AnalyticsEvent::between($start, $end)
                ->select('event_type')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('event_type')
                ->pluck('count', 'event_type');

            $labels = [
                'whatsapp_click' => 'WhatsApp Click',
                'phone_click' => 'Phone Click',
                'email_click' => 'Email Click',
                'product_view' => 'Product View',
                'catalog_download' => 'Catalog Download',
            ];

            $data = [];
            foreach ($labels as $type => $label) {
                $data[] = ['event_type' => $type, 'label' => $label, 'count' => (int) ($counts[$type] ?? 0)];
            }

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get event counts', 'analytics_events_failed');
        }
    }

    /** Admin: browser/OS breakdown — reads the existing website_visitors table, read-only. */
    public function deviceBreakdown(Request $request): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            $topBy = fn (string $column) => WebsiteVisitor::whereBetween('first_visit', [$start, $end])
                ->whereNotNull($column)
                ->where($column, '!=', '')
                ->select($column)
                ->selectRaw('COUNT(*) as count')
                ->groupBy($column)
                ->orderByDesc('count')
                ->limit(6)
                ->get()
                ->map(fn ($row) => ['label' => $row->{$column}, 'count' => $row->count]);

            return response()->json([
                'success' => true,
                'data' => ['browsers' => $topBy('browser'), 'operating_systems' => $topBy('os')],
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get device breakdown', 'analytics_device_breakdown_failed');
        }
    }

    /** Admin: Google Search Console summary, or {connected:false} when not configured. */
    public function searchConsole(Request $request, SearchConsoleService $service): JsonResponse
    {
        try {
            [$start, $end] = AnalyticsPeriod::fromRequest($request);

            return response()->json(['success' => true, 'data' => $service->getSummary($start, $end)]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get Search Console data', 'analytics_search_console_failed');
        }
    }

    /** First analytics_events row (by created_at) per session_id — first-touch attribution. */
    private function firstTouchPerSession($start, $end)
    {
        return AnalyticsEvent::type('page_view')
            ->between($start, $end)
            ->whereNotNull('session_id')
            ->orderBy('created_at')
            ->get(['session_id', 'utm_source', 'utm_campaign', 'referrer'])
            ->unique('session_id');
    }

    private function classifyChannel(?string $utmSource, ?string $referrer): string
    {
        if ($utmSource) {
            return $this->channelLabel($utmSource);
        }

        if (!$referrer) {
            return 'Direct';
        }

        $host = strtolower((string) (parse_url($referrer, PHP_URL_HOST) ?? ''));

        return match (true) {
            $host === '' => 'Direct',
            str_contains($host, 'google.') => 'Google Organic',
            str_contains($host, 'instagram.com') => 'Instagram',
            str_contains($host, 'tiktok.com') => 'TikTok',
            str_contains($host, 'wa.me') || str_contains($host, 'whatsapp.com') => 'WhatsApp',
            str_contains($host, 'linkedin.com') => 'LinkedIn',
            str_contains($host, 'facebook.com') || str_contains($host, 'fb.com') => 'Facebook',
            str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be') => 'YouTube',
            default => 'Referral',
        };
    }

    private function channelLabel(string $utmSource): string
    {
        $key = strtolower($utmSource);

        return self::CHANNEL_LABELS[$key] ?? ucfirst($utmSource);
    }

    /** Strips the /id|en|zh locale prefix so /id/produk and /en/produk group together. */
    private function normalizePagePath(?string $path): ?string
    {
        if (!$path) {
            return $path;
        }

        return preg_replace('#^/(id|en|zh)(?=/|$)#', '', $path) ?: '/';
    }

    /** First path segment after locale-stripping, e.g. "/produk/detail" -> "produk". */
    private function normalizePageSegment(?string $path): string
    {
        $normalized = $this->normalizePagePath($path) ?? '/';
        $segments = array_values(array_filter(explode('/', $normalized)));

        return $segments[0] ?? '';
    }
}
