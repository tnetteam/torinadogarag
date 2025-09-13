// Application configuration and environment variables

export interface AppConfig {
  // Site information
  site: {
    name: string
    url: string
    description: string
    keywords: string[]
    author: string
    language: string
    direction: 'rtl' | 'ltr'
  }

  // API configuration
  api: {
    baseUrl: string
    timeout: number
    retryAttempts: number
  }


  // Admin configuration
  admin: {
    secretKey: string
    sessionTimeout: number
  }

  // Cache configuration
  cache: {
    ttl: number
    maxSize: number
    cleanupInterval: number
  }

  // Email configuration
  email: {
    smtp: {
      host: string
      port: number
      user: string
      pass: string
    }
    from: string
    replyTo: string
  }

  // Analytics
  analytics: {
    googleAnalyticsId?: string
    googleSearchConsole?: string
  }

  // Social media
  social: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }

  // Contact information
  contact: {
    phone: string
    mobile: string
    email: string
    address: string
    workingHours: string
  }

  // Features
  features: {
    blog: boolean
    gallery: boolean
    contactForm: boolean
    adminPanel: boolean
    autoBlogGeneration: boolean
  }
}

// Default configuration
const defaultConfig: AppConfig = {
  site: {
    name: 'گاراژ تخصصی مکانیکی',
    url: 'https://مgarage-website.ir',
    description: 'گاراژ تخصصی مکانیکی با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی',
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
      'نگهداری خودرو'
    ],
    author: 'گاراژ تخصصی مکانیکی',
    language: 'fa',
    direction: 'rtl'
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    retryAttempts: 3
  },


  admin: {
    secretKey: process.env.ADMIN_SECRET_KEY || 'default-secret-key',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
  },

  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    cleanupInterval: 5 * 60 * 1000 // 5 minutes
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    },
    from: process.env.EMAIL_FROM || 'noreply@garage-website.ir',
    replyTo: process.env.EMAIL_REPLY_TO || 'info@garage-website.ir'
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleSearchConsole: process.env.GOOGLE_SITE_VERIFICATION
  },

  social: {
    instagram: process.env.INSTAGRAM_URL,
    facebook: process.env.FACEBOOK_URL,
    twitter: process.env.TWITTER_URL,
    linkedin: process.env.LINKEDIN_URL
  },

  contact: {
    phone: '021-12345678',
    mobile: '0912-345-6789',
    email: 'info@garage-website.ir',
    address: 'تهران، خیابان ولیعصر، پلاک 123',
    workingHours: 'شنبه تا پنج‌شنبه: 8:00 - 18:00، جمعه: 8:00 - 14:00'
  },

  features: {
    blog: true,
    gallery: true,
    contactForm: true,
    adminPanel: true,
    autoBlogGeneration: true
  }
}

// Configuration class
export class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  private constructor() {
    this.config = { ...defaultConfig }
    this.loadFromEnvironment()
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  private loadFromEnvironment(): void {
    // Override with environment variables
    if (process.env.NEXT_PUBLIC_SITE_NAME) {
      this.config.site.name = process.env.NEXT_PUBLIC_SITE_NAME
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      this.config.site.url = process.env.NEXT_PUBLIC_SITE_URL
    }

    if (process.env.NEXT_PUBLIC_SITE_DESCRIPTION) {
      this.config.site.description = process.env.NEXT_PUBLIC_SITE_DESCRIPTION
    }

    // Load contact information from environment
    if (process.env.CONTACT_PHONE) {
      this.config.contact.phone = process.env.CONTACT_PHONE
    }

    if (process.env.CONTACT_MOBILE) {
      this.config.contact.mobile = process.env.CONTACT_MOBILE
    }

    if (process.env.CONTACT_EMAIL) {
      this.config.contact.email = process.env.CONTACT_EMAIL
    }

    if (process.env.CONTACT_ADDRESS) {
      this.config.contact.address = process.env.CONTACT_ADDRESS
    }
  }

  public getConfig(): AppConfig {
    return { ...this.config }
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key]
  }

  public set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value
  }

  public update(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // Validation
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check required fields
    if (!this.config.admin.secretKey || this.config.admin.secretKey === 'default-secret-key') {
      errors.push('Admin secret key should be set for security')
    }

    if (!this.config.contact.phone && !this.config.contact.mobile) {
      errors.push('At least one contact phone number is required')
    }

    if (!this.config.contact.email) {
      errors.push('Contact email is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Get public configuration (safe to expose to client)
  public getPublicConfig(): Partial<AppConfig> {
    return {
      site: this.config.site,
      contact: this.config.contact,
      social: this.config.social,
      features: this.config.features,
      analytics: {
        googleAnalyticsId: this.config.analytics.googleAnalyticsId
      }
    }
  }
}

// Global configuration instance
export const config = ConfigManager.getInstance()

// Utility functions
export function getSiteUrl(path: string = ''): string {
  const baseUrl = config.get('site').url
  return path ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : baseUrl
}

export function getApiUrl(endpoint: string = ''): string {
  const baseUrl = config.get('api').baseUrl
  return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}` : baseUrl
}

export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return config.get('features')[feature]
}

export function getContactInfo(): AppConfig['contact'] {
  return config.get('contact')
}

export function getSocialLinks(): AppConfig['social'] {
  return config.get('social')
}

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'

// Build information
export const buildInfo = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown'
}
