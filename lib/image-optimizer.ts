import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  blur?: boolean
}

export interface OptimizedImageResult {
  originalPath: string
  optimizedPath: string
  webpPath: string
  avifPath: string
  sizes: {
    original: { width: number; height: number }
    optimized: { width: number; height: number }
  }
}

/**
 * بهینه‌سازی تصویر با Sharp
 */
export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    width = 1920,
    height = 1080,
    quality = 85,
    blur = false
  } = options

  try {
    // اطمینان از وجود پوشه خروجی
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // خواندن اطلاعات تصویر اصلی
    const imageInfo = await sharp(inputPath).metadata()
    const originalWidth = imageInfo.width || 0
    const originalHeight = imageInfo.height || 0

    // محاسبه ابعاد بهینه
    const aspectRatio = originalWidth / originalHeight
    let optimizedWidth = width
    let optimizedHeight = height

    if (aspectRatio > 1) {
      // تصویر landscape
      optimizedHeight = Math.round(width / aspectRatio)
    } else {
      // تصویر portrait
      optimizedWidth = Math.round(height * aspectRatio)
    }

    // نام فایل‌ها
    const originalBaseName = path.basename(inputPath, path.extname(inputPath))
    const timestamp = Date.now()
    const baseName = `${originalBaseName}-${timestamp}`
    
    const avifPath = path.join(outputDir, `${baseName}.avif`)
    const mainPath = path.join(outputDir, `${baseName}.webp`)

    // ایجاد pipeline بهینه‌سازی
    let pipeline = sharp(inputPath)
      .resize(optimizedWidth, optimizedHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })

    // اضافه کردن blur اگر نیاز باشد
    if (blur) {
      pipeline = pipeline.blur(0.5)
    }

    // تولید فرمت‌های مختلف
    await Promise.all([
      // WebP اصلی
      pipeline
        .clone()
        .webp({ quality })
        .toFile(mainPath),
      
      // AVIF (بهترین فشرده‌سازی)
      pipeline
        .clone()
        .avif({ quality: quality - 10 })
        .toFile(avifPath)
    ])

    return {
      originalPath: inputPath,
      optimizedPath: mainPath,
      webpPath: mainPath,
      avifPath,
      sizes: {
        original: { width: originalWidth, height: originalHeight },
        optimized: { width: optimizedWidth, height: optimizedHeight }
      }
    }

  } catch (error) {
    console.error('Error optimizing image:', error)
    throw new Error('خطا در بهینه‌سازی تصویر')
  }
}

/**
 * تولید responsive images با ابعاد مختلف
 */
export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<{
  webp: string[]
  avif: string[]
  sizes: number[]
}> {
  const sizes = [320, 640, 768, 1024, 1280, 1920]
  const webpPaths: string[] = []
  const avifPaths: string[] = []

  try {
    for (const size of sizes) {
      const webpPath = path.join(outputDir, `${baseName}-${size}.webp`)
      const avifPath = path.join(outputDir, `${baseName}-${size}.avif`)

      await Promise.all([
        // WebP
        sharp(inputPath)
          .resize(size, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(webpPath),
        
        // AVIF
        sharp(inputPath)
          .resize(size, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .avif({ quality: 75 })
          .toFile(avifPath)
      ])

      webpPaths.push(webpPath)
      avifPaths.push(avifPath)
    }

    return {
      webp: webpPaths,
      avif: avifPaths,
      sizes
    }

  } catch (error) {
    console.error('Error generating responsive images:', error)
    throw new Error('خطا در تولید تصاویر responsive')
  }
}

/**
 * حذف فایل‌های تصویر قدیمی
 */
export function cleanupOldImages(imagePaths: string[]): void {
  imagePaths.forEach(imagePath => {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
        console.log('Deleted old image:', imagePath)
      }
    } catch (error) {
      console.error('Error deleting old image:', error)
    }
  })
}

/**
 * تولید srcSet برای responsive images
 */
export function generateSrcSet(
  baseName: string,
  sizes: number[],
  format: 'webp' | 'avif' = 'webp'
): string {
  return sizes
    .map(size => `/images/optimized/${baseName}-${size}.${format} ${size}w`)
    .join(', ')
}

/**
 * تولید sizes attribute برای responsive images
 */
export function generateSizes(): string {
  return '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px'
}