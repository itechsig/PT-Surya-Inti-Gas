<?php

namespace App\Services\Analytics;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Minimal Google service-account OAuth2 (JWT-bearer) token exchange, hand-rolled on
 * purpose: adding GA4/Search Console support this way never touches composer.json/
 * composer.lock for the rest of this already-running app (no google/apiclient dependency).
 * Real, functional integration layer — just not exercised until a service account JSON
 * path is actually configured in .env.
 */
class GoogleServiceAccountAuth
{
    /** @param string[] $scopes */
    public static function getAccessToken(?string $credentialsPath, array $scopes): ?string
    {
        try {
            if (!$credentialsPath || !is_file($credentialsPath)) {
                return null;
            }

            $credentials = json_decode((string) file_get_contents($credentialsPath), true);
            $clientEmail = $credentials['client_email'] ?? null;
            $privateKey = $credentials['private_key'] ?? null;

            if (!$clientEmail || !$privateKey) {
                return null;
            }

            $now = time();
            $header = self::base64url((string) json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
            $claims = self::base64url((string) json_encode([
                'iss' => $clientEmail,
                'scope' => implode(' ', $scopes),
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now,
                'exp' => $now + 3600,
            ]));

            $signatureInput = "{$header}.{$claims}";
            $signature = '';
            $signed = openssl_sign($signatureInput, $signature, $privateKey, 'sha256WithRSAEncryption');

            if (!$signed) {
                return null;
            }

            $jwt = "{$signatureInput}." . self::base64url($signature);

            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt,
            ]);

            if (!$response->successful()) {
                Log::warning('Google service account token exchange failed', ['status' => $response->status()]);
                return null;
            }

            return $response->json('access_token');
        } catch (\Throwable $e) {
            Log::warning('Google service account auth error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private static function base64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
