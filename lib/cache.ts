// Cache management utilities for better performance

// Type definitions
interface ApiResponse<T> {
  success: boolean
  data: T
}

type BlogPostsApiResponse = ApiResponse<BlogPost[]>
type ServicesApiResponse = ApiResponse<Service[]>
interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  category: string
  tags: string[]
  image?: string
  views: number
  readTime: string
  status: string
  createdAt: string
  updatedAt: string
}

interface Service {
  id: number
  name: string
  description: string
  phone: string
  status: string
  icon: string
  features: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

interface GalleryImage {
  id: number
  title: string
  description?: string
  imageUrl: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    instagram?: string
    telegram?: string
    whatsapp?: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface CacheItem<T = unknown> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds (default: 5 minutes)
  maxSize?: number // Maximum number of items in cache
}

export class MemoryCache {
  private cache = new Map<string, CacheItem>()
  private maxSize: number
  private defaultTTL: number

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100
    this.defaultTTL = options.ttl || 5 * 60 * 1000 // 5 minutes
  }

  // Set cache item
  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete cache item
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Clean expired items
  clean(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => {
      this.cache.delete(key)
    })
  }
}

// Global cache instance
export const globalCache = new MemoryCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
})

// Cache decorator for functions
export function cached<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    // Try to get from cache first
    const cached = globalCache.get<ReturnType<T>>(key)
    if (cached !== null) {
      return Promise.resolve(cached)
    }

    // Execute function and cache result
    const result = fn(...args)
    
    // Handle both sync and async functions
    if (result instanceof Promise) {
      return result.then((data) => {
        globalCache.set(key, data, ttl)
        return data
      })
    } else {
      globalCache.set(key, result, ttl)
      return result
    }
  }) as T
}

// Cache utilities for specific data types
export const cacheUtils = {
  // Blog posts cache
  blogPosts: {
    get: (key: string) => globalCache.get<BlogPost[]>(`blog_posts_${key}`),
    set: (key: string, data: BlogPost[], ttl?: number) => 
      globalCache.set(`blog_posts_${key}`, data, ttl),
    delete: (key: string) => globalCache.delete(`blog_posts_${key}`)
  },

  // Services cache
  services: {
    get: () => globalCache.get<Service[]>('services'),
    set: (data: Service[], ttl?: number) => globalCache.set('services', data, ttl),
    delete: () => globalCache.delete('services')
  },

  // Gallery images cache
  gallery: {
    get: () => globalCache.get<GalleryImage[]>('gallery'),
    set: (data: GalleryImage[], ttl?: number) => globalCache.set('gallery', data, ttl),
    delete: () => globalCache.delete('gallery')
  },

  // Site settings cache
  settings: {
    get: () => globalCache.get<Settings>('settings'),
    set: (data: Settings, ttl?: number) => globalCache.set('settings', data, ttl),
    delete: () => globalCache.delete('settings')
  }
}

// Cache invalidation strategies
export const cacheInvalidation = {
  // Invalidate all blog-related cache
  invalidateBlog: () => {
    const keys = globalCache.keys()
    keys.forEach(key => {
      if (key.startsWith('blog_posts_')) {
        globalCache.delete(key)
      }
    })
  },

  // Invalidate all cache
  invalidateAll: () => {
    globalCache.clear()
  },

  // Invalidate by pattern
  invalidateByPattern: (pattern: string) => {
    const keys = globalCache.keys()
    keys.forEach(key => {
      if (key.includes(pattern)) {
        globalCache.delete(key)
      }
    })
  }
}

// Cache warming utilities
export const cacheWarming = {
  // Warm up blog posts cache
  warmBlogPosts: async (apiClient: { get: (endpoint: string) => Promise<{ data: BlogPost[] }> }) => {
    try {
      const response = await apiClient.get('/blog/posts')
      if ((response as BlogPostsApiResponse).success) {
        cacheUtils.blogPosts.set('all', response.data, 10 * 60 * 1000) // 10 minutes
      }
    } catch (error) {
      console.error('Error warming blog posts cache:', error)
    }
  },

  // Warm up services cache
  warmServices: async (apiClient: { get: (endpoint: string) => Promise<{ data: Service[] }> }) => {
    try {
      const response = await apiClient.get('/services')
      if ((response as ServicesApiResponse).success) {
        cacheUtils.services.set(response.data, 30 * 60 * 1000) // 30 minutes
      }
    } catch (error) {
      console.error('Error warming services cache:', error)
    }
  },

  // Warm up all caches
  warmAll: async (apiClient: { get: (endpoint: string) => Promise<{ data: unknown }> }) => {
    await Promise.all([
      cacheWarming.warmBlogPosts(apiClient as { get: (endpoint: string) => Promise<BlogPostsApiResponse> }),
      cacheWarming.warmServices(apiClient as { get: (endpoint: string) => Promise<ServicesApiResponse> })
    ])
  }
}

// Cache statistics
export const cacheStats = {
  get: () => ({
    size: globalCache.size(),
    keys: globalCache.keys(),
    memoryUsage: process.memoryUsage?.() || null
  }),

  // Clean expired items and return stats
  cleanup: () => {
    globalCache.clean()
    return cacheStats.get()
  }
}

// Auto-cleanup interval (clean expired items every 5 minutes)
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    globalCache.clean()
  }, 5 * 60 * 1000)
}
