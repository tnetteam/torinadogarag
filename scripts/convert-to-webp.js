#!/usr/bin/env node

/**
 * WebP Conversion Script
 * Converts all images in public/images to WebP format
 * Requires: npm install sharp
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'webp')

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']

// Quality settings for different image types
const QUALITY_SETTINGS = {
  hero: 90,
  gallery: 85,
  services: 80,
  blog: 75,
  thumbnails: 70
}

async function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function convertImageToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ 
        quality,
        effort: 6 // Higher effort for better compression
      })
      .toFile(outputPath)
    
    const originalSize = fs.statSync(inputPath).size
    const webpSize = fs.statSync(outputPath).size
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`)
    return { success: true, savings: parseFloat(savings) }
  } catch (error) {
    console.error(`❌ Failed to convert ${inputPath}:`, error.message)
    return { success: false, error: error.message }
  }
}

function getQualityForPath(filePath) {
  const fileName = path.basename(filePath).toLowerCase()
  
  if (fileName.includes('hero')) return QUALITY_SETTINGS.hero
  if (fileName.includes('gallery')) return QUALITY_SETTINGS.gallery
  if (fileName.includes('service')) return QUALITY_SETTINGS.services
  if (fileName.includes('blog')) return QUALITY_SETTINGS.blog
  if (fileName.includes('thumb')) return QUALITY_SETTINGS.thumbnails
  
  return 80 // Default quality
}

async function processDirectory(dir, relativePath = '') {
  const items = fs.readdirSync(dir)
  let totalSavings = 0
  let processedCount = 0
  
  for (const item of items) {
    const itemPath = path.join(dir, item)
    const itemRelativePath = path.join(relativePath, item)
    const stat = fs.statSync(itemPath)
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subDirResults = await processDirectory(itemPath, itemRelativePath)
      totalSavings += subDirResults.savings
      processedCount += subDirResults.count
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase()
      
      if (SUPPORTED_FORMATS.includes(ext)) {
        // Create output directory structure
        const outputDir = path.join(OUTPUT_DIR, relativePath)
        await ensureDirectoryExists(outputDir)
        
        // Generate output filename
        const nameWithoutExt = path.basename(item, ext)
        const outputPath = path.join(outputDir, `${nameWithoutExt}.webp`)
        
        // Skip if WebP already exists and is newer
        if (fs.existsSync(outputPath)) {
          const originalTime = stat.mtime
          const webpTime = fs.statSync(outputPath).mtime
          if (webpTime > originalTime) {
            console.log(`⏭️  Skipping ${itemRelativePath} (WebP is newer)`)
            continue
          }
        }
        
        // Convert to WebP
        const quality = getQualityForPath(itemPath)
        const result = await convertImageToWebP(itemPath, outputPath, quality)
        
        if (result.success) {
          totalSavings += result.savings
          processedCount++
        }
      }
    }
  }
  
  return { savings: totalSavings, count: processedCount }
}

async function main() {
  console.log('🚀 Starting WebP conversion...\n')
  
  // Check if Sharp is installed
  try {
    require('sharp')
  } catch (error) {
    console.error('❌ Sharp is not installed. Please run: npm install sharp')
    process.exit(1)
  }
  
  // Ensure output directory exists
  await ensureDirectoryExists(OUTPUT_DIR)
  
  // Process all images
  const results = await processDirectory(IMAGES_DIR)
  
  console.log('\n📊 Conversion Summary:')
  console.log(`   Processed: ${results.count} images`)
  console.log(`   Average savings: ${(results.savings / results.count).toFixed(1)}%`)
  console.log(`   Total space saved: ${results.savings.toFixed(1)}%`)
  
  console.log('\n✨ WebP conversion completed!')
  console.log('\n💡 Next steps:')
  console.log('   1. Update your components to use WebP images')
  console.log('   2. Add fallbacks for browsers that don\'t support WebP')
  console.log('   3. Consider using a CDN for even better performance')
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { convertImageToWebP, processDirectory }
