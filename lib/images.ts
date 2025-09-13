// Image optimization and management utilities

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  blur?: boolean
}

export interface ImageMetadata {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

// Placeholder images for development
export const placeholderImages = {
  garage: {
    src: '/images/garage-placeholder.jpg',
    alt: 'گاراژ تخصصی مکانیکی',
    width: 800,
    height: 600
  },
  service: {
    src: '/images/service-placeholder.jpg',
    alt: 'خدمات تعمیر خودرو',
    width: 400,
    height: 300
  },
  blog: {
    src: '/images/blog-placeholder.jpg',
    alt: 'مقاله تخصصی',
    width: 600,
    height: 400
  },
  team: {
    src: '/images/team-placeholder.jpg',
    alt: 'تیم متخصص',
    width: 300,
    height: 300
  }
}

// Generate blur data URL for images
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create a simple gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

// Optimize image URL for different sizes
export function getOptimizedImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  // Destructure options for potential future use
  const { width, height, quality = 80, format = 'webp' } = options
  
  // Suppress unused variable warnings
  void width
  void height
  void quality
  void format
  
  // In a real application, you would use a service like Cloudinary, ImageKit, or Next.js Image Optimization
  // For now, we'll return the original URL
  return src
}

// Generate responsive image sizes
export function generateImageSizes(baseWidth: number): string {
  const sizes = [
    { width: 320, descriptor: '320w' },
    { width: 640, descriptor: '640w' },
    { width: 768, descriptor: '768w' },
    { width: 1024, descriptor: '1024w' },
    { width: 1280, descriptor: '1280w' },
    { width: 1536, descriptor: '1536w' }
  ]
  
  return sizes
    .filter(size => size.width <= baseWidth)
    .map(size => size.descriptor)
    .join(', ')
}

// Lazy loading utility
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Image preloading
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Batch image preloading
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage))
}

// Generate image alt text for SEO
export function generateImageAltText(
  context: 'service' | 'blog' | 'gallery' | 'team',
  specificInfo: string
): string {
  const baseTexts = {
    service: 'خدمات تعمیر خودرو',
    blog: 'مقاله تخصصی تعمیر خودرو',
    gallery: 'گالری تصاویر گاراژ',
    team: 'تیم متخصص گاراژ'
  }
  
  return `${baseTexts[context]} - ${specificInfo} | گاراژ تخصصی مکانیکی`
}

// Image compression utility (client-side)
export function compressImage(
  file: File, 
  maxWidth: number = 1920, 
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to compress image'))
        }
      }, 'image/jpeg', quality)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Gallery image utilities
export interface GalleryImage {
  id: string
  src: string
  alt: string
  thumbnail: string
  width: number
  height: number
  category: string
  tags: string[]
}

export function createGalleryImage(
  id: string,
  src: string,
  alt: string,
  category: string,
  tags: string[] = []
): GalleryImage {
  return {
    id,
    src,
    alt,
    thumbnail: getOptimizedImageUrl(src, { width: 300, height: 200 }),
    width: 800,
    height: 600,
    category,
    tags
  }
}

// Image upload utility (for admin panel)
export async function uploadImage(
  file: File,
  category: 'gallery' | 'blog' | 'service'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // In a real application, you would upload to a cloud service
    // For now, we'll simulate the upload
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate a mock URL
    const mockUrl = `/uploads/${category}/${Date.now()}-${file.name}`
    
    return {
      success: true,
      url: mockUrl
    }
  } catch {
    return {
      success: false,
      error: 'خطا در آپلود تصویر'
    }
  }
}

// Image validation
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد'
    }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'فرمت فایل باید JPEG، PNG یا WebP باشد'
    }
  }
  
  return { valid: true }
}
