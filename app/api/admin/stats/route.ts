import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { sampleBlogPosts, sampleServices, sampleGalleryImages } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate statistics
    const totalBlogPosts = sampleBlogPosts.length
    const publishedPosts = sampleBlogPosts.filter(post => post.status === 'published').length
    const draftPosts = sampleBlogPosts.filter(post => post.status === 'draft').length
    const totalViews = sampleBlogPosts.reduce((sum, post) => sum + post.views, 0)
    const totalLikes = sampleBlogPosts.reduce((sum, post) => sum + post.likes, 0)

    const totalServices = sampleServices.length
    const activeServices = sampleServices.filter(service => service.status === 'active').length

    const totalGalleryImages = sampleGalleryImages.length

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentPosts = sampleBlogPosts.filter(post => 
      new Date(post.date) >= sevenDaysAgo
    ).length

    // Popular categories
    const categoryStats = sampleBlogPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Popular tags
    const tagStats = sampleBlogPosts.reduce((acc, post) => {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const stats = {
      blog: {
        total: totalBlogPosts,
        published: publishedPosts,
        draft: draftPosts,
        totalViews,
        totalLikes,
        recentPosts,
        categoryStats,
        tagStats
      },
      services: {
        total: totalServices,
        active: activeServices
      },
      gallery: {
        total: totalGalleryImages
      },
      general: {
        totalPages: 8, // Home, About, Services, Gallery, Blog, Contact, Admin, etc.
        lastUpdated: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار' },
      { status: 500 }
    )
  }
}
