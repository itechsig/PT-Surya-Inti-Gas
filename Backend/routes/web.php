<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Main route
Route::get('/', function () {
    return view('welcome');
});

// Web routes (non-API routes should go here)
// Note: API routes have been moved to routes/api.php for better organization
// All API endpoints should use the /api/v1/ prefix with proper middleware