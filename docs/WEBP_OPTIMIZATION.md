# WebP Image Optimization Guide

## Overview
This project implements WebP image optimization for better performance and smaller file sizes. WebP images are typically 25-35% smaller than JPEG/PNG while maintaining the same quality.

## Features

### 1. Automatic Format Detection
- Detects browser support for WebP and AVIF
- Falls back to JPEG/PNG for unsupported browsers
- Uses the best available format automatically

### 2. Responsive Images
- Generates multiple sizes for different screen resolutions
- Provides srcSet for optimal loading
- Includes proper sizes attribute

### 3. Lazy Loading
- Images load only when they enter the viewport
- Reduces initial page load time
- Improves Core Web Vitals

### 4. Quality Optimization
- Different quality settings for different image types:
  - Hero images: 90% quality
  - Gallery images: 85% quality
  - Service images: 80% quality
  - Blog images: 75% quality
  - Thumbnails: 70% quality

## Usage

### Basic Usage
```tsx
import OptimizedImage from '@/components/OptimizedImage'

<OptimizedImage
  src="/images/hero-bg.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  priority={true}
/>
```

### Specialized Components
```tsx
import { HeroImage, CardImage, ThumbnailImage } from '@/components/OptimizedImage'

// For hero sections
<HeroImage src="/images/hero.jpg" alt="Hero" />

// For cards
<CardImage src="/images/service.jpg" alt="Service" />

// For thumbnails
<ThumbnailImage src="/images/thumb.jpg" alt="Thumbnail" />
```

### With Fill Layout
```tsx
<OptimizedImage
  src="/images/gallery.jpg"
  alt="Gallery image"
  fill
  className="object-cover"
/>
```

## Converting Images to WebP

### 1. Install Sharp
```bash
npm install sharp
```

### 2. Run Conversion Script
```bash
npm run convert-webp
```

### 3. Manual Conversion
```bash
node scripts/convert-to-webp.js
```

## Configuration

### Image Optimizer Settings
```typescript
// lib/image-optimizer.ts
export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  blur?: boolean
}
```

### Quality Settings
```typescript
const QUALITY_SETTINGS = {
  hero: 90,      // High quality for hero images
  gallery: 85,   // Good quality for gallery
  services: 80,  // Balanced quality for services
  blog: 75,      // Lower quality for blog images
  thumbnails: 70 // Lowest quality for thumbnails
}
```

## Performance Benefits

### File Size Reduction
- **JPEG to WebP**: 25-35% smaller
- **PNG to WebP**: 25-50% smaller
- **Overall page size**: 20-40% reduction

### Loading Performance
- Faster initial page load
- Better Core Web Vitals scores
- Improved LCP (Largest Contentful Paint)
- Reduced bandwidth usage

### SEO Benefits
- Better page speed scores
- Improved user experience
- Higher search rankings

## Browser Support

### WebP Support
- Chrome: ✅ (Full support)
- Firefox: ✅ (Full support)
- Safari: ✅ (iOS 14+, macOS 11+)
- Edge: ✅ (Full support)

### AVIF Support
- Chrome: ✅ (Full support)
- Firefox: ✅ (Full support)
- Safari: ❌ (Not supported)
- Edge: ✅ (Full support)

## Best Practices

### 1. Use Appropriate Quality
- Don't use 100% quality (unnecessary file size)
- Use 80-90% for most images
- Use 70-80% for thumbnails

### 2. Provide Fallbacks
- Always include alt text
- Use proper error handling
- Provide placeholder images

### 3. Optimize Loading
- Use priority for above-the-fold images
- Implement lazy loading for below-the-fold images
- Preload critical images

### 4. Monitor Performance
- Use Chrome DevTools
- Check Core Web Vitals
- Monitor file sizes

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths
   - Verify WebP support
   - Check console for errors

2. **Poor quality**
   - Increase quality setting
   - Check original image quality
   - Verify conversion settings

3. **Large file sizes**
   - Reduce quality setting
   - Optimize original images
   - Use appropriate dimensions

### Debug Mode
```typescript
// Enable debug logging
const debugMode = process.env.NODE_ENV === 'development'
if (debugMode) {
  console.log('Image optimization:', { src, format, quality })
}
```

## Future Enhancements

1. **CDN Integration**
   - Cloudinary
   - ImageKit
   - AWS CloudFront

2. **Advanced Features**
   - Blur placeholders
   - Progressive loading
   - Art direction

3. **Automation**
   - Build-time optimization
   - Automatic format detection
   - Quality optimization

## Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
