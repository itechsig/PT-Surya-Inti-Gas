<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    private array $translations = [];
    private string $defaultLanguage = 'id';
    private string $currentLanguage = 'id';
    private AdvancedCacheService $cacheService;

    public function __construct(AdvancedCacheService $cacheService = null)
    {
        $this->cacheService = $cacheService ?? app(AdvancedCacheService::class);
        $this->loadTranslations();
    }

    /**
     * Set current language
     */
    public function setLanguage(string $language): void
    {
        $this->currentLanguage = $this->validateLanguage($language);
    }

    /**
     * Get current language
     */
    public function getCurrentLanguage(): string
    {
        return $this->currentLanguage;
    }

    /**
     * Get supported languages
     */
    public function getSupportedLanguages(): array
    {
        return [
            'id' => [
                'name' => 'Indonesian',
                'native_name' => 'Bahasa Indonesia',
                'flag' => '🇮🇩',
            ],
            'en' => [
                'name' => 'English',
                'native_name' => 'English',
                'flag' => '🇬🇧',
            ],
        ];
    }

    /**
     * Translate a key
     */
    public function translate(string $key, array $params = [], string $language = null): string
    {
        $language = $language ?? $this->currentLanguage;
        $language = $this->validateLanguage($language);

        $translation = $this->getTranslation($key, $language);

        // Replace parameters in translation
        if (!empty($params)) {
            foreach ($params as $param => $value) {
                $translation = str_replace(":{$param}", $value, $translation);
            }
        }

        return $translation;
    }

    /**
     * Get translation for a specific key and language
     */
    private function getTranslation(string $key, string $language): string
    {
        $cacheKey = "translation_{$language}_{$key}";
        
        return $this->cacheService->remember($cacheKey, function () use ($key, $language) {
            // Look for nested key (e.g., 'welcome.message')
            $keys = explode('.', $key);
            $value = $this->translations[$language] ?? [];

            foreach ($keys as $k) {
                if (is_array($value) && isset($value[$k])) {
                    $value = $value[$k];
                } else {
                    // Key not found, try default language
                    if ($language !== $this->defaultLanguage) {
                        return $this->getTranslation($key, $this->defaultLanguage);
                    }
                    // Key not found at all, return the key itself
                    return $key;
                }
            }

            return $value;
        }, 3600); // Cache for 1 hour
    }

    /**
     * Load translations from files or database
     */
    private function loadTranslations(): void
    {
        $cacheKey = 'translations_all';
        
        $this->translations = $this->cacheService->remember($cacheKey, function () {
            $translations = [];

            // Load Indonesian translations
            $translations['id'] = $this->getIndonesianTranslations();

            // Load English translations
            $translations['en'] = $this->getEnglishTranslations();

            return $translations;
        }, 86400); // Cache for 24 hours
    }

    /**
     * Get Indonesian translations
     */
    private function getIndonesianTranslations(): array
    {
        return [
            'welcome' => [
                'message' => 'Selamat datang di PT Surya Inti Gas',
                'greeting' => 'Halo! Ada yang bisa saya bantu?',
            ],
            'company' => [
                'name' => 'PT Surya Inti Gas',
                'description' => 'Perusahaan distributor gas yang berdiri sejak tahun 2004',
                'vision' => 'Menjadi perusahaan energi dan gas terdepan yang inovatif dan berkelanjutan di Indonesia',
                'mission' => 'Menyediakan produk dan layanan gas berkualitas tinggi dengan standar keamanan terbaik',
                'history' => 'PT Surya Inti Gas berdiri sejak tahun 2004 dan telah berkembang menjadi salah satu distributor gas terpercaya di Indonesia',
                'values' => 'Komitmen terhadap kualitas, keamanan, dan kepuasan pelanggan adalah nilai-nilai utama kami',
            ],
            'products' => [
                'gas_industri' => 'Gas industri termasuk Oksigen (O2), Nitrogen (N2), Argon (Ar), Acetylene (C2H2), Helium (He), dan lain-lain',
                'gas_medis' => 'Gas medis untuk kebutuhan rumah sakit dan kesehatan',
                'peralatan_gas' => 'Peralatan gas berkualitas tinggi untuk kebutuhan industri dan domestik',
                'dry_ice' => 'Dry ice untuk kebutuhan pendinginan dan pengawetan',
                'cryogenic_equipment' => 'Peralatan cryogenic untuk penanganan gas cair',
                'tabung_gas' => 'Tabung gas dengan berbagai kapasitas dan standar keamanan',
            ],
            'services' => [
                'supply_gas_industri' => 'Pasokan gas untuk kebutuhan industri dengan kualitas terjamin dan pengiriman tepat waktu',
                'supply_gas_domestik' => 'Pasokan gas untuk kebutuhan rumah tangga dan medis',
                'konsultasi_gas' => 'Layanan konsultasi untuk kebutuhan gas dan solusi kustom',
                'maintenance_instalasi' => 'Pemeliharaan dan instalasi gas dengan teknisi berpengalaman',
                'testing_kalibrasi' => 'Pengujian dan kalibrasi peralatan gas untuk standar keamanan',
                'emergency_response' => 'Layanan respon darurat untuk kebocoran gas dan situasi krisis',
            ],
            'contact' => [
                'phone' => '+62 31 9989 1234',
                'email' => 'info@suryaintigas.co.id',
                'social_media' => 'https://www.suryaintigas.co.id',
                'address_head_office' => 'Komplek Pergudangan & Industri Safe N Lock Blok V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232',
                'address_branch' => 'Jl. AMD Projakal Kariangau Km 5.5, Balikpapan, Kalimantan Timur',
            ],
            'chatbot' => [
                'greeting' => 'Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu?',
                'fallback' => 'Maaf, saya tidak yakin dengan pertanyaan tersebut. Anda bisa bertanya tentang layanan, produk, kontak, atau informasi perusahaan kami.',
                'thinking' => 'Sedang memproses permintaan Anda...',
                'error' => 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                'no_results' => 'Maaf, tidak ditemukan hasil yang relevan.',
            ],
            'common' => [
                'thank_you' => 'Terima kasih',
                'please_wait' => 'Mohon tunggu sebentar',
                'sorry' => 'Maaf',
                'welcome' => 'Selamat datang',
                'goodbye' => 'Sampai jumpa',
                'help' => 'Bantuan',
                'about' => 'Tentang',
                'contact' => 'Kontak',
                'products' => 'Produk',
                'services' => 'Layanan',
            ],
        ];
    }

    /**
     * Get English translations
     */
    private function getEnglishTranslations(): array
    {
        return [
            'welcome' => [
                'message' => 'Welcome to PT Surya Inti Gas',
                'greeting' => 'Hello! How can I help you?',
            ],
            'company' => [
                'name' => 'PT Surya Inti Gas',
                'description' => 'A gas distribution company established in 2004',
                'vision' => 'To become a leading innovative and sustainable energy and gas company in Indonesia',
                'mission' => 'To provide high-quality gas products and services with the best safety standards',
                'history' => 'PT Surya Inti Gas was established in 2004 and has grown to become one of the trusted gas distributors in Indonesia',
                'values' => 'Commitment to quality, safety, and customer satisfaction are our core values',
            ],
            'products' => [
                'gas_industri' => 'Industrial gases including Oxygen (O2), Nitrogen (N2), Argon (Ar), Acetylene (C2H2), Helium (He), and others',
                'gas_medis' => 'Medical gases for hospital and healthcare needs',
                'peralatan_gas' => 'High-quality gas equipment for industrial and domestic needs',
                'dry_ice' => 'Dry ice for cooling and preservation needs',
                'cryogenic_equipment' => 'Cryogenic equipment for handling liquid gases',
                'tabung_gas' => 'Gas cylinders with various capacities and safety standards',
            ],
            'services' => [
                'supply_gas_industri' => 'Gas supply for industrial needs with guaranteed quality and timely delivery',
                'supply_gas_domestik' => 'Gas supply for household and medical needs',
                'konsultasi_gas' => 'Gas consulting services and custom solutions',
                'maintenance_instalasi' => 'Gas maintenance and installation with experienced technicians',
                'testing_kalibrasi' => 'Gas equipment testing and calibration for safety standards',
                'emergency_response' => 'Emergency response services for gas leaks and crisis situations',
            ],
            'contact' => [
                'phone' => '+62 31 9989 1234',
                'email' => 'info@suryaintigas.co.id',
                'social_media' => 'https://www.suryaintigas.co.id',
                'address_head_office' => 'Safe N Lock Industrial & Warehousing Complex Block V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, East Java 61232',
                'address_branch' => 'Jl. AMD Projakal Kariangau Km 5.5, Balikpapan, East Kalimantan',
            ],
            'chatbot' => [
                'greeting' => 'Hello! Welcome to PT Surya Inti Gas. How can I help you?',
                'fallback' => 'Sorry, I am not sure about that question. You can ask about our services, products, contact information, or company information.',
                'thinking' => 'Processing your request...',
                'error' => 'Sorry, an error occurred. Please try again.',
                'no_results' => 'Sorry, no relevant results found.',
            ],
            'common' => [
                'thank_you' => 'Thank you',
                'please_wait' => 'Please wait a moment',
                'sorry' => 'Sorry',
                'welcome' => 'Welcome',
                'goodbye' => 'Goodbye',
                'help' => 'Help',
                'about' => 'About',
                'contact' => 'Contact',
                'products' => 'Products',
                'services' => 'Services',
            ],
        ];
    }

    /**
     * Validate language code
     */
    private function validateLanguage(string $language): string
    {
        $supportedLanguages = array_keys($this->getSupportedLanguages());
        
        if (in_array($language, $supportedLanguages)) {
            return $language;
        }
        
        // Fallback to default language
        Log::warning("Unsupported language: {$language}, falling back to: {$this->defaultLanguage}");
        return $this->defaultLanguage;
    }

    /**
     * Detect language from text
     */
    public function detectLanguage(string $text): string
    {
        // Simple language detection based on common words
        $indonesianKeywords = ['halo', 'hai', 'selamat', 'terima', 'kasih', 'maaf', 'tolong', 'bisa', 'apa', 'bagaimana', 'dimana', 'kapan', 'siapa', 'mengapa', 'berapa'];
        $englishKeywords = ['hello', 'hi', 'welcome', 'thank', 'sorry', 'please', 'can', 'what', 'how', 'where', 'when', 'who', 'why', 'how much'];

        $textLower = strtolower($text);
        
        $indonesianMatches = 0;
        $englishMatches = 0;

        foreach ($indonesianKeywords as $word) {
            if (str_contains($textLower, $word)) {
                $indonesianMatches++;
            }
        }

        foreach ($englishKeywords as $word) {
            if (str_contains($textLower, $word)) {
                $englishMatches++;
            }
        }

        if ($indonesianMatches > $englishMatches) {
            return 'id';
        } elseif ($englishMatches > $indonesianMatches) {
            return 'en';
        }

        // Default to Indonesian if unsure
        return $this->defaultLanguage;
    }

    /**
     * Get translation with automatic language detection
     */
    public function translateAuto(string $key, array $params = []): string
    {
        return $this->translate($key, $params, $this->currentLanguage);
    }

    /**
     * Clear translation cache
     */
    public function clearCache(): bool
    {
        return $this->cacheService->clearPattern('translation_*');
    }

    /**
     * Reload translations
     */
    public function reloadTranslations(): void
    {
        $this->clearCache();
        $this->loadTranslations();
    }
}
