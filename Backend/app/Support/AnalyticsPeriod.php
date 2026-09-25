<?php

namespace App\Support;

use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * Resolves the admin Analytics dashboard's date-range filter (7d/30d/90d/180d/365d/custom)
 * into a [start, end] Carbon pair. New, standalone helper — does not touch
 * DashboardController::getStartDate(), which stays exactly as it is for the existing
 * dashboard overview endpoint.
 */
class AnalyticsPeriod
{
    public const RANGES = ['7d', '30d', '90d', '180d', '365d', 'custom'];

    /** @return array{0: Carbon, 1: Carbon, 2: string} [$start, $end, $rangeUsed] */
    public static function fromRequest(Request $request): array
    {
        $range = $request->input('range', '30d');
        if (!in_array($range, self::RANGES, true)) {
            $range = '30d';
        }

        if ($range === 'custom') {
            $start = self::parseDate($request->input('start'));
            $end = self::parseDate($request->input('end'));

            if ($start && $end && $start->lte($end)) {
                return [$start->startOfDay(), $end->endOfDay(), 'custom'];
            }

            // Malformed custom range — fall back to 30d rather than erroring the widget.
            $range = '30d';
        }

        $days = (int) str_replace('d', '', $range);

        return [now()->subDays($days - 1)->startOfDay(), now()->endOfDay(), $range];
    }

    private static function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }
}
