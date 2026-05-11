<?php

use Illuminate\Support\Facades\Route;

// main route
Route::get('/', function () {
    return view('welcome');
});

// API routes for frontend
Route::get('/api/hero', function () {
    return response()->json([
        'title' => 'Konstruksi Kokoh, Hasil Terpercaya',
        'subtitle' => 'Membangun Masa Depan Indonesia'
    ]);
});

Route::get('/api/about', function () {
    return response()->json([
        'title' => 'Tentang Kami',
        'description' => 'PT Konstruksi Mandiri - Mitra strategis dalam infrastruktur berkualitas'
    ]);
});

Route::get('/api/services', function () {
    return response()->json([
        'title' => 'Layanan Kami',
        'services' => ['Konstruksi Gedung', 'Infrastruktur', 'Renovasi & Maintenance']
    ]);
});

Route::get('/api/portfolio', function () {
    return response()->json([
        'title' => 'Portofolio Proyek',
        'description' => 'Proyek-proyek terbaik kami'
    ]);
});

Route::get('/api/team', function () {
    return response()->json([
        'title' => 'Tim Kami',
        'description' => 'Pakar dibalik kesuksesan kami'
    ]);
});

Route::get('/api/contact', function () {
    return response()->json([
        'title' => 'Kontak Kami',
        'description' => 'Hubungi PT Konstruksi Mandiri'
    ]);
});

// Catch-all route to handle frontend routing (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
