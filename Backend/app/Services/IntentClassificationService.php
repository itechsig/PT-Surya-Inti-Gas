<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class IntentClassificationService
{
    private GeminiApiKeyRotationService $apiKeyRotationService;

    // Define available intents
    private array $intents = [
        'greeting' => 'User is greeting or saying hello',
        'company_info' => 'User wants information about the company',
        'vision' => 'User asks about company vision',
        'mission' => 'User asks about company mission',
        'values' => 'User asks about company values',
        'history' => 'User asks about company history',
        'services' => 'User asks about services offered',
        'products' => 'User asks about products',
        'contact' => 'User wants contact information',
        'safety' => 'User asks about safety or certifications',
        'pricing' => 'User asks about pricing or costs',
        'ordering' => 'User wants to know how to order',
        'payment' => 'User asks about payment methods',
        'delivery' => 'User asks about delivery or shipping',
        'warranty' => 'User asks about warranty',
        'support' => 'User needs technical support or has complaints',
        'feedback' => 'User wants to give feedback',
        'team' => 'User asks about the team',
        'projects' => 'User asks about projects or portfolio',
        'thank_you' => 'User is expressing gratitude',
        'goodbye' => 'User is saying goodbye',
        'emergency' => 'User has an emergency situation',
        'unknown' => 'Intent could not be determined',
    ];

    public function __construct(GeminiApiKeyRotationService $apiKeyRotationService)
    {
        $this->apiKeyRotationService = $apiKeyRotationService;
    }

    /**
     * Classify the intent of a user message
     */
    public function classify(string $message): array
    {
        // Use only rule-based classification for faster response
        return $this->classifyWithRules($message);
    }

    /**
     * Classify using rule-based pattern matching
     */
    private function classifyWithRules(string $message): array
    {
        $message = strtolower(trim($message));
        $patterns = [
            'greeting' => [
                '/^(halo|hai|hello|hi|selamat|pagi|siang|sore|malam|assalamualaikum|salam|hey|hallo)/i',
                '/^(selamat|good)/i',
            ],
            'company_info' => [
                '/(perusahaan|tentang|profil|company|about|siapa|apa itu|info|informasi|kenalan)/i',
            ],
            'vision' => [
                '/(visi|vision|tujuan|cita-cita)/i',
            ],
            'mission' => [
                '/(misi|mission|tugas|fungsi)/i',
            ],
            'values' => [
                '/(nilai|value|prinsip|filosofi)/i',
            ],
            'history' => [
                '/(sejarah|history|berdiri|didirikan|sejak)/i',
            ],
            'services' => [
                '/(layanan|service|jasa|servis|bantu|bantuan|apa yang bisa|apa saja)/i',
            ],
            'products' => [
                '/(produk|product|barang|item|jual|jual apa)/i',
            ],
            'contact' => [
                '/(kontak|contact|hubungi|alamat|location|lokasi|dimana|di mana|kantor|office)/i',
            ],
            'safety' => [
                '/(aman|safety|keamanan|sertifikasi|certification|standar)/i',
            ],
            'pricing' => [
                '/(harga|price|biaya|cost|mahal|murah|quotation|quote)/i',
            ],
            'ordering' => [
                '/(pesan|order|beli|buy|cara pesan|bagaimana pesan|how to order)/i',
            ],
            'payment' => [
                '/(bayar|payment|pembayaran|transfer|kartu|tunai)/i',
            ],
            'delivery' => [
                '/(kirim|delivery|pengiriman|antar|dikirim|estimasi|lama)/i',
            ],
            'warranty' => [
                '/(garansi|warranty|jaminan)/i',
            ],
            'support' => [
                '/(technical|teknis|bantu teknis|troubleshoot|masalah teknis|complaint|keluhan|komplain|tidak puas)/i',
            ],
            'feedback' => [
                '/(feedback|masukan|saran|kritik)/i',
            ],
            'team' => [
                '/(tim|team|karyawan|staff|pegawai|orang|personil)/i',
            ],
            'projects' => [
                '/(proyek|project|portfolio|karya|pengalaman)/i',
            ],
            'thank_you' => [
                '/(terima kasih|thanks|makasih|thank you|thx|ty)/i',
            ],
            'goodbye' => [
                '/(sampai jumpa|bye|goodbye|selamat tinggal|dadah|see you)/i',
            ],
            'emergency' => [
                '/(emergency|darurat|kebocoran|bocor|crisis|bahaya)/i',
            ],
        ];

        $bestMatch = ['intent' => 'unknown', 'confidence' => 0.0];
        $matchCount = 0;

        foreach ($patterns as $intent => $regexList) {
            foreach ($regexList as $regex) {
                if (preg_match($regex, $message)) {
                    $matchCount++;
                    // Increase confidence for each pattern match
                    $confidence = 0.7 + ($matchCount * 0.1);
                    if ($confidence > $bestMatch['confidence']) {
                        $bestMatch = [
                            'intent' => $intent,
                            'confidence' => min($confidence, 0.95),
                        ];
                    }
                }
            }
        }

        return $bestMatch;
    }

    /**
     * Classify using AI (Gemini)
     */
    private function classifyWithAI(string $message): array
    {
        try {
            $intentList = implode(', ', array_keys($this->intents));
            
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
            $apiKey = $this->apiKeyRotationService->getCurrentApiKey();

            $prompt = "You are an intent classifier. Classify the following user message into ONE of these intents: {$intentList}

User message: \"{$message}\"

Respond with ONLY the intent name (e.g., 'greeting', 'company_info', etc.). If unsure, respond with 'unknown'.";

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.3,
                        'maxOutputTokens' => 50,
                    ],
                ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $intent = strtolower(trim($data['candidates'][0]['content']['parts'][0]['text']));
                    
                    // Validate the intent exists
                    if (array_key_exists($intent, $this->intents)) {
                        $this->apiKeyRotationService->recordKeyUsage($apiKey);
                        
                        return [
                            'intent' => $intent,
                            'confidence' => 0.85,
                            'method' => 'ai',
                        ];
                    }
                }
            }

            // Fallback to rule-based if AI fails
            return $this->classifyWithRules($message);
        } catch (\Exception $e) {
            Log::error('Intent classification AI error', [
                'message' => $e->getMessage(),
            ]);
            return $this->classifyWithRules($message);
        }
    }

    /**
     * Get all available intents
     */
    public function getIntents(): array
    {
        return $this->intents;
    }

    /**
     * Get intent description
     */
    public function getIntentDescription(string $intent): ?string
    {
        return $this->intents[$intent] ?? null;
    }

    /**
     * Extract entities from message (simple implementation)
     */
    public function extractEntities(string $message, string $intent): array
    {
        $message = strtolower(trim($message));
        $entities = [];

        // Extract numbers (quantities, prices, etc.)
        if (preg_match_all('/\d+/', $message, $matches)) {
            $entities['numbers'] = $matches[0];
        }

        // Extract gas types
        $gasTypes = ['oksigen', 'oxygen', 'nitrogen', 'argon', 'helium', 'co2', 'lpg'];
        foreach ($gasTypes as $gas) {
            if (strpos($message, $gas) !== false) {
                $entities['gas_type'] = $gas;
                break;
            }
        }

        // Extract time references
        $timeReferences = ['pagi', 'siang', 'sore', 'malam', 'besok', 'hari ini', 'segera'];
        foreach ($timeReferences as $time) {
            if (strpos($message, $time) !== false) {
                $entities['time_reference'] = $time;
                break;
            }
        }

        return $entities;
    }
}
