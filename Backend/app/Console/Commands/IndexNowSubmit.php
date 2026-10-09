<?php

namespace App\Console\Commands;

use App\Services\IndexNowService;
use App\Support\SiteUrls;
use Illuminate\Console\Command;

/**
 * Submits every public URL (the same list as /sitemap.xml) to IndexNow — run it
 * after a deploy that adds or changes pages. Admin CMS edits are submitted
 * automatically (AppServiceProvider::registerIndexNowHooks), so this is only
 * needed for frontend changes. The key file must already be live on the site.
 */
class IndexNowSubmit extends Command
{
    protected $signature = 'indexnow:submit {url?* : Specific absolute URLs; omit to submit the whole site}';

    protected $description = 'Notify Bing, Yandex and other IndexNow search engines about site URLs';

    public function handle(IndexNowService $indexNow): int
    {
        $urls = $this->argument('url') ?: SiteUrls::all();
        $this->info('Submitting ' . count($urls) . ' URL(s) to IndexNow...');

        // The API accepts up to 10,000 URLs per request.
        foreach (array_chunk($urls, 10000) as $chunk) {
            $status = $indexNow->submit($chunk);
            if (!in_array($status, [200, 202], true)) {
                $this->error('IndexNow rejected the submission (HTTP ' . ($status ?? 'no response') . '). See storage/logs for details.');
                $this->line('403 = key file not found on the live site yet; 422 = URL does not belong to the host.');
                return self::FAILURE;
            }
        }

        $this->info('Accepted.');
        return self::SUCCESS;
    }
}
