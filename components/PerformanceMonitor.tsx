'use client'

import { useEffect } from 'react'

// Performance API interfaces
interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number
}

interface PerformanceEntryWithHadRecentInput extends PerformanceEntry {
  hadRecentInput?: boolean
  value?: number
}

interface PerformanceEntryWithLoadEventEnd extends PerformanceEntry {
  loadEventEnd?: number
  fetchStart?: number
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals tracking
    const trackWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
        
        // Send to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime)
          })
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          console.log('FID:', (entry as PerformanceEntryWithProcessingStart).processingStart! - entry.startTime)
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round((entry as PerformanceEntryWithProcessingStart).processingStart! - entry.startTime)
            })
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      let clsEntries: PerformanceEntry[] = []
      
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Only count layout shifts without recent user input
          if (!(entry as PerformanceEntryWithHadRecentInput).hadRecentInput) {
            const firstSessionEntry = clsEntries[0]
            const lastSessionEntry = clsEntries[clsEntries.length - 1]
            
            // If the entry occurred less than 1 second after the previous entry
            // and less than 5 seconds after the first entry in the session,
            // include the entry in the current session. Otherwise, start a new session.
            if (clsValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              clsValue += (entry as PerformanceEntryWithHadRecentInput).value!
              clsEntries.push(entry)
            } else {
              clsValue = (entry as PerformanceEntryWithHadRecentInput).value!
              clsEntries = [entry]
            }
          }
        }
        
        // Only log if CLS is significant (> 0.1)
        if (clsValue > 0.1) {
          console.log('CLS:', clsValue)
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000)
            })
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })

      // First Contentful Paint (FCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          console.log('FCP:', entry.startTime)
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FCP',
              value: Math.round(entry.startTime)
            })
          }
        })
      }).observe({ entryTypes: ['paint'] })
    }

    // Time to Interactive (TTI) - Custom implementation
    const trackTTI = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'navigation') {
            const tti = (entry as PerformanceEntryWithLoadEventEnd).loadEventEnd! - (entry as PerformanceEntryWithLoadEventEnd).fetchStart!
            console.log('TTI:', tti)
            
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'TTI',
                value: Math.round(tti)
              })
            }
          }
        })
      })
      observer.observe({ entryTypes: ['navigation'] })
    }

    // Resource loading performance
    const trackResourcePerformance = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming
            console.log(`Resource ${resource.name}:`, resource.duration)
            
            // Track slow resources
            if (resource.duration > 1000) {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'slow_resource', {
                  event_category: 'Performance',
                  event_label: resource.name,
                  value: Math.round(resource.duration)
                })
              }
            }
          }
        })
      })
      observer.observe({ entryTypes: ['resource'] })
    }

    // Initialize tracking only in production
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window && process.env.NODE_ENV === 'production') {
      trackWebVitals()
      trackTTI()
      trackResourcePerformance()
    }

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      console.log('Page Load Time:', loadTime)
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_load_time', {
          event_category: 'Performance',
          event_label: 'Load Time',
          value: Math.round(loadTime)
        })
      }
    })

  }, [])

  return null
}
