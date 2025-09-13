'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'garage_type',
                'custom_parameter_2': 'service_category'
              }
            });
            
            // Enhanced ecommerce tracking for services
            gtag('config', '${measurementId}', {
              send_page_view: false
            });
            
            // Track page views manually for better control
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            });
          `,
        }}
      />
    </>
  )
}

// Custom event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export const trackServiceView = (serviceName: string) => {
  trackEvent('view_service', 'Services', serviceName)
}

export const trackContactForm = (formType: string) => {
  trackEvent('contact_form_submit', 'Contact', formType)
}

export const trackPhoneCall = (phoneNumber: string) => {
  trackEvent('phone_call', 'Contact', phoneNumber)
}

export const trackBlogView = (postTitle: string) => {
  trackEvent('view_blog_post', 'Blog', postTitle)
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
