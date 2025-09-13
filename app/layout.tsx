import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import StructuredData from '@/components/StructuredData'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import SpeedOptimizer from '@/components/SpeedOptimizer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'تورنادو | گاراژ تخصصی مکانیکی | تعمیر خودروهای آلمانی و چینی',
  description: 'گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی. خدمات مکانیکی، تعمیر موتور، گیربکس و سیستم برقی.',
  keywords: [
    'تعمیر خودرو',
    'مکانیک',
    'خودرو آلمانی',
    'خودرو چینی',
    'گاراژ',
    'تعمیر موتور',
    'گیربکس',
    'سیستم برقی',
    'سیستم ترمز',
    'نگهداری خودرو',
    'تورنادو'
  ],
  authors: [{ name: 'گاراژ تخصصی مکانیکی تورنادو' }],
  creator: 'گاراژ تخصصی مکانیکی تورنادو',
  publisher: 'گاراژ تخصصی مکانیکی تورنادو',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://garage-website.ir',
    title: 'تورنادو | گاراژ تخصصی مکانیکی | تعمیر خودروهای آلمانی و چینی',
    description: 'گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی',
    siteName: 'تورنادو - گاراژ تخصصی مکانیکی',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'تورنادو - گاراژ تخصصی مکانیکی',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تورنادو | گاراژ تخصصی مکانیکی | تعمیر خودروهای آلمانی و چینی',
    description: 'گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://garage-website.ir',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Vazirmatn Font */}
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              "name": "تورنادو - گاراژ تخصصی مکانیکی",
              "description": "گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی",
              "url": "https://garage-website.ir",
              "telephone": "021-12345678",
              "email": "info@garage-website.ir",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "تهران، خیابان ولیعصر، پلاک 123",
                "addressLocality": "تهران",
                "addressCountry": "IR"
              },
              "openingHours": "Mo-Th 08:00-18:00, Fr 08:00-14:00",
              "priceRange": "$$",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 35.6892,
                  "longitude": 51.3890
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "خدمات مکانیکی",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "تعمیر موتور"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "تعمیر گیربکس"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="bg-dark-950 text-white">
        <StructuredData type="organization" data={{}} />
        <StructuredData type="localBusiness" data={{}} />
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-XXXXXXXXXX"} />
        )}
        <PerformanceMonitor />
        <SpeedOptimizer />
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}