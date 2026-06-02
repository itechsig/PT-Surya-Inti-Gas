<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $service = $app->make(\App\Services\ChatbotService::class);
    $response = $service->generateResponse('test message');
    echo 'Success: ' . json_encode($response) . PHP_EOL;
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
    echo 'File: ' . $e->getFile() . PHP_EOL;
    echo 'Line: ' . $e->getLine() . PHP_EOL;
    echo 'Trace: ' . $e->getTraceAsString() . PHP_EOL;
}