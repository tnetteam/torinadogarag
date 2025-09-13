'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { generateSrcSet, generateSizes } from '@/lib/image-utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Extract base name from src for responsive images
  const getBaseName = (imageSrc: string): string => {
    const pathParts = imageSrc.split('/')
    const filename = pathParts[pathParts.length - 1]
    // Remove file extension only, keep the full base name
    return filename.replace(/\.(webp|avif|jpg|jpeg|png)$/i, '')
  }

  const handleLoad = () => {
    setImageLoaded(true)
  }

  // Check if image is already optimized
  const isOptimized = src.includes('/images/optimized/')

  if (isOptimized) {
    // Use optimized image with responsive variants
    const webpSrcSet = generateSrcSet(getBaseName(src), [320, 640, 768, 1024, 1280, 1920], 'webp')
    const avifSrcSet = generateSrcSet(getBaseName(src), [320, 640, 768, 1024, 1280, 1920], 'avif')
    const imageSizes = sizes || generateSizes()

    return (
      <picture className={className}>
        {/* AVIF format (best compression) */}
        <source
          srcSet={avifSrcSet}
          sizes={imageSizes}
          type="image/avif"
        />

        {/* WebP format (good compression) */}
        <source
          srcSet={webpSrcSet}
          sizes={imageSizes}
          type="image/webp"
        />

        {/* Fallback image */}
        <img
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${fill ? 'w-full h-full object-cover' : 'w-full h-auto'} ${className}`}
          style={{
            ...(fill && {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            })
          }}
          onLoad={handleLoad}
        />
      </picture>
    )
  }

  // Fallback for non-optimized images
  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${fill ? 'w-full h-full object-cover' : 'w-full h-auto'} ${className}`}
        style={{
          ...(fill && {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          })
        }}
        onLoad={handleLoad}
      />
    </div>
  )
}

// Export for backward compatibility
export { OptimizedImage as CardImage }
export { OptimizedImage as HeroImage }
export { OptimizedImage as ThumbnailImage }
