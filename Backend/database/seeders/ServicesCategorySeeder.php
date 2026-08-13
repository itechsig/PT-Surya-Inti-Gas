<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ServicesCategorySeeder extends Seeder
{
    /**
     * Restores the "Engineering Services" product tab (installation, delivery,
     * refilling) that existed in the original static site. Idempotent so it can
     * be run safely against an already-seeded database (local or production).
     */
    public function run(): void
    {
        if (ProductCategory::where('main_category', 'services')->exists()) {
            return;
        }

        $category = ProductCategory::create([
            'main_category' => 'services',
            'slug' => 'services',
            'name_id' => 'Layanan',
            'name_en' => 'Services',
            'name_zh' => '服务',
            'display_order' => 0,
        ]);

        $items = [
            [
                'id' => 'installation',
                'image' => 'Installation.webp',
                'name_id' => 'Instalasi',
                'name_en' => 'Installation',
                'name_zh' => '安装',
                'description_id' => 'Layanan instalasi sistem gas industri',
                'description_en' => 'Industrial gas system installation service',
                'description_zh' => '工业气体系统安装服务',
                'full_description_id' => 'Layanan instalasi sistem gas industri mencakup perencanaan, instalasi, dan commissioning sistem gas untuk fasilitas industri dan medis. Tim teknisi kami berpengalaman dalam memasang pipeline, manifold, regulator, dan sistem keamanan gas. Kami memastikan instalasi sesuai standar keamanan internasional dan kebutuhan operasional spesifik pelanggan. PT Surya Inti Gas menyediakan layanan instalasi dengan jaminan kualitas dan dukungan teknis.',
                'full_description_en' => 'Industrial gas system installation service includes planning, installation, and commissioning of gas systems for industrial and medical facilities. Our experienced technicians install pipelines, manifolds, regulators, and gas safety systems. We ensure installation meets international safety standards and the specific operational needs of customers. PT Surya Inti Gas provides installation services with quality assurance and technical support.',
                'full_description_zh' => '工业气体系统安装服务包括为工业和医疗设施进行气体系统的规划、安装和调试。我们经验丰富的技术人员安装管道、集气管、调节器和气体安全系统。我们确保安装符合国际安全标准和客户的具体运营需求。PT Surya Inti Gas提供具有质量保证和技术支持的安装服务。',
            ],
            [
                'id' => 'delivery',
                'image' => 'Delivery.webp',
                'name_id' => 'Pengiriman',
                'name_en' => 'Delivery',
                'name_zh' => '配送',
                'description_id' => 'Layanan pengiriman gas ke lokasi pelanggan',
                'description_en' => 'Gas delivery service to customer locations',
                'description_zh' => '将气体配送至客户地点的服务',
                'full_description_id' => 'Layanan pengiriman gas kami mencakup distribusi tabung gas, bulk liquid gas, dan cryogenic tank ke lokasi pelanggan di seluruh Indonesia. Armada kami dilengkapi dengan sistem keamanan dan monitoring untuk memastikan pengiriman yang aman dan tepat waktu. Kami menyediakan jadwal pengiriman yang dapat disesuaikan dengan kebutuhan operasional pelanggan. PT Surya Inti Gas menjamin pengiriman yang efisien dan andal.',
                'full_description_en' => 'Our gas delivery service includes distribution of gas cylinders, bulk liquid gas, and cryogenic tanks to customer locations throughout Indonesia. Our fleet is equipped with safety systems and monitoring to ensure safe and timely delivery. We provide delivery schedules that can be customized to customer operational needs. PT Surya Inti Gas guarantees efficient and reliable delivery.',
                'full_description_zh' => '我们的气体配送服务包括将气瓶、散装液态气体和低温罐配送至印度尼西亚各地的客户地点。我们的车队配备安全系统和监控，确保安全及时的配送。我们提供可根据客户运营需求定制的配送时间表。PT Surya Inti Gas保证高效可靠的配送。',
            ],
            [
                'id' => 'refilling',
                'image' => 'Refilling.webp',
                'name_id' => 'Pengisian',
                'name_en' => 'Refilling',
                'name_zh' => '充装',
                'description_id' => 'Layanan pengisian ulang tabung dan tangki gas',
                'description_en' => 'Cylinder and tank gas refilling service',
                'description_zh' => '气瓶和储罐气体充装服务',
                'full_description_id' => 'Layanan pengisian ulang gas mencakup refill tabung gas industri dan medis, serta pengisian bulk liquid tank dan cryogenic vessel. Fasilitas pengisian kami dilengkapi dengan peralatan modern dan sistem kualitas kontrol untuk memastikan kemurnian dan keamanan gas. Kami menyediakan layanan pengisian on-site dan exchange system untuk efisiensi operasional. PT Surya Inti Gas menjamin kualitas gas yang konsisten untuk setiap pengisian.',
                'full_description_en' => 'Gas refilling service includes refill of industrial and medical gas cylinders, as well as filling of bulk liquid tanks and cryogenic vessels. Our refilling facilities are equipped with modern equipment and quality control systems to ensure gas purity and safety. We provide on-site refilling and exchange systems for operational efficiency. PT Surya Inti Gas guarantees consistent gas quality for every refill.',
                'full_description_zh' => '气体充装服务包括工业和医用气瓶的充装，以及散装液态罐和低温容器的充装。我们的充装设施配备现代设备和质量控制系统，确保气体纯度和安全。我们提供现场充装和交换系统，提高运营效率。PT Surya Inti Gas保证每次充装的气体质量一致。',
            ],
            [
                'id' => 'testing',
                'image' => 'Testing.webp',
                'name_id' => 'Testing dan Kalibrasi',
                'name_en' => 'Testing and Calibration',
                'name_zh' => '测试和校准',
                'description_id' => 'Layanan testing dan kalibrasi peralatan gas',
                'description_en' => 'Gas equipment testing and calibration service',
                'description_zh' => '气体设备测试和校准服务',
                'full_description_id' => 'Layanan testing dan kalibrasi peralatan gas mencakup pemeriksaan regulator, valve, dan sistem pengukur gas untuk memastikan akurasi dan keamanan operasional. Kami menyediakan layanan kalibrasi sesuai standar internasional dan sertifikasi yang diperlukan. PT Surya Inti Gas menjamin keandalan peralatan gas Anda dengan layanan testing berkala.',
                'full_description_en' => 'Gas equipment testing and calibration service includes inspection of regulators, valves, and gas measurement systems to ensure operational accuracy and safety. We provide calibration services according to international standards and required certifications. PT Surya Inti Gas guarantees the reliability of your gas equipment with regular testing services.',
                'full_description_zh' => '气体设备测试和校准服务包括检查调节器、阀门和气体测量系统，以确保操作准确性和安全性。我们提供符合国际标准和所需认证的校准服务。PT Surya Inti Gas通过定期测试服务保证气体设备的可靠性。',
            ],
            [
                'id' => 'maintenance',
                'image' => 'Maintenance.webp',
                'name_id' => 'Maintenance',
                'name_en' => 'Maintenance',
                'name_zh' => '维护',
                'description_id' => 'Layanan maintenance sistem gas',
                'description_en' => 'Gas system maintenance service',
                'description_zh' => '气体系统维护服务',
                'full_description_id' => 'Layanan maintenance sistem gas mencakup perawatan berkala sistem distribusi gas, pipeline, dan peralatan terkait untuk mencegah kerusakan dan memastikan operasi yang optimal. Tim teknisi kami melakukan inspeksi menyeluruh dan perbaikan yang diperlukan. PT Surya Inti Gas menyediakan program maintenance preventif untuk meminimalkan downtime.',
                'full_description_en' => 'Gas system maintenance service includes regular care of gas distribution systems, pipelines, and related equipment to prevent damage and ensure optimal operation. Our technicians perform thorough inspections and necessary repairs. PT Surya Inti Gas provides preventive maintenance programs to minimize downtime.',
                'full_description_zh' => '气体系统维护服务包括对气体分配系统、管道和相关设备的定期护理，以防止损坏并确保最佳运行。我们的技术人员进行全面检查和必要的维修。PT Surya Inti Gas提供预防性维护计划以尽量减少停机时间。',
            ],
        ];

        $imagesDir = base_path('../Frontend/public/images/services');

        // Create a simple fallback image for new services
        $fallbackImage = 'Installation.webp';

        foreach ($items as $index => $item) {
            $sourcePath = $imagesDir . '/' . $item['image'];
            $storedPath = 'products/' . $item['id'] . '-' . $item['image'];

            // Use fallback image if the specific image doesn't exist
            if (!file_exists($sourcePath)) {
                $sourcePath = $imagesDir . '/' . $fallbackImage;
                $storedPath = 'products/' . $item['id'] . '-' . $fallbackImage;
            }

            if (file_exists($sourcePath)) {
                Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
            }

            Product::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'product_category_id' => $category->id,
                    'name_id' => $item['name_id'],
                    'name_en' => $item['name_en'],
                    'name_zh' => $item['name_zh'],
                    'description_id' => $item['description_id'],
                    'description_en' => $item['description_en'],
                    'description_zh' => $item['description_zh'],
                    'full_description_id' => $item['full_description_id'],
                    'full_description_en' => $item['full_description_en'],
                    'full_description_zh' => $item['full_description_zh'],
                    'image' => $storedPath,
                    'display_order' => $index,
                    'is_featured' => false,
                    'is_published' => true,
                ]
            );
        }
    }
}
