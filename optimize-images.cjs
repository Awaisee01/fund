const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Generate responsive images for PageSpeed optimization
async function generateResponsiveImages(inputPath, outputDir) {
  const sizes = [192, 384, 576, 768, 960, 1152, 1344, 1536];
  
  for (const size of sizes) {
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${baseName}-${size}w.webp`);
    
    await sharp(inputPath)
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    console.log(`Generated: ${outputPath}`);
  }
}

// Optimize images with proper sizing and compression
async function optimizeImage(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();
  
  // Only resize if image is larger than needed
  const maxWidth = 1920; // Maximum display width
  const maxHeight = 1080; // Maximum display height
  
  let pipeline = sharp(inputPath);
  
  if (metadata.width > maxWidth || metadata.height > maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  await pipeline
    .webp({ quality: 80 })
    .toFile(outputPath);
    
  console.log(`Optimized: ${outputPath}`);
    
  // Generate responsive versions
  await generateResponsiveImages(inputPath, path.dirname(outputPath));
}

// Process all images in lovable-uploads
async function optimizeAllImages() {
  const uploadsDir = './public/lovable-uploads';
  const files = fs.readdirSync(uploadsDir);
  
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const inputPath = path.join(uploadsDir, file);
      const outputPath = path.join(uploadsDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      try {
        await optimizeImage(inputPath, outputPath);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }
}

if (require.main === module) {
  optimizeAllImages().then(() => {
    console.log('Image optimization complete!');
  }).catch(console.error);
}

module.exports = { optimizeImage, generateResponsiveImages };