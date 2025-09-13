// Client-side image utilities (no server dependencies)

/**
 * Generate optimized image URL with parameters
 */
export const optimizeImage = (src: string, width?: number, height?: number, quality: number = 75) => {
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  return `${src}?${params.toString()}`
}

/**
 * Preload a single image
 */
export const preloadImage = (src: string): Promise<void> => {
  const img = new Image()
  img.src = src
  return new Promise((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
  })
}

/**
 * Preload multiple images
 */
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage))
}

/**
 * Preload critical images for performance
 */
export const preloadCriticalImages = (images: string[]) => {
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

/**
 * Setup lazy loading for images
 */
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    })

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))
  }
}

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  baseName: string,
  sizes: number[],
  format: 'webp' | 'avif' = 'webp'
): string => {
  return sizes
    .map(size => `/images/optimized/${baseName}-${size}.${format} ${size}w`)
    .join(', ')
}

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (): string => {
  return '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px'
}

/**
 * Check if browser supports WebP
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Check if browser supports AVIF
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image()
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2)
    }
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEAwgMgkfAAAADcQ3y7+1AAA='
  })
}

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (): Promise<'avif' | 'webp' | 'jpeg'> => {
  if (await supportsAVIF()) return 'avif'
  if (await supportsWebP()) return 'webp'
  return 'jpeg'
}

/**
 * Generate responsive image URLs
 */
export const generateResponsiveUrls = (baseName: string, format: 'webp' | 'avif' = 'webp') => {
  const sizes = [320, 640, 768, 1024, 1280, 1920]
  return sizes.map(size => `/images/optimized/${baseName}-${size}.${format}`)
}
