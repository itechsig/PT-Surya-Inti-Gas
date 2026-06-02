<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatbotController;

// main route
Route::get('/', function () {
    return view('welcome');
});

// API routes for frontend
Route::get('/api/hero', function () {
    return response()->json([
        'title' => 'Konstruksi Kokoh, Hasil Terpercaya',
        'subtitle' => 'Membangun Masa Depan Indonesia'
    ]);
});

Route::get('/api/about', function () {
    return response()->json([
        'title' => 'Tentang Kami',
        'description' => 'PT Konstruksi Mandiri - Mitra strategis dalam infrastruktur berkualitas'
    ]);
});

Route::get('/api/services', function () {
    return response()->json([
        'title' => 'Layanan Kami',
        'services' => ['Konstruksi Gedung', 'Infrastruktur', 'Renovasi & Maintenance']
    ]);
});

Route::get('/api/portfolio', function () {
    return response()->json([
        'title' => 'Portofolio Proyek',
        'description' => 'Proyek-proyek terbaik kami'
    ]);
});

Route::get('/api/team', function () {
    return response()->json([
        'title' => 'Tim Kami',
        'description' => 'Pakar dibalik kesuksesan kami'
    ]);
});

Route::get('/api/contact', function () {
    return response()->json([
        'title' => 'Kontak Kami',
        'description' => 'Hubungi PT Konstruksi Mandiri'
    ]);
});

Route::post('/api/contact', [App\Http\Controllers\Api\ContactController::class, 'store']);


Route::post('/api/chatbot', function (Illuminate\Http\Request $request) {
    try {
        $validated = $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $message = strtolower(trim($request->message));
        $response = generateChatbotResponse($message);

        return response()->json([
            'success' => true,
            'data' => [
                'message' => $response,
                'timestamp' => now()->toISOString(),
            ],
            'message' => 'Response generated successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to generate response',
            'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
        ], 500);
    }
});
Route::post('/api/chat/stream', [ChatbotController::class, 'chatStream']);

if (!function_exists('generateChatbotResponse')) {
    function generateChatbotResponse(string $message): string {
    // Enhanced knowledge base with fuzzy matching keywords
    $qaDatabase = [
        [
            'keywords' => ['halo', 'hai', 'hello', 'hi', 'selamat', 'pagi', 'siang', 'sore', 'malam'],
            'answer' => 'Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu?',
            'category' => 'greeting',
            'priority' => 1
        ],
        [
            'keywords' => ['perusahaan', 'tentang', 'profil', 'company', 'about', 'siapa', 'apa itu', 'surya inti gas'],
            'answer' => 'PT Surya Inti Gas adalah perusahaan yang bergerak di bidang energi dan gas, menyediakan solusi terpercaya untuk kebutuhan gas industri dan domestik. Visi kami adalah menjadi perusahaan energi dan gas terdepan yang inovatif dan berkelanjutan di Indonesia.',
            'category' => 'company',
            'priority' => 2
        ],
        [
            'keywords' => ['visi', 'vision'],
            'answer' => 'Visi kami: Menjadi perusahaan energi dan gas terdepan yang inovatif dan berkelanjutan di Indonesia.',
            'category' => 'company',
            'priority' => 3
        ],
        [
            'keywords' => ['misi', 'mission'],
            'answer' => 'Misi kami: Menyediakan produk dan layanan gas berkualitas tinggi dengan standar keamanan terbaik untuk kepuasan pelanggan.',
            'category' => 'company',
            'priority' => 3
        ],
        [
            'keywords' => ['layanan', 'service', 'jasa', 'servis'],
            'phrases' => ['apa layanan', 'layanan apa', 'layanan perusahaan', 'apa layanan perusahaan'],
            'answer' => 'Layanan kami meliputi: pasokan gas industri dengan kualitas terjamin, pasokan gas domestik dengan harga kompetitif, layanan konsultasi gas, dan layanan pemeliharaan instalasi gas.',
            'category' => 'services',
            'priority' => 1
        ],
        [
            'keywords' => ['produk', 'product', 'barang', 'item', 'jual'],
            'phrases' => ['apa produk', 'produk apa', 'produk perusahaan', 'apa produk perusahaan'],
            'answer' => 'Produk kami meliputi: berbagai jenis gas industri (oksigen, nitrogen, argon), gas LPG untuk kebutuhan rumah tangga, dan peralatan gas berkualitas tinggi.',
            'category' => 'products',
            'priority' => 1
        ],
        [
            'keywords' => ['kontak', 'contact', 'hubungi', 'alamat', 'location', 'lokasi', 'dimana'],
            'phrases' => ['dimana alamat', 'alamat mana', 'lokasi perusahaan'],
            'answer' => 'Kami berlokasi di Indonesia dengan jaringan distribusi yang luas. Tim customer service kami siap membantu Anda. Kami beroperasi Senin - Jumat, jam 08:00 - 17:00 WIB.',
            'category' => 'contact',
            'priority' => 1
        ],
        [
            'keywords' => ['aman', 'safety', 'keamanan', 'sertifikasi', 'certification', 'standar'],
            'answer' => 'Kami memiliki berbagai sertifikasi standar keamanan internasional untuk memastikan kualitas dan keamanan produk kami. Sistem quality control yang ketat diterapkan pada setiap tahap produksi dan distribusi. Layanan darurat tersedia 24/7.',
            'category' => 'safety',
            'priority' => 1
        ],
        [
            'keywords' => ['pesan', 'order', 'beli', 'buy'],
            'phrases' => ['cara pesan', 'bagaimana pesan', 'how to order'],
            'answer' => 'Anda dapat memesan produk kami melalui website, telepon, atau datang langsung ke kantor kami.',
            'category' => 'faq',
            'priority' => 1
        ],
        [
            'keywords' => ['bayar', 'payment', 'pembayaran'],
            'phrases' => ['metode bayar', 'cara bayar', 'cara pembayaran'],
            'answer' => 'Kami menerima berbagai metode pembayaran termasuk transfer bank, kartu kredit, dan tunai.',
            'category' => 'faq',
            'priority' => 1
        ],
        [
            'keywords' => ['kirim', 'delivery', 'pengiriman', 'antar'],
            'phrases' => ['lama kirim', 'estimasi', 'berapa lama'],
            'answer' => 'Layanan pengiriman kami mencakup area yang luas dengan estimasi waktu sesuai lokasi Anda.',
            'category' => 'faq',
            'priority' => 1
        ],
        [
            'keywords' => ['garansi', 'warranty', 'jaminan'],
            'answer' => 'Kami memberikan garansi untuk produk dan layanan kami sesuai dengan ketentuan yang berlaku.',
            'category' => 'faq',
            'priority' => 1
        ],
        [
            'keywords' => ['tim', 'team', 'karyawan', 'staff', 'pegawai', 'orang'],
            'answer' => 'Tim kami terdiri dari profesional berpengalaman di industri gas. Anda dapat melihat profil tim kami di halaman Team website kami.',
            'category' => 'team',
            'priority' => 1
        ],
        [
            'keywords' => ['proyek', 'project', 'portfolio', 'kerja'],
            'answer' => 'Kami telah menyelesaikan berbagai proyek sukses di berbagai sektor industri. Anda dapat melihat portfolio proyek kami di halaman Portfolio website kami.',
            'category' => 'projects',
            'priority' => 1
        ],
        [
            'keywords' => ['sertifikat', 'certificate', 'dokumen'],
            'answer' => 'Kami memiliki berbagai sertifikasi standar keamanan dan kualitas internasional. Detail sertifikasi dapat dilihat di halaman Certifications website kami.',
            'category' => 'certifications',
            'priority' => 1
        ],
        [
            'keywords' => ['terima kasih', 'thanks', 'makasih', 'thank you'],
            'answer' => 'Sama-sama! Senang bisa membantu Anda. Ada yang lain bisa saya bantu?',
            'category' => 'closing',
            'priority' => 1
        ],
        [
            'keywords' => ['sampai jumpa', 'bye', 'goodbye', 'selamat tinggal', 'dadah'],
            'answer' => 'Sampai jumpa! Terima kasih telah menghubungi PT Surya Inti Gas. Semoga hari Anda menyenangkan!',
            'category' => 'closing',
            'priority' => 1
        ],
    ];

    // Filler words to ignore
    $fillerWords = ['ini', 'itu', 'yang', 'dan', 'atau', 'untuk', 'dari', 'ke', 'di', 'pada', 'dengan', 'adalah', 'apa', 'bagaimana', 'bagaimanakah', 'kenapa', 'mengapa', 'kapan', 'dimana', 'siapa'];

    $messageLower = strtolower(trim($message));

    // First, check for exact phrase matches (highest priority)
    foreach ($qaDatabase as $qa) {
        if (isset($qa['phrases'])) {
            foreach ($qa['phrases'] as $phrase) {
                if (strpos($messageLower, $phrase) !== false) {
                    return $qa['answer'];
                }
            }
        }
    }

    // Fuzzy matching function using Levenshtein distance
    function fuzzyMatch(string $input, array $keywords): float {
        $input = strtolower(trim($input));
        $bestScore = 0;

        foreach ($keywords as $keyword) {
            $keyword = strtolower(trim($keyword));
            
            // Exact match
            if ($input === $keyword) {
                return 1.0;
            }
            
            // Contains match (input contains keyword)
            if (strpos($input, $keyword) !== false) {
                return 0.95;
            }
            
            // Levenshtein distance for similar words
            $distance = levenshtein($input, $keyword);
            $maxLength = max(strlen($input), strlen($keyword));
            
            if ($maxLength > 0) {
                $similarity = 1 - ($distance / $maxLength);
                if ($similarity > $bestScore) {
                    $bestScore = $similarity;
                }
            }
        }
        
        return $bestScore;
    }

    // Find best matching answer using keywords
    $bestMatch = null;
    $bestScore = 0;
    $threshold = 0.5;

    // Split message into words for better matching
    $words = preg_split('/\s+/', $messageLower);
    
    foreach ($qaDatabase as $qa) {
        $totalScore = 0;
        $matchedWords = 0;
        $priority = $qa['priority'] ?? 1;
        
        foreach ($words as $word) {
            // Skip filler words and very short words
            if (strlen($word) <= 2 || in_array($word, $fillerWords)) {
                continue;
            }
            
            $score = fuzzyMatch($word, $qa['keywords']);
            if ($score > $threshold) {
                $totalScore += $score;
                $matchedWords++;
            }
        }
        
        // Calculate average score for matched words
        if ($matchedWords > 0) {
            $avgScore = $totalScore / $matchedWords;
            
            // Boost score based on priority and number of matched words
            $boost = min($matchedWords * 0.15, 0.4) + ($priority * 0.05);
            $finalScore = $avgScore + $boost;
            
            if ($finalScore > $bestScore) {
                $bestScore = $finalScore;
                $bestMatch = $qa;
            }
        }
    }

    // Return best match if found
    if ($bestMatch && $bestScore >= $threshold) {
        return $bestMatch['answer'];
    }

    // Default responses
    $defaults = [
        'Maaf, saya tidak yakin dengan pertanyaan tersebut. Anda bisa bertanya tentang layanan, produk, kontak, atau informasi perusahaan kami.',
        'Maaf pertanyaan anda diluar konteks kami. Coba tanyakan tentang layanan, produk, atau informasi perusahaan PT Surya Inti Gas.',
        'Mohon maaf, saya belum mengerti pertanyaan tersebut. Silakan tanyakan hal lain seputar perusahaan kami.',
    ];
    return $defaults[array_rand($defaults)];
    }
}

// Catch-all route to handle frontend routing (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
