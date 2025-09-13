import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = 'https://garage-website.ir',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
  } = config

  const fullTitle = title.includes('گاراژ تخصصی') ? title : `${title} | گاراژ تخصصی مکانیکی`
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
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
      ...keywords
    ].join(', '),
    authors: [{ name: author || 'گاراژ تخصصی مکانیکی' }],
    creator: 'گاراژ تخصصی مکانیکی',
    publisher: 'گاراژ تخصصی مکانیکی',
    robots: 'index, follow',
    openGraph: {
      type: type,
      locale: 'fa_IR',
      url: url,
      title: fullTitle,
      description: fullDescription,
      siteName: 'گاراژ تخصصی مکانیکی',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: author ? [author] : undefined,
      section: section,
      tags: tags,
    }
  }

  return metadata
}

export function generateStructuredData(type: 'Organization' | 'Service' | 'Article', data: Record<string, unknown>) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: 'گاراژ تخصصی مکانیکی',
        description: 'گاراژ تخصصی مکانیکی با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی',
        url: 'https://garage-website.ir',
        telephone: '+98-21-12345678',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'خیابان ولیعصر، پلاک 123',
          addressLocality: 'تهران',
          addressCountry: 'IR'
        },
        openingHours: 'Mo-Fr 08:00-18:00, Sa 08:00-14:00',
        priceRange: '$$',
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 35.6892,
            longitude: 51.3890
          },
          geoRadius: '50000'
        },
        sameAs: [
          'https://www.instagram.com/garage_website',
          'https://www.facebook.com/garage_website'
        ]
      }

    case 'Service':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: 'گاراژ تخصصی مکانیکی'
        },
        areaServed: {
          '@type': 'City',
          name: 'تهران'
        },
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'IRR'
        }
      }

    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'گاراژ تخصصی مکانیکی',
          logo: {
            '@type': 'ImageObject',
            url: 'https://garage-website.ir/logo.png'
          }
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        },
        image: data.image,
        keywords: (data.keywords as string[])?.join(', ')
      }

    default:
      return baseData
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// SEO utility functions
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // Remove special characters except Persian and basic Latin
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export function generateSitemapUrls(): Array<{ url: string; lastModified: Date; changeFrequency: string; priority: number }> {
  return [
    {
      url: 'https://garage-website.ir',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://garage-website.ir/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://garage-website.ir/#services',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://garage-website.ir/#about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://garage-website.ir/#contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
