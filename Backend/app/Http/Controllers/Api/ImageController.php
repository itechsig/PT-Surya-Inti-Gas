<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Serve images from storage to work around Railway storage link issues
     */
    public function serve(Request $request, string $path)
    {
        // Handle CORS preflight request
        if ($request->method() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }
        
        // Don't decode - use path as-is since we're not encoding anymore
        
        // Try to find the file in public storage
        if (Storage::disk('public')->exists($path)) {
            $file = Storage::disk('public')->get($path);
            $mimeType = Storage::disk('public')->mimeType($path);
            
            $response = response($file, 200)
                ->header('Content-Type', $mimeType)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                ->header('Access-Control-Expose-Headers', 'Content-Length, Content-Type')
                ->header('Cross-Origin-Resource-Policy', 'cross-origin')
                ->header('Cache-Control', 'public, max-age=31536000');
            
            return $response;
        }
        
        abort(404, 'Image not found');
    }
}