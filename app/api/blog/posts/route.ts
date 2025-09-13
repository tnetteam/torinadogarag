import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BLOG_POSTS_FILE_PATH = path.join(process.cwd(), 'data', 'blog-posts.json')

interface BlogPost {
  id: number
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  status: 'published' | 'draft'
  views: number
  likes: number
  image?: string
  imageAlt?: string
  slug: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  createdAt: string
  updatedAt: string
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize blog posts file if it doesn't exist
if (!fs.existsSync(BLOG_POSTS_FILE_PATH)) {
  const initialPosts = [
    {
      id: 1,
      title: "نکات مهم برای نگهداری خودروهای آلمانی",
      content: "خودروهای آلمانی به دلیل کیفیت بالا و تکنولوژی پیشرفته نیاز به نگهداری خاصی دارند. در این مقاله نکات مهم نگهداری را بررسی می‌کنیم.",
      author: "مهندس احمد محمدی",
      category: "نگهداری",
      tags: ["نگهداری", "خودروهای آلمانی", "BMW", "Mercedes"],
      status: "published",
      views: 0,
      likes: 0,
      image: "/images/blog-placeholder.jpg",
      imageAlt: "نگهداری خودروهای آلمانی",
      slug: "german-cars-maintenance",
      seoTitle: "نگهداری خودروهای آلمانی - نکات مهم",
      seoDescription: "راهنمای کامل نگهداری خودروهای آلمانی شامل BMW، Mercedes و Audi",
      keywords: ["نگهداری خودرو", "خودروهای آلمانی", "BMW", "Mercedes"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  fs.writeFileSync(BLOG_POSTS_FILE_PATH, JSON.stringify(initialPosts, null, 2))
}

function readBlogPosts(): BlogPost[] {
  try {
    const data = fs.readFileSync(BLOG_POSTS_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

function getPublishedBlogPosts(): BlogPost[] {
  return readBlogPosts().filter(post => post.status === 'published')
}

function getBlogPostById(id: number): BlogPost | undefined {
  return readBlogPosts().find(post => post.id === id)
}

function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return readBlogPosts().filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

function getBlogPostsByCategory(category: string): BlogPost[] {
  return readBlogPosts().filter(post => post.category === category)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (id) {
      // Get single blog post
      const post = getBlogPostById(parseInt(id))
      if (!post) {
        return NextResponse.json(
          { success: false, message: 'مقاله مورد نظر یافت نشد' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: post
      })
    }

    let posts = getPublishedBlogPosts()

    // Apply filters
    if (search) {
      posts = searchBlogPosts(search)
    }

    if (category) {
      posts = getBlogPostsByCategory(category)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = posts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        hasNext: endIndex < posts.length,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Blog posts API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت مقالات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'author', 'category']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `فیلدهای الزامی: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // In a real application, you would save to database
    const newPost = {
      id: Date.now(),
      ...body,
      date: new Date().toISOString(),
      views: 0,
      likes: 0,
      status: 'published'
    }

    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت ایجاد شد',
      data: newPost
    })

  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد مقاله' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه مقاله الزامی است' },
        { status: 400 }
      )
    }

    // In a real application, you would update in database
    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت به‌روزرسانی شد',
      data: { id, ...updateData }
    })

  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی مقاله' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه مقاله الزامی است' },
        { status: 400 }
      )
    }

    // In a real application, you would delete from database
    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت حذف شد'
    })

  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در حذف مقاله' },
      { status: 500 }
    )
  }
}
