interface MetaConfig {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export class MetaManager {
  private baseUrl: string
  private defaultConfig: MetaConfig

  constructor(baseUrl: string = 'https://tornado-garage.ir') {
    this.baseUrl = baseUrl
    this.defaultConfig = {
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
        'تورنادو',
        'تهران'
      ],
      image: `${baseUrl}/images/og-image.jpg`,
      url: baseUrl,
      type: 'website',
      author: 'گاراژ تخصصی مکانیکی تورنادو'
    }
  }

  generateMeta(config: Partial<MetaConfig> = {}): MetaConfig {
    const mergedConfig = { ...this.defaultConfig, ...config }
    
    // Ensure title includes brand name if not already present
    if (!mergedConfig.title.includes('تورنادو')) {
      mergedConfig.title = `${mergedConfig.title} | تورنادو گاراژ`
    }

    // Ensure URL is absolute
    if (mergedConfig.url && !mergedConfig.url.startsWith('http')) {
      mergedConfig.url = `${this.baseUrl}${mergedConfig.url}`
    }

    // Ensure image URL is absolute
    if (mergedConfig.image && !mergedConfig.image.startsWith('http')) {
      mergedConfig.image = `${this.baseUrl}${mergedConfig.image}`
    }

    return mergedConfig
  }

  generatePageMeta(page: string, customConfig: Partial<MetaConfig> = {}): MetaConfig {
    const pageConfigs: Record<string, Partial<MetaConfig>> = {
      home: {
        title: 'تورنادو | گاراژ تخصصی مکانیکی | تعمیر خودروهای آلمانی و چینی',
        description: 'گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی. خدمات مکانیکی، تعمیر موتور، گیربکس و سیستم برقی.',
        keywords: ['تعمیر خودرو', 'مکانیک', 'خودرو آلمانی', 'خودرو چینی', 'گاراژ', 'تورنادو', 'تهران']
      },
      about: {
        title: 'درباره ما - گاراژ تخصصی مکانیکی تورنادو',
        description: 'با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی، تیم متخصص ما بهترین خدمات را ارائه می‌دهد.',
        keywords: ['درباره ما', 'تیم مکانیک', 'تجربه', 'گاراژ تخصصی', 'تورنادو']
      },
      services: {
        title: 'خدمات ما - تعمیر خودروهای آلمانی و چینی',
        description: 'خدمات تخصصی تعمیر خودرو شامل تعمیر موتور، گیربکس، سیستم برقی و سرویس دوره‌ای خودروهای آلمانی و چینی.',
        keywords: ['خدمات تعمیر خودرو', 'تعمیر موتور', 'گیربکس', 'سیستم برقی', 'سرویس خودرو']
      },
      blog: {
        title: 'وبلاگ - مقالات تخصصی تعمیر خودرو',
        description: 'مقالات تخصصی و راهنمای تعمیر خودرو، نکات نگهداری و آخرین اخبار صنعت خودرو.',
        keywords: ['وبلاگ خودرو', 'مقالات تعمیر', 'راهنمای نگهداری', 'اخبار خودرو']
      },
      news: {
        title: 'اخبار خودرو - آخرین اخبار صنعت خودرو',
        description: 'آخرین اخبار و تحولات صنعت خودرو، معرفی خودروهای جدید و تکنولوژی‌های نوین.',
        keywords: ['اخبار خودرو', 'صنعت خودرو', 'خودروهای جدید', 'تکنولوژی خودرو']
      },
      gallery: {
        title: 'گالری تصاویر - تصاویر کارگاه و خدمات',
        description: 'تصاویر کارگاه تخصصی مکانیکی تورنادو، تجهیزات مدرن و نمونه کارهای انجام شده.',
        keywords: ['گالری تصاویر', 'کارگاه مکانیکی', 'تجهیزات', 'نمونه کار']
      },
      contact: {
        title: 'تماس با ما - گاراژ تخصصی مکانیکی تورنادو',
        description: 'با ما تماس بگیرید. آدرس، شماره تلفن و ساعات کاری گاراژ تخصصی مکانیکی تورنادو.',
        keywords: ['تماس', 'آدرس', 'شماره تلفن', 'ساعات کاری', 'گاراژ']
      }
    }

    const pageConfig = pageConfigs[page] || {}
    return this.generateMeta({ ...pageConfig, ...customConfig })
  }

  generateArticleMeta(article: {
    title: string
    excerpt: string
    content: string
    image?: string
    publishedAt: string
    updatedAt?: string
    tags?: string[]
    category?: string
  }): MetaConfig {
    // Extract keywords from content
    const contentKeywords = this.extractKeywordsFromText(article.content)
    
    return this.generateMeta({
      title: article.title,
      description: article.excerpt,
      keywords: [
        ...this.defaultConfig.keywords,
        ...(article.tags || []),
        ...contentKeywords
      ],
      image: article.image,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      tags: article.tags
    })
  }

  private extractKeywordsFromText(text: string): string[] {
    // Simple keyword extraction (in a real app, you'd use more sophisticated NLP)
    const words = text
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    // Count word frequency
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // Return top 10 most frequent words
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  generateStructuredData(type: 'organization' | 'localBusiness' | 'service' | 'article', data: Record<string, unknown>) {
    const baseData = {
      "@context": "https://schema.org",
      "name": "گاراژ تخصصی مکانیکی تورنادو",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`
    }

    switch (type) {
      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          "description": this.defaultConfig.description,
          "foundingDate": "2009",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "خیابان ولیعصر، کوچه 15، پلاک 23",
            "addressLocality": "تهران",
            "addressCountry": "IR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98-21-55555555",
            "contactType": "customer service",
            "availableLanguage": "Persian"
          }
        }

      case 'localBusiness':
        return {
          ...baseData,
          "@type": "AutomotiveRepairShop",
          "description": this.defaultConfig.description,
          "telephone": "+98-21-55555555",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "خیابان ولیعصر، کوچه 15، پلاک 23",
            "addressLocality": "تهران",
            "addressCountry": "IR"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
              "opens": "08:00",
              "closes": "18:00"
            }
          ]
        }

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.excerpt,
          "image": data.image,
          "author": {
            "@type": "Organization",
            "name": "گاراژ تخصصی مکانیکی تورنادو"
          },
          "publisher": {
            "@type": "Organization",
            "name": "گاراژ تخصصی مکانیکی تورنادو",
            "logo": {
              "@type": "ImageObject",
              "url": `${this.baseUrl}/logo.png`
            }
          },
          "datePublished": data.publishedAt,
          "dateModified": data.updatedAt
        }

      default:
        return baseData
    }
  }
}

export const metaManager = new MetaManager()
