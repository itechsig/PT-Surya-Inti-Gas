<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Promise\Promise;

class HttpClientPoolService
{
    private array $pool = [];
    private int $maxConnections;
    private int $timeout;
    private array $availableConnections = [];
    private array $activeConnections = [];

    public function __construct()
    {
        $this->maxConnections = config('services.gemini.pool_size', 5);
        $this->timeout = config('services.gemini.timeout', 30);
    }

    /**
     * Get a connection from the pool
     */
    public function getConnection(): int
    {
        // Find or create an available connection
        if (!empty($this->availableConnections)) {
            $connectionId = array_pop($this->availableConnections);
            $this->activeConnections[$connectionId] = true;
            return $connectionId;
        }

        // Create new connection if under limit
        if (count($this->pool) < $this->maxConnections) {
            $connectionId = count($this->pool);
            $this->pool[$connectionId] = [
                'created_at' => now(),
                'requests' => 0,
                'last_used' => now(),
            ];
            $this->activeConnections[$connectionId] = true;
            return $connectionId;
        }

        // Wait for available connection (simple implementation)
        $this->waitForAvailableConnection();
        return $this->getConnection();
    }

    /**
     * Release a connection back to the pool
     */
    public function releaseConnection(int $connectionId): void
    {
        if (isset($this->activeConnections[$connectionId])) {
            $this->activeConnections[$connectionId] = false;
            $this->availableConnections[] = $connectionId;
            
            // Update stats
            if (isset($this->pool[$connectionId])) {
                $this->pool[$connectionId]['last_used'] = now();
                $this->pool[$connectionId]['requests']++;
            }
        }
    }

    /**
     * Make HTTP request using pooled connection
     */
    public function request(string $method, string $url, array $options = [], int $connectionId = null): ?array
    {
        $connectionId = $connectionId ?? $this->getConnection();

        try {
            // Extract headers and json/body from options
            $headers = $options['headers'] ?? [];
            $json = $options['json'] ?? null;
            $body = $options['body'] ?? null;

            $httpRequest = Http::timeout($this->timeout)
                ->withOptions([
                    'connect_timeout' => $this->timeout,
                    'timeout' => $this->timeout,
                ]);

            if (!empty($headers)) {
                $httpRequest->withHeaders($headers);
            }

            if ($json !== null) {
                $response = $httpRequest->$method($url, $json);
            } elseif ($body !== null) {
                $response = $httpRequest->$method($url, $body);
            } else {
                $response = $httpRequest->$method($url);
            }

            return [
                'success' => $response->successful(),
                'status' => $response->status(),
                'data' => $response->json(),
                'body' => $response->body(),
                'connection_id' => $connectionId,
            ];
        } catch (\Exception $e) {
            Log::error('HTTP pool request failed', [
                'connection_id' => $connectionId,
                'error' => $e->getMessage(),
            ]);
            
            return null;
        } finally {
            $this->releaseConnection($connectionId);
        }
    }

    /**
     * Get pool statistics
     */
    public function getStats(): array
    {
        return [
            'total_connections' => count($this->pool),
            'active_connections' => count($this->activeConnections),
            'available_connections' => count($this->availableConnections),
            'max_connections' => $this->maxConnections,
            'pool_utilization' => $this->maxConnections > 0 
                ? round((count($this->activeConnections) / $this->maxConnections) * 100, 2) 
                : 0,
        ];
    }

    /**
     * Wait for available connection (simple implementation)
     */
    private function waitForAvailableConnection(): void
    {
        $maxWaitTime = 5; // seconds
        $waitInterval = 100000; // microseconds
        $totalWaited = 0;

        while (empty($this->availableConnections) && $totalWaited < ($maxWaitTime * 1000000)) {
            usleep($waitInterval);
            $totalWaited += $waitInterval;
        }
    }

    /**
     * Cleanup old connections
     */
    public function cleanup(): void
    {
        $oneHourAgo = now()->subHour();
        
        foreach ($this->pool as $id => $data) {
            if ($data['last_used']->lt($oneHourAgo) && empty($this->activeConnections[$id])) {
                unset($this->pool[$id]);
                // Also remove from available if present
                $this->availableConnections = array_diff($this->availableConnections, [$id]);
            }
        }
    }
}
