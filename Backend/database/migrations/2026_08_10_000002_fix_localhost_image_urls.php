<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Fixes image URLs that contain localhost by converting them to relative paths.
 * This ensures that ImageUrl::resolve() will use the correct APP_URL instead of localhost.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Fix products table
        $this->fixTableColumn('products', 'image');
        $this->fixJsonColumn('products', 'gallery');
        
        // Fix hero_slides table
        $this->fixTableColumn('hero_slides', 'image');
        
        // Fix gallery_items table
        $this->fixTableColumn('gallery_items', 'image');
        
        // Fix portfolios table
        $this->fixTableColumn('portfolios', 'image');
        $this->fixJsonColumn('portfolios', 'images');
    }

    private function fixTableColumn(string $table, string $column): void
    {
        $records = DB::table($table)->where($column, 'like', 'http://localhost%')->get();
        
        foreach ($records as $record) {
            $oldValue = $record->$column;
            $newValue = $this->convertToLocalhostToRelative($oldValue);
            
            if ($newValue !== $oldValue) {
                DB::table($table)->where('id', $record->id)->update([$column => $newValue]);
            }
        }
    }

    private function fixJsonColumn(string $table, string $column): void
    {
        $records = DB::table($table)->whereNotNull($column)->get();
        
        foreach ($records as $record) {
            $jsonValue = $record->$column;
            if (!is_string($jsonValue)) {
                continue;
            }
            
            $array = json_decode($jsonValue, true);
            if (!is_array($array)) {
                continue;
            }
            
            $modified = false;
            foreach ($array as $key => $value) {
                if (is_string($value) && str_contains($value, 'http://localhost')) {
                    $array[$key] = $this->convertToLocalhostToRelative($value);
                    $modified = true;
                }
            }
            
            if ($modified) {
                DB::table($table)->where('id', $record->id)->update([$column => json_encode($array)]);
            }
        }
    }

    private function convertToLocalhostToRelative(string $url): string
    {
        // Extract the path from localhost URLs
        if (str_contains($url, '/api/v1/image/')) {
            $marker = '/api/v1/image/';
            $pos = strpos($url, $marker);
            if ($pos !== false) {
                $path = substr($url, $pos + strlen($marker));
                return urldecode($path);
            }
        }
        
        if (str_contains($url, '/storage/')) {
            $marker = '/storage/';
            $pos = strpos($url, $marker);
            if ($pos !== false) {
                return substr($url, $pos + strlen($marker));
            }
        }
        
        return $url;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is one-way - we can't reliably restore the original localhost URLs
    }
};
