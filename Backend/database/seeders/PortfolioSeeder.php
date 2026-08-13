<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Industry;
use App\Models\ServiceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PortfolioSeeder extends Seeder
{
    /**
     * Seed the portfolio data with sample projects
     */
    public function run(): void
    {
        if (Portfolio::count() > 0) {
            return;
        }

        $portfolios = [
            [
                'slug' => 'hospital-oxygen-supply',
                'title_id' => 'Suplai Oksigen Rumah Sakit',
                'title_en' => 'Hospital Oxygen Supply',
                'title_zh' => '医院氧气供应',
                'summary_id' => 'Instalasi sistem suplai oksigen medis untuk rumah sakit terkemuka di Jawa Timur dengan standar internasional.',
                'summary_en' => 'Medical oxygen supply system installation for leading hospitals in East Java with international standards.',
                'summary_zh' => '为东爪哇顶级医院安装医用氧气供应系统，符合国际标准。',
                'product_solution_id' => 'Oksigen Medis & Instalasi',
                'product_solution_en' => 'Medical Oxygen & Installation',
                'product_solution_zh' => '医用氧气与安装',
                'location_id' => 'Surabaya, Jawa Timur',
                'location_en' => 'Surabaya, East Java',
                'location_zh' => '东爪哇省泗水',
                'completion_date' => '2026-06-01',
                'is_featured' => true,
                'gallery' => [
                    ['image' => '/images/products/Oxygen_Fix.webp', 'caption_id' => 'Instalasi tabung oksigen', 'caption_en' => 'Oxygen cylinder installation', 'caption_zh' => '氧气瓶安装'],
                    ['image' => '/images/office/office_view2.webp', 'caption_id' => 'Sistem distribusi', 'caption_en' => 'Distribution system', 'caption_zh' => '配送系统'],
                ]
            ],
            [
                'slug' => 'manufacturing-nitrogen',
                'title_id' => 'Suplai Nitrogen Manufaktur',
                'title_en' => 'Manufacturing Nitrogen Supply',
                'title_zh' => '制造业氮气供应',
                'summary_id' => 'Pasokan nitrogen berkualitas tinggi untuk industri manufaktur otomotif di Indonesia dengan sistem distribusi terintegrasi.',
                'summary_en' => 'High-quality nitrogen supply for automotive manufacturing industry in Indonesia with integrated distribution system.',
                'summary_zh' => '为印尼汽车制造业提供高质量氮气供应，配备集成配送系统。',
                'product_solution_id' => 'Nitrogen & Layanan Distribusi',
                'product_solution_en' => 'Nitrogen & Distribution Services',
                'product_solution_zh' => '氮气与配送服务',
                'location_id' => 'Karawang, Jawa Barat',
                'location_en' => 'Karawang, West Java',
                'location_zh' => '西爪哇省卡拉旺',
                'completion_date' => '2026-05-01',
                'is_featured' => true,
                'gallery' => [
                    ['image' => '/images/products/Nitrogen_Fix.webp', 'caption_id' => 'Storage tank nitrogen', 'caption_en' => 'Nitrogen storage tank', 'caption_zh' => '氮气储罐'],
                ]
            ],
            [
                'slug' => 'food-grade-co2',
                'title_id' => 'CO2 Food Grade Minuman',
                'title_en' => 'Food Grade CO2 for Beverages',
                'title_zh' => '饮料用食品级二氧化碳',
                'summary_id' => 'Suplai CO2 food grade untuk industri minuman berskala besar dengan sertifikasi halal dan internasional.',
                'summary_en' => 'Food grade CO2 supply for large-scale beverage industry with halal and international certifications.',
                'summary_zh' => '为大型饮料行业提供食品级二氧化碳供应，拥有清真和国际认证。',
                'product_solution_id' => 'CO2 Food Grade & Layanan',
                'product_solution_en' => 'Food Grade CO2 & Services',
                'product_solution_zh' => '食品级二氧化碳与服务',
                'location_id' => 'Tangerang, Banten',
                'location_en' => 'Tangerang, Banten',
                'location_zh' => '万丹省丹格朗',
                'completion_date' => '2026-04-01',
                'is_featured' => false,
                'gallery' => [
                    ['image' => '/images/products/CO2_Fix.webp', 'caption_id' => 'Sistem CO2 industri', 'caption_en' => 'Industrial CO2 system', 'caption_zh' => '工业二氧化碳系统'],
                ]
            ],
            [
                'slug' => 'welding-argon-supply',
                'title_id' => 'Suplai Argon Pengelasan',
                'title_en' => 'Welding Argon Supply',
                'title_zh' => '焊接氩气供应',
                'summary_id' => 'Pasokan argon berkualitas tinggi untuk industri pengelasan dan fabrikasi logam dengan konsistensi terjamin.',
                'summary_en' => 'High-quality argon supply for welding and metal fabrication industries with guaranteed consistency.',
                'summary_zh' => '为焊接和金属加工行业提供高质量氩气供应，保证一致性。',
                'product_solution_id' => 'Argon & Layanan',
                'product_solution_en' => 'Argon & Services',
                'product_solution_zh' => '氩气与服务',
                'location_id' => 'Sidoarjo, Jawa Timur',
                'location_en' => 'Sidoarjo, East Java',
                'location_zh' => '东爪哇省锡多阿尔霍',
                'completion_date' => '2026-03-01',
                'is_featured' => true,
                'gallery' => [
                    ['image' => '/images/products/Argon_Fix.webp', 'caption_id' => 'Area pengelasan', 'caption_en' => 'Welding area', 'caption_zh' => '焊接区域'],
                ]
            ],
        ];

        $publicDir = base_path('../Frontend/public');

        foreach ($portfolios as $index => $portfolioData) {
            $gallery = $portfolioData['gallery'];
            unset($portfolioData['gallery']);

            // Handle thumbnail image
            if (!empty($gallery)) {
                $firstImage = $gallery[0]['image'];
                if (!str_starts_with($firstImage, 'http')) {
                    $sourcePath = $publicDir . $firstImage;
                    $storedPath = 'portfolio/' . $portfolioData['slug'] . '-thumbnail-' . basename($firstImage);
                    if (file_exists($sourcePath)) {
                        Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
                        $portfolioData['thumbnail'] = $storedPath;
                    } else {
                        $portfolioData['thumbnail'] = $firstImage;
                    }
                } else {
                    $portfolioData['thumbnail'] = $firstImage;
                }
            }

            // Get random industry and service type
            $industry = Industry::inRandomOrder()->first();
            $serviceType = ServiceType::inRandomOrder()->first();

            // Skip if industry or service type doesn't exist
            if (!$industry || !$serviceType) {
                continue;
            }

            $portfolioData['industry_id'] = $industry->id;
            $portfolioData['service_type_id'] = $serviceType->id;
            $portfolioData['display_order'] = $index;

            $portfolio = Portfolio::create($portfolioData);

            // Create gallery images
            foreach ($gallery as $galleryIndex => $galleryItem) {
                $imagePath = $galleryItem['image'];
                if (!str_starts_with($imagePath, 'http')) {
                    $sourcePath = $publicDir . $imagePath;
                    $storedPath = 'portfolio/' . $portfolio->slug . '-gallery-' . $galleryIndex . '-' . basename($imagePath);
                    if (file_exists($sourcePath)) {
                        Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
                        $imagePath = $storedPath;
                    }
                }

                PortfolioImage::create([
                    'portfolio_id' => $portfolio->id,
                    'image' => $imagePath,
                    'caption' => $galleryItem['caption_id'] ?? null,
                    'display_order' => $galleryIndex,
                ]);
            }
        }
    }
}
