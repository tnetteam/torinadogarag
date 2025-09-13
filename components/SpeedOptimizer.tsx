'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'
import { preloadCriticalImages, setupLazyLoading } from '@/lib/image-utils'


export default function SpeedOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/images/hero-bg.jpg',
        '/images/hero-bmw.jpg',
        '/images/hero-mercedes.jpg',
        '/images/hero-audi.jpg'
      ]

      preloadCriticalImages(criticalImages)
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        // Add loading="lazy" to images below the fold
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async')
        }
        
        // Add performance optimizations
        img.style.willChange = 'auto'
        img.style.transform = 'translateZ(0)'
      })
    }

    // Prefetch important pages
    const prefetchImportantPages = () => {
      const importantPages = ['/about', '/services', '/contact']
      
      importantPages.forEach(page => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = page
        document.head.appendChild(link)
      })
    }

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]')
      scripts.forEach(script => {
        if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
          script.setAttribute('defer', 'true')
        }
      })
    }

    // Remove unused CSS
    const removeUnusedCSS = () => {
      // This would typically be done at build time, but we can optimize runtime
      const styleSheets = document.styleSheets
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const sheet = styleSheets[i]
          if (sheet.href && sheet.href.includes('googleapis.com')) {
            // Optimize Google Fonts loading
            const link = document.querySelector(`link[href="${sheet.href}"]`) as HTMLLinkElement
            if (link) {
              link.setAttribute('media', 'print')
              link.onload = () => {
                link.setAttribute('media', 'all')
              }
            }
          }
        } catch {
          // Cross-origin stylesheets can't be accessed
        }
      }
    }

    // Optimize animations for performance
    const optimizeAnimations = () => {
      // Use transform and opacity for better performance
      const animatedElements = document.querySelectorAll('[class*="animate-"]')
      animatedElements.forEach(element => {
        const htmlElement = element as HTMLElement
        htmlElement.style.willChange = 'transform, opacity'
      })
    }

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false
      
      const updateScroll = () => {
        // Add scroll optimizations here
        ticking = false
      }
      
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll)
          ticking = true
        }
      }
      
      window.addEventListener('scroll', onScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }

    // Initialize optimizations only in production
    const initializeOptimizations = () => {
      if (process.env.NODE_ENV === 'production') {
        preloadCriticalResources()
        optimizeImages()
        prefetchImportantPages()
        optimizeThirdPartyScripts()
        removeUnusedCSS()
        optimizeAnimations()
        optimizeScroll()
        setupLazyLoading()
      } else {
        // In development, only optimize images and scroll
        optimizeImages()
        optimizeScroll()
        setupLazyLoading()
      }
    }

    // Run optimizations after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeOptimizations)
    } else {
      initializeOptimizations()
    }

    // Cleanup on unmount
    return () => {
      // Remove any added elements
      const addedLinks = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]')
      addedLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
    }
  }, [])

  return null
}

// Utility functions for performance optimization
export { optimizeImage, preloadImage, preloadImages } from '@/lib/image-utils'

// Critical CSS inlining (would be done at build time)
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { margin: 0; padding: 0; }
    .bg-dark-950 { background-color: #0a0a0a; }
    .text-white { color: #ffffff; }
    .container { max-width: 1200px; margin: 0 auto; }
  `
  
  const style = document.createElement('style')
  style.textContent = criticalCSS
  document.head.appendChild(style)
}
