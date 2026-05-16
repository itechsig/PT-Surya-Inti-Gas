<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('api')->group(function () {
    // Team Members API
    Route::get('/team', [TeamController::class, 'index']);
    Route::get('/team/{teamMember}', [TeamController::class, 'show']);

    // Projects API
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);

    // Certifications API
    Route::get('/certifications', [CertificationController::class, 'index']);
    Route::get('/certifications/{certification}', [CertificationController::class, 'show']);

    // Contact Form API
    Route::post('/contact', [ContactController::class, 'store']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});
