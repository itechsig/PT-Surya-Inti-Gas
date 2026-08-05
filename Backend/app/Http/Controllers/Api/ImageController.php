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
        // Decode the path (it was URL-encoded)
        $path = urldecode($path);
        
        // Try to find the file in public storage
        if (Storage::disk('public')->exists($path)) {
            $file = Storage::disk('public')->get($path);
            $mimeType = Storage::disk('public')->mimeType($path);
            
            return response($file, 200)->header('Content-Type', $mimeType);
        }
        
        abort(404, 'Image not found');
    }
}