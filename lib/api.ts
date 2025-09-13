// API utilities and configuration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Type definitions
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

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
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

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}


// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API client class
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: HttpMethod
      body?: unknown
      headers?: Record<string, string>
      params?: Record<string, string>
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      params = {}
    } = options

    // Build URL with query parameters
    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url.toString(), requestOptions)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.error || 'خطا در درخواست',
          response.status,
          data.code
        )
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'خطا در ارتباط با سرور',
        500,
        'NETWORK_ERROR'
      )
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }
}

// Create default API client instance
export const apiClient = new ApiClient()

// Blog API functions
export const blogApi = {
  // Get all blog posts
  async getPosts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }): Promise<ApiResponse<BlogPost[]>> {
    return apiClient.get('/blog/posts', params as Record<string, string>)
  },

  // Get single blog post
  async getPost(id: string | number): Promise<ApiResponse<BlogPost>> {
    return apiClient.get(`/blog/posts/${id}`)
  },

  // Create new blog post
  async createPost(data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    return apiClient.post('/blog/posts', data)
  },

  // Update blog post
  async updatePost(id: string | number, data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    return apiClient.put(`/blog/posts/${id}`, data)
  },

  // Delete blog post
  async deletePost(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/blog/posts/${id}`)
  },

  // Generate blog post with AI
  async generatePost(topic: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.post('/blog/generate', { topic })
  },

  // Auto-generate daily posts
  async autoGenerate(): Promise<ApiResponse<BlogPost[]>> {
    return apiClient.post('/blog/auto-generate')
  }
}

// Services API functions
export const servicesApi = {
  // Get all services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return apiClient.get('/services')
  },

  // Get single service
  async getService(id: string | number): Promise<ApiResponse<Service>> {
    return apiClient.get(`/services/${id}`)
  },

  // Create new service
  async createService(data: Partial<Service>): Promise<ApiResponse<Service>> {
    return apiClient.post('/services', data)
  },

  // Update service
  async updateService(id: string | number, data: Partial<Service>): Promise<ApiResponse<Service>> {
    return apiClient.put(`/services/${id}`, data)
  },

  // Delete service
  async deleteService(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/services/${id}`)
  }
}

// Gallery API functions
export const galleryApi = {
  // Get all gallery images
  async getImages(): Promise<ApiResponse<GalleryImage[]>> {
    return apiClient.get('/gallery')
  },

  // Upload new image
  async uploadImage(file: File, category: string): Promise<ApiResponse<GalleryImage>> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('category', category)

    return apiClient.post('/gallery/upload', formData)
  },

  // Delete image
  async deleteImage(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/gallery/${id}`)
  }
}

// Contact API functions
export const contactApi = {
  // Submit contact form
  async submitForm(data: Partial<ContactMessage>): Promise<ApiResponse<ContactMessage>> {
    return apiClient.post('/contact', data)
  },

  // Get contact messages (admin)
  async getMessages(): Promise<ApiResponse<ContactMessage[]>> {
    return apiClient.get('/contact/messages')
  }
}

// Admin API functions
export const adminApi = {
  // Get dashboard stats
  async getStats(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get('/admin/stats')
  },

  // Get system settings
  async getSettings(): Promise<ApiResponse<Settings>> {
    return apiClient.get('/admin/settings')
  },

  // Update system settings
  async updateSettings(data: Partial<Settings>): Promise<ApiResponse<Settings>> {
    return apiClient.put('/admin/settings', data)
  }
}

// Error handling utility
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }

  return 'خطای غیرمنتظره رخ داد'
}

// Retry utility for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

// Custom error class
export class ApiError extends Error {
  public status: number
  public code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
