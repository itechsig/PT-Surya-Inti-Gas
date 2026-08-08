<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class HeroSlideSeeder extends Seeder
{
    /**
     * Mirrors the 5 slides that used to live in the frontend's static
     * src/app/components/hero/slides.ts + locale JSON files, so switching
     * the public site to the API causes no visual regression.
     */
    public function run(): void
    {
        if (HeroSlide::count() > 0) {
            return;
        }

        $slides = [
            [
                'source_image' => '20260618_134247.webp',
                'cta_path' => 'produk',
                'title_id' => 'PT Surya Inti Gas', 'title_en' => 'PT Surya Inti Gas', 'title_zh' => 'PT Surya Inti Gas',
                'subtitle_id' => 'Pemasok Gas Industri Terpercaya', 'subtitle_en' => 'Trusted Industrial Gas Supplier', 'subtitle_zh' => '值得信赖的工业气体供应商',
                'description_id' => 'Menyediakan gas industri berkualitas tinggi untuk manufaktur, kesehatan, pengolahan makanan, pengelasan, laboratorium, dan berbagai industri lainnya dengan distribusi yang andal serta layanan yang unggul.',
                'description_en' => 'Providing high-quality industrial gases for manufacturing, healthcare, food processing, welding, laboratories, and many other industries with reliable distribution and excellent service.',
                'description_zh' => '为制造业、医疗保健、食品加工、焊接、实验室及众多其他行业提供高质量工业气体，并保证可靠的配送与优质的服务。',
            ],
            [
                'source_image' => 'Oxygen_Fix.webp',
                'cta_path' => 'produk/detail?id=oxygen',
                'title_id' => 'Oksigen (O₂)', 'title_en' => 'Oxygen (O₂)', 'title_zh' => '氧气 (O₂)',
                'subtitle_id' => 'Oksigen Kemurnian Tinggi', 'subtitle_en' => 'High Purity Oxygen', 'subtitle_zh' => '高纯度氧气',
                'description_id' => 'Mendukung rumah sakit, laboratorium, fabrikasi logam, pengelasan, dan proses manufaktur industri dengan kemurnian tinggi serta kualitas yang konsisten.',
                'description_en' => 'Supports hospitals, laboratories, metal fabrication, welding, and industrial manufacturing processes with high purity and consistent quality.',
                'description_zh' => '以高纯度和稳定的品质支持医院、实验室、金属加工、焊接及工业制造流程。',
            ],
            [
                'source_image' => 'Nitrogen_Fix.webp',
                'cta_path' => 'produk/detail?id=nitrogen',
                'title_id' => 'Nitrogen (N₂)', 'title_en' => 'Nitrogen (N₂)', 'title_zh' => '氮气 (N₂)',
                'subtitle_id' => 'Pasokan Nitrogen yang Andal', 'subtitle_en' => 'Reliable Nitrogen Supply', 'subtitle_zh' => '可靠的氮气供应',
                'description_id' => 'Ideal untuk pengawetan makanan, elektronik, laboratorium, farmasi, dan produksi industri yang membutuhkan gas nitrogen yang stabil.',
                'description_en' => 'Ideal for food preservation, electronics, laboratories, pharmaceuticals, and industrial production requiring stable nitrogen gas.',
                'description_zh' => '适用于食品保鲜、电子、实验室、制药以及需要稳定氮气的工业生产。',
            ],
            [
                'source_image' => 'Storage_Tank_Gas.webp',
                'cta_path' => 'produk',
                'title_id' => 'Karbon Dioksida (CO₂)', 'title_en' => 'Carbon Dioxide (CO₂)', 'title_zh' => '二氧化碳 (CO₂)',
                'subtitle_id' => 'Food Grade & Industri', 'subtitle_en' => 'Food Grade & Industrial', 'subtitle_zh' => '食品级与工业级',
                'description_id' => 'Cocok untuk industri minuman, pengolahan makanan, sistem pemadam kebakaran, pengelasan, dan berbagai aplikasi industri.',
                'description_en' => 'Suitable for beverage industries, food processing, fire suppression systems, welding, and industrial applications.',
                'description_zh' => '适用于饮料行业、食品加工、消防系统、焊接及工业应用。',
            ],
            [
                'source_image' => 'Argon_Fix.webp',
                'cta_path' => 'produk/detail?id=argon',
                'title_id' => 'Argon & Gas Khusus', 'title_en' => 'Argon & Specialty Gas', 'title_zh' => '氩气与特种气体',
                'subtitle_id' => 'Solusi Gas Presisi', 'subtitle_en' => 'Precision Gas Solution', 'subtitle_zh' => '精密气体解决方案',
                'description_id' => 'Menyediakan Argon dan gas khusus untuk pengelasan, laboratorium, manufaktur semikonduktor, kalibrasi, dan industri presisi.',
                'description_en' => 'Providing Argon and specialty gases for welding, laboratories, semiconductor manufacturing, calibration, and precision industries.',
                'description_zh' => '为焊接、实验室、半导体制造、校准及精密行业提供氩气与特种气体。',
            ],
        ];

        $sourceDir = base_path('../Frontend/public/images/products');

        foreach ($slides as $index => $slide) {
            $sourcePath = $sourceDir . '/' . $slide['source_image'];
            $storedPath = 'hero-slides/' . $slide['source_image'];

            if (file_exists($sourcePath)) {
                Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
            }

            unset($slide['source_image']);
            $slide['image'] = $storedPath;
            $slide['display_order'] = $index;
            $slide['duration_ms'] = 5000;
            $slide['is_active'] = true;

            HeroSlide::create($slide);
        }
    }
}
