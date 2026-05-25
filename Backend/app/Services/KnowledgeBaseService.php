<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class KnowledgeBaseService
{
    private array $knowledgeBase;
    private AdvancedCacheService $advancedCache;
    private TranslationService $translationService;
    private string $language = 'id';

    public function __construct(AdvancedCacheService $advancedCache = null, TranslationService $translationService = null)
    {
        $this->advancedCache = $advancedCache ?? app(AdvancedCacheService::class);
        $this->translationService = $translationService ?? app(TranslationService::class);
        
        // Use advanced cache for knowledge base
        $this->knowledgeBase = $this->advancedCache->remember('chatbot_knowledge_base', function () {
            return require storage_path('app/chatbot/knowledge.php');
        }, 300);
    }

    public function getKnowledgeBase(): array
    {
        return $this->knowledgeBase;
    }

    /**
     * Force reload knowledge base without cache
     */
    public function reloadKnowledgeBase(): array
    {
        // Clear all caches using advanced cache service
        $this->advancedCache->forget('chatbot_knowledge_base');
        $this->clearResponseCache();
        
        // Reload knowledge base
        $this->knowledgeBase = require storage_path('app/chatbot/knowledge.php');
        
        // Cache the new knowledge base
        $this->advancedCache->store('chatbot_knowledge_base', $this->knowledgeBase, 300);
        
        return $this->knowledgeBase;
    }

    /**
     * Clear all cached responses
     */
    public function clearResponseCache(): void
    {
        // Use advanced cache tag invalidation
        $this->advancedCache->invalidateTag('responses');
        
        // Also clear the knowledge base cache
        $this->advancedCache->forget('chatbot_knowledge_base');
    }

    public function search(string $message): ?string
    {
        $message = strtolower(trim($message));
        
        // Auto-detect language from message
        $detectedLanguage = $this->translationService->detectLanguage($message);
        $this->setLanguage($detectedLanguage);
        
        // Use advanced cache with tagging for responses
        $cacheKey = 'chatbot_response_' . md5($message . $this->language);
        return $this->advancedCache->rememberTagged($cacheKey, ['responses'], function () use ($message) {
            return $this->performSearch($message);
        }, 300);
    }

    /**
     * Set language for responses
     */
    public function setLanguage(string $language): void
    {
        $this->language = $language;
        $this->translationService->setLanguage($language);
    }

    /**
     * Get current language
     */
    public function getLanguage(): string
    {
        return $this->language;
    }
    
    private function performSearch(string $message): ?string
    {
        
        // Greeting patterns - most common, check first
        if (preg_match('/(halo|hai|hello|hi|selamat|pagi|siang|sore|malam|assalamualaikum|salam|hey|hallo)/i', $message)) {
            // Use translation service for greeting
            return $this->translationService->translate('chatbot.greeting');
        }

        // Company name - specific pattern (highest priority)
        if (preg_match('/nama/i', $message) && preg_match('/perusahaan/i', $message)) {
            return 'Nama perusahaan kami adalah ' . $this->knowledgeBase['company']['name'] . '.';
        }

        // Contact - expanded patterns (check before company info for location questions)
        if (preg_match('/(kontak|contact|hubungi|alamat|location|lokasi|dimana|di mana|kantor|office)/i', $message)) {
            // Specific location request
            if (preg_match('/(lokasi|location|alamat|kantor|office|dimana|di mana)/i', $message) &&
                !preg_match('/(kontak|contact|hubungi)/i', $message)) {
                return "Kantor Head Office kami berlokasi di Komplek Pergudangan & Industri Safe N Lock Blok V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. Kami juga memiliki cabang di Balikpapan, Kalimantan Timur di Jl. AMD Projakal Kariangau Km 5.5.";
            }

            $response = "Kantor Head Office kami berlokasi di Komplek Pergudangan & Industri Safe N Lock Blok V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. ";
            $response .= "Kami juga memiliki cabang di Balikpapan, Kalimantan Timur. ";
            $response .= "Untuk menghubungi Customer Service: " . $this->knowledgeBase['contact']['phone'] . ". ";
            $response .= "Email: " . $this->knowledgeBase['contact']['email'] . ". ";
            $response .= "Website: " . $this->knowledgeBase['contact']['social_media'] . ".";

            return $response;
        }

        // Company information - more specific patterns
        if (preg_match('/(perusahaan|tentang|profil|company|about|kenalan)/i', $message) &&
            !preg_match('/(nama|produk|layanan|visi|misi|lokasi|alamat|kantor)/i', $message)) {
            return "PT Surya Inti Gas adalah perusahaan distributor gas yang berdiri sejak tahun 2004. " .
                   "Saat ini perusahaan kami berdomisili di Komplek Pergudangan & Industri Safe N Lock Blok V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. " .
                   "Kami selaku distributor gas yang siap menyediakan dan melayani kebutuhan gas industri (gas & cair), gas campur (mixed gas), speciality gas, medical gas, serta tabung bertekanan tinggi, cryogenic equipment, dry ice dan peralatan-peralatan yang mendukung serta terkait produk tersebut. " .
                   "Kami berkomitmen untuk memenuhi kebutuhan gas industri dan medis dengan kualitas terjamin.";
        }

        // Vision - expanded
        if (preg_match('/(visi|vision|tujuan|cita-cita)/i', $message)) {
            return 'Visi kami: ' . $this->knowledgeBase['company']['vision'] . '. Misi kami: ' . $this->knowledgeBase['company']['mission'];
        }

        // Mission - expanded
        if (preg_match('/(misi|mission|tugas|fungsi)/i', $message)) {
            return 'Misi kami: ' . $this->knowledgeBase['company']['mission'] . '. Visi kami: ' . $this->knowledgeBase['company']['vision'];
        }

        // Values
        if (preg_match('/(nilai|value|prinsip|filosofi)/i', $message)) {
            return $this->knowledgeBase['company']['values'];
        }

        // History
        if (preg_match('/(sejarah|history|berdiri|didirikan|sejak)/i', $message)) {
            return $this->knowledgeBase['company']['history'];
        }

        // Services - more specific patterns
        if (preg_match('/(layanan|service|jasa|servis)/i', $message) &&
            !preg_match('/(produk|barang)/i', $message)) {
            $response = "Layanan kami meliputi penyediaan pasokan gas untuk kebutuhan industri dengan kualitas terjamin dan pengiriman tepat waktu. ";
            $response .= "Kami melayani lebih dari 150 pelanggan industri termasuk industri makanan minuman, rumah sakit, galangan kapal, farmasi, dan metal sheet. ";
            $response .= "Untuk kebutuhan rumah tangga dan medis, kami juga menyediakan layanan pasokan gas dengan kualitas terjamin. ";
            $response .= "Kami siap berdiskusi dengan Anda untuk mendukung kebutuhan produk gas, termasuk stok, jenis dan tipe produk, jadwal pengiriman, hingga maintenance. ";
            $response .= "Layanan lain yang tersedia meliputi pemeliharaan dan perbaikan instalasi gas, instalasi gas industri dan domestik dengan teknisi berpengalaman, ";
            $response .= "pengujian dan kalibrasi peralatan gas untuk memastikan standar keamanan, serta layanan respon darurat untuk kebocoran gas dan situasi krisis.";

            return $response;
        }

        // Products - expanded patterns (check before services)
        if (preg_match('/(produk|product|barang|item|jual)/i', $message)) {
            $response = "Produk kami meliputi berbagai jenis gas industri yaitu: " . $this->knowledgeBase['products']['gas_industri'] . ". ";
            $response .= $this->knowledgeBase['products']['gas_medis'] . " ";
            $response .= "Untuk peralatan, kami menyediakan " . $this->knowledgeBase['products']['peralatan_gas'] . ". ";
            $response .= "Kami juga memiliki " . $this->knowledgeBase['products']['dry_ice'] . ", ";
            $response .= "serta " . $this->knowledgeBase['products']['cryogenic_equipment'] . ". ";
            $response .= "Untuk tabung gas, tersedia " . $this->knowledgeBase['products']['tabung_gas'] . ".";
            
            return $response;
        }

        // Specific services
        if (preg_match('/(pasok|supply|kirim gas|gas industri|gas domestik)/i', $message)) {
            if (preg_match('/(industri|pabrik|factory)/i', $message)) {
                return $this->knowledgeBase['services']['supply_gas_industri'];
            }
            if (preg_match('/(domestik|rumah|household|keluarga)/i', $message)) {
                return $this->knowledgeBase['services']['supply_gas_domestik'];
            }
        }

        if (preg_match('/(konsultasi|consult|tanya|advice)/i', $message)) {
            return $this->knowledgeBase['services']['konsultasi_gas'];
        }

        if (preg_match('/(maintenance|perbaikan|servis|rawat)/i', $message)) {
            return $this->knowledgeBase['services']['maintenance'];
        }

        if (preg_match('/(instalasi|install|pasang)/i', $message)) {
            return $this->knowledgeBase['services']['instalasi'];
        }

        if (preg_match('/(testing|test|uji|kalibrasi|kalibrasi)/i', $message)) {
            return $this->knowledgeBase['services']['testing'];
        }

        if (preg_match('/(emergency|darurat|kebocoran|bocor|crisis)/i', $message)) {
            return $this->knowledgeBase['services']['emergency_response'];
        }

        // Specific products
        if (preg_match('/(oksigen|oxygen|nitrogen|argon|helium|co2)/i', $message)) {
            return $this->knowledgeBase['products']['gas_industri'];
        }

        if (preg_match('/(lpg|tabung|gas rumah|gas keluarga)/i', $message)) {
            return $this->knowledgeBase['products']['gas_domestik'];
        }

        if (preg_match('/(regulator|selang|peralatan|aksesoris)/i', $message)) {
            if (preg_match('/(regulator)/i', $message)) {
                return $this->knowledgeBase['products']['regulator'];
            }
            if (preg_match('/(selang)/i', $message)) {
                return $this->knowledgeBase['products']['selang_gas'];
            }
            return $this->knowledgeBase['products']['peralatan_gas'];
        }

        // Safety - expanded patterns
        if (preg_match('/(aman|safety|keamanan|sertifikasi|certification|standar)/i', $message)) {
            $response = $this->knowledgeBase['safety']['certifications'] . ' ' . 
                       $this->knowledgeBase['safety']['quality_control'] . ' ' .
                       $this->knowledgeBase['safety']['emergency'];
            if (preg_match('/(tips|cara|petunjuk|panduan)/i', $message)) {
                $response .= ' ' . $this->knowledgeBase['safety']['safety_tips'];
            }
            if (preg_match('/(inspeksi|pemeriksaan|cek)/i', $message)) {
                $response .= ' ' . $this->knowledgeBase['safety']['inspection'];
            }
            return $response;
        }

        // FAQ - expanded patterns
        if (preg_match('/(pesan|order|beli|buy|cara pesan|bagaimana pesan|how to order)/i', $message)) {
            return $this->knowledgeBase['faq']['cara_pesan'];
        }

        if (preg_match('/(bayar|payment|pembayaran|transfer|kartu|tunai)/i', $message)) {
            return $this->knowledgeBase['faq']['metode_pembayaran'];
        }

        if (preg_match('/(kirim|delivery|pengiriman|antar|dikirim|estimasi|lama)/i', $message)) {
            return $this->knowledgeBase['faq']['pengiriman'];
        }

        if (preg_match('/(garansi|warranty|jaminan)/i', $message)) {
            return $this->knowledgeBase['faq']['garansi'];
        }

        // Pricing - new section
        if (preg_match('/(harga|price|biaya|cost|mahal|murah|quotation|quote)/i', $message)) {
            if (preg_match('/(industri|pabrik)/i', $message)) {
                return $this->knowledgeBase['pricing']['industrial_gas'];
            }
            if (preg_match('/(domestik|rumah|keluarga)/i', $message)) {
                return $this->knowledgeBase['pricing']['domestic_gas'];
            }
            if (preg_match('/(bulk order|borongan)/i', $message)) {
                return $this->knowledgeBase['pricing']['bulk_order'];
            }
            return $this->knowledgeBase['faq']['harga'];
        }

        return null;
    }
    
    public function getKnowledgeBaseService(): KnowledgeBaseService
    {
        return $this;
    }

    /**
     * Enhance message with intent context for better AI responses
     */
    private function enhanceMessageWithIntent(string $message, string $intent, array $entities): string
    {
        if ($intent === 'unknown' || empty($entities)) {
            return $message;
        }

        $context = "User intent: {$intent}. ";
        
        if (!empty($entities)) {
            $context .= "Detected entities: " . json_encode($entities) . ". ";
        }

        return $context . "User message: " . $message;
    }

    private function formatHistory(array $history): array
    {
        $formatted = [];
        
        foreach ($history as $item) {
            $formatted[] = [
                'role' => $item['role'] ?? 'user',
                'content' => $item['content'] ?? '',
            ];
        }

        // Limit history to last 10 messages to avoid context overflow
        return array_slice($formatted, -10);
    }
}
