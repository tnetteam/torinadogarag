import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

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

interface NewsPost {
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


export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Read data files
    const dataDir = join(process.cwd(), 'data')
    
    // Blog posts data
    let blogPosts = []
    try {
      const blogPath = join(dataDir, 'blog-posts.json')
      if (existsSync(blogPath)) {
        blogPosts = JSON.parse(readFileSync(blogPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading blog posts:', error)
    }

    // News posts data
    let newsPosts = []
    try {
      const newsPath = join(dataDir, 'news-posts.json')
      if (existsSync(newsPath)) {
        newsPosts = JSON.parse(readFileSync(newsPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading news posts:', error)
    }

    // Services data
    let services = []
    try {
      const servicesPath = join(dataDir, 'services.json')
      if (existsSync(servicesPath)) {
        services = JSON.parse(readFileSync(servicesPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading services:', error)
    }

    // Gallery images data
    let galleryImages = []
    try {
      const galleryPath = join(dataDir, 'gallery-images.json')
      if (existsSync(galleryPath)) {
        galleryImages = JSON.parse(readFileSync(galleryPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading gallery images:', error)
    }

    // Contact messages data
    let contactMessages = []
    try {
      const contactPath = join(dataDir, 'contact-messages.json')
      if (existsSync(contactPath)) {
        contactMessages = JSON.parse(readFileSync(contactPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading contact messages:', error)
    }

    // Categories data
    let categories = []
    try {
      const categoriesPath = join(dataDir, 'categories.json')
      if (existsSync(categoriesPath)) {
        categories = JSON.parse(readFileSync(categoriesPath, 'utf8'))
      }
    } catch (error) {
      console.error('Error reading categories:', error)
    }

    // Calculate statistics
    const totalBlogPosts = blogPosts.length
    const publishedBlogPosts = blogPosts.filter((post: BlogPost) => post.status === 'published').length
    const draftBlogPosts = blogPosts.filter((post: BlogPost) => post.status === 'draft').length
    
    const totalNewsPosts = newsPosts.length
    const publishedNewsPosts = newsPosts.filter((post: NewsPost) => post.status === 'published').length
    const draftNewsPosts = newsPosts.filter((post: NewsPost) => post.status === 'draft').length
    
    const totalViews = blogPosts.reduce((sum: number, post: BlogPost) => sum + (post.views || 0), 0) + 
                      newsPosts.reduce((sum: number, post: NewsPost) => sum + (post.views || 0), 0)

    const totalServices = services.length
    const activeServices = services.filter((service: Service) => service.status === 'active').length

    const totalGalleryImages = galleryImages.length

    const totalContactMessages = contactMessages.length
    const unreadMessages = contactMessages.filter((msg: ContactMessage) => msg.status === 'new').length

    // Recent activity
    const recentActivity = [
      ...blogPosts.slice(-3).map((post: BlogPost) => ({
        type: 'blog',
        title: `مقاله "${post.title}" ${post.status === 'published' ? 'منتشر شد' : 'به‌روزرسانی شد'}`,
        date: post.date || new Date().toISOString(),
        icon: '📝'
      })),
      ...newsPosts.slice(-3).map((post: NewsPost) => ({
        type: 'news',
        title: `خبر "${post.title}" ${post.status === 'published' ? 'منتشر شد' : 'به‌روزرسانی شد'}`,
        date: post.date || new Date().toISOString(),
        icon: '📰'
      })),
      ...galleryImages.slice(-2).map((image: GalleryImage) => ({
        type: 'gallery',
        title: `تصویر "${image.title || 'بدون نام'}" به گالری اضافه شد`,
        date: image.createdAt || new Date().toISOString(),
        icon: '🖼️'
      })),
      ...contactMessages.slice(-2).map((msg: ContactMessage) => ({
        type: 'contact',
        title: `پیام جدید از ${msg.name}`,
        date: msg.createdAt || new Date().toISOString(),
        icon: '📧'
      }))
    ].sort((a, b) => new Date(b.date || new Date().toISOString()).getTime() - new Date(a.date || new Date().toISOString()).getTime()).slice(0, 10)

    // Monthly statistics (last 6 months)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })
      
      // Simulate some data for demonstration
      monthlyStats.push({
        month,
        blogViews: Math.floor(Math.random() * 1000) + 500,
        newMessages: Math.floor(Math.random() * 20) + 5,
        newImages: Math.floor(Math.random() * 10) + 2
      })
    }

    const dashboardData = {
      stats: {
        totalBlogPosts,
        publishedBlogPosts,
        draftBlogPosts,
        totalNewsPosts,
        publishedNewsPosts,
        draftNewsPosts,
        totalViews,
        totalServices,
        activeServices,
        totalGalleryImages,
        totalContactMessages,
        unreadMessages
      },
      recentActivity,
      monthlyStats,
      blogPosts: blogPosts, // All blog posts
      newsPosts: newsPosts.slice(-5), // Last 5 news posts
      services: services.slice(-5), // Last 5 services
      galleryImages: galleryImages.slice(-5), // Last 5 gallery images
      contactMessages: contactMessages.slice(-5), // Last 5 contact messages
      categories: categories // All categories
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات داشبورد' },
      { status: 500 }
    )
  }
}
