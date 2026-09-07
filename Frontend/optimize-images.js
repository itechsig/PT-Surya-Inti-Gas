import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Images to optimize with target dimensions
const imagesToOptimize = [
  {
    input: 'public/office.jpg',
    output: 'public/office-optimized.jpg',
    width: 1920,  // Reasonable max width
    quality: 80
  },
  {
    input: 'public/images/products/Hidrogen.webp',
    output: 'public/images/products/Hidrogen-optimized.webp',
    width: 800,   // Display size is ~631px
    quality: 75
  },
  {
    input: 'public/images/products/Oxygen.webp',
    output: 'public/images/products/Oxygen-optimized.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'public/images/products/Helium.webp',
    output: 'public/images/products/Helium-optimized.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'public/images/products/Argon.webp',
    output: 'public/images/products/Argon-optimized.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'public/images/products/Acetylene.webp',
    output: 'public/images/products/Acetylene-optimized.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'public/images/products/Nitrogen.webp',
    output: 'public/images/products/Nitrogen-optimized.webp',
    width: 800,
    quality: 75
  }
];

// Oversized source images that are referenced by their original filename all over
// the app (CSS background-image, hero slide mapping, <img src>). We can't rename
// them without hunting down every reference, so these are resized/re-encoded
// IN PLACE. `withoutEnlargement` leaves anything already small untouched, so this
// pass is safe to re-run. Widths are ~2x the largest on-screen display size.
const inPlaceResize = [
  { file: 'public/images/products/Suasana_BPP.webp', width: 2048, webp: 72 }, // hero slide 1, full-bleed
  { file: 'public/images/products/Craddle_4x4_fixed.webp', width: 1100, webp: 72 }, // featured banner
  { file: 'public/gambar about.jpg', width: 1400, jpeg: 80 }, // AboutCompany section bg
  { file: 'public/office-optimized.jpg', width: 1280, jpeg: 80 }, // AboutCompany <img>
  { file: 'public/images/office/wp.jpg', width: 1400, jpeg: 76 }, // interior page bg
  { file: 'public/images/office/wp2.jpg', width: 1400, jpeg: 74 }, // homepage fixed bg
];

async function resizeInPlace() {
  console.log('Resizing oversized source images in place...\n');
  for (const job of inPlaceResize) {
    const full = path.join(__dirname, job.file);
    if (!fs.existsSync(full)) { console.log(`⚠️  Not found: ${job.file}`); continue; }
    // Read into a buffer first: on Windows sharp keeps the source handle open,
    // which blocks writing back to the same path.
    const src = fs.readFileSync(full);
    const before = src.length;
    let t = sharp(src).rotate().resize(job.width, null, { withoutEnlargement: true, fit: 'inside' });
    if (job.webp) t = t.webp({ quality: job.webp });
    if (job.jpeg) t = t.jpeg({ quality: job.jpeg, progressive: true, mozjpeg: true });
    const out = await t.toBuffer();
    fs.writeFileSync(full, out);
    console.log(`✅ ${job.file}  ${(before / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB`);
  }
  console.log('');
}

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  for (const image of imagesToOptimize) {
    try {
      const inputPath = path.join(__dirname, image.input);
      const outputPath = path.join(__dirname, image.output);
      
      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  File not found: ${image.input}`);
        continue;
      }
      
      console.log(`📷 Optimizing: ${image.input}`);
      
      // Get original size
      const originalStats = fs.statSync(inputPath);
      const originalSize = (originalStats.size / 1024 / 1024).toFixed(2);
      
      // Optimize image
      const transformer = sharp(inputPath)
        .resize(image.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      
      // Apply format-specific optimization
      if (image.input.endsWith('.jpg') || image.input.endsWith('.jpeg')) {
        transformer.jpeg({ quality: image.quality, progressive: true });
      } else if (image.input.endsWith('.webp')) {
        transformer.webp({ quality: image.quality });
      }
      
      await transformer.toFile(outputPath);
      
      // Get optimized size
      const optimizedStats = fs.statSync(outputPath);
      const optimizedSize = (optimizedStats.size / 1024 / 1024).toFixed(2);
      const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
      
      console.log(`✅ ${image.input}`);
      console.log(`   Original: ${originalSize} MB`);
      console.log(`   Optimized: ${optimizedSize} MB`);
      console.log(`   Savings: ${savings}%`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error optimizing ${image.input}:`, error.message);
    }
  }
  
  console.log('✨ Image optimization complete!');
}

(async () => {
  await resizeInPlace();
  await optimizeImages();
})().catch(console.error);