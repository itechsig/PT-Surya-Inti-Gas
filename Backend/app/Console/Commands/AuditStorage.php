<?php

namespace App\Console\Commands;

use App\Models\GalleryItem;
use App\Models\HeroSlide;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * Read-only audit: cross-references every "image" field this app manages against what
 * actually exists on the `public` storage disk. Never writes to the database and never
 * touches the filesystem beyond listing it - safe to run against production.
 *
 * Usage: php artisan storage:audit [--json]
 */
class AuditStorage extends Command
{
    protected $signature = 'storage:audit {--json : Output the report as JSON instead of a formatted table}';

    protected $description = 'Audit storage/app/public against every model image field and report missing files';

    /** @var array<string> Every relative path found on the public disk, for O(1) lookups. */
    private array $diskFiles = [];

    public function handle(): int
    {
        $this->diskFiles = Storage::disk('public')->allFiles();
        $diskFileSet = array_flip($this->diskFiles);

        $this->line('========================================');
        $this->line('STORAGE FILESYSTEM AUDIT (storage/app/public)');
        $this->line('========================================');
        $this->line('Total files on disk: ' . count($this->diskFiles));
        $this->newLine();

        $groups = [
            'Hero Slides' => $this->auditHeroSlides($diskFileSet),
            'Products' => $this->auditProducts($diskFileSet),
            'Gallery' => $this->auditGallery($diskFileSet),
            'Portfolios' => $this->auditPortfolios($diskFileSet),
        ];

        if ($this->option('json')) {
            $this->line(json_encode($groups, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            return self::SUCCESS;
        }

        $totalValid = 0;
        $totalMissing = 0;
        $totalExternal = 0;

        foreach ($groups as $groupName => $records) {
            $valid = collect($records)->where('status', 'OK')->count();
            $missing = collect($records)->where('status', 'MISSING')->count();
            $external = collect($records)->where('status', 'EXTERNAL')->count();
            $totalValid += $valid;
            $totalMissing += $missing;
            $totalExternal += $external;

            $this->line($groupName);
            $this->line(str_repeat('-', 40));
            $this->line("VALID    : {$valid}");
            $this->line("MISSING  : {$missing}");
            if ($external > 0) {
                $this->line("EXTERNAL : {$external} (external http(s) URL, not a local file - not counted as broken)");
            }
            $this->newLine();

            foreach ($records as $r) {
                if ($r['status'] !== 'MISSING') {
                    continue;
                }
                $this->line("  Model      : {$r['model']}");
                $this->line("  ID         : {$r['id']}");
                $this->line("  Field      : {$r['field']}");
                $this->line("  DB Value   : {$r['db_value']}");
                $this->line("  Resolved   : {$r['resolved_path']}");
                $this->line("  Status     : MISSING");
                $this->newLine();
            }
        }

        $this->line('========================================');
        $this->line('TOTAL');
        $this->line('========================================');
        $this->line("VALID    : {$totalValid}");
        $this->line("MISSING  : {$totalMissing}");
        $this->line("EXTERNAL : {$totalExternal}");

        return self::SUCCESS;
    }

    /**
     * Resolves whatever is stored in an image column back to a path relative to the
     * `public` disk root, so it can be checked against Storage::disk('public')->allFiles().
     * Returns null for values that aren't checkable against this disk (external URLs,
     * or frontend-only static asset paths like "/images/...").
     */
    private function resolveToRelativePath(?string $raw): array
    {
        if (!$raw) {
            return ['resolved' => null, 'external' => false];
        }

        if (str_starts_with($raw, 'http://') || str_starts_with($raw, 'https://')) {
            foreach (['/api/v1/image/', '/storage/'] as $marker) {
                $pos = strpos($raw, $marker);
                if ($pos !== false) {
                    return ['resolved' => urldecode(substr($raw, $pos + strlen($marker))), 'external' => false];
                }
            }
            // No recognizable marker - a genuinely external URL (e.g. Unsplash), not one of ours.
            return ['resolved' => null, 'external' => true];
        }

        if (str_starts_with($raw, '/images/')) {
            // Frontend static asset (Frontend/public/images/...), not a Laravel storage path.
            return ['resolved' => null, 'external' => true];
        }

        return ['resolved' => ltrim($raw, '/'), 'external' => false];
    }

    private function checkOne(string $model, int|string $id, string $field, ?string $raw, array $diskFileSet): array
    {
        ['resolved' => $resolved, 'external' => $external] = $this->resolveToRelativePath($raw);

        if ($external) {
            return [
                'model' => $model, 'id' => $id, 'field' => $field,
                'db_value' => $raw ?? '(empty)', 'resolved_path' => '(external URL - not on this disk)',
                'status' => 'EXTERNAL',
            ];
        }

        if ($resolved === null) {
            return [
                'model' => $model, 'id' => $id, 'field' => $field,
                'db_value' => $raw ?? '(empty)', 'resolved_path' => '(empty)',
                'status' => 'MISSING',
            ];
        }

        return [
            'model' => $model, 'id' => $id, 'field' => $field,
            'db_value' => $raw, 'resolved_path' => $resolved,
            'status' => isset($diskFileSet[$resolved]) ? 'OK' : 'MISSING',
        ];
    }

    private function auditHeroSlides(array $diskFileSet): array
    {
        return HeroSlide::all()->map(
            fn (HeroSlide $s) => $this->checkOne('HeroSlide', $s->id, 'image', $s->image, $diskFileSet)
        )->all();
    }

    private function auditProducts(array $diskFileSet): array
    {
        $records = [];
        foreach (Product::all() as $p) {
            $records[] = $this->checkOne('Product', $p->id, 'image', $p->image, $diskFileSet);
            foreach (($p->gallery ?? []) as $i => $path) {
                $records[] = $this->checkOne('Product', $p->id, "gallery[{$i}]", $path, $diskFileSet);
            }
        }
        return $records;
    }

    private function auditGallery(array $diskFileSet): array
    {
        return GalleryItem::all()->map(
            fn (GalleryItem $g) => $this->checkOne('GalleryItem', $g->id, 'image', $g->image, $diskFileSet)
        )->all();
    }

    private function auditPortfolios(array $diskFileSet): array
    {
        $records = [];
        foreach (Portfolio::all() as $p) {
            $records[] = $this->checkOne('Portfolio', $p->id, 'thumbnail', $p->thumbnail, $diskFileSet);
        }
        foreach (PortfolioImage::all() as $img) {
            $records[] = $this->checkOne('PortfolioImage', $img->id, 'image', $img->image, $diskFileSet);
        }
        return $records;
    }
}
