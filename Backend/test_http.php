<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create a mock request with proper content
$request = \Illuminate\Http\Request::create('/api/v1/chatbot', 'POST', [], [], [], [], json_encode(['message' => 'Hello', 'history' => []]));
$request->headers->set('Content-Type', 'application/json');
$request->headers->set('Accept', 'application/json');

try {
    $response = $app->handle($request);
    echo 'Status: ' . $response->getStatusCode() . PHP_EOL;
    echo 'Content: ' . $response->getContent() . PHP_EOL;
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
    echo 'File: ' . $e->getFile() . PHP_EOL;
    echo 'Line: ' . $e->getLine() . PHP_EOL;
    echo 'Trace: ' . $e->getTraceAsString() . PHP_EOL;
}