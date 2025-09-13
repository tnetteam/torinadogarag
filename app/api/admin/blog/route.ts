import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

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

    // Read blog posts data
    const dataDir = join(process.cwd(), 'data')
    const blogPath = join(dataDir, 'blog-posts.json')
    
    let blogPosts: BlogPost[] = []
    if (existsSync(blogPath)) {
      blogPosts = JSON.parse(readFileSync(blogPath, 'utf8'))
    }

    return NextResponse.json({
      success: true,
      data: blogPosts
    })

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت مقالات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, postData, postId } = body

    const dataDir = join(process.cwd(), 'data')
    const blogPath = join(dataDir, 'blog-posts.json')
    
    // Read current blog posts
    let blogPosts: BlogPost[] = []
    if (existsSync(blogPath)) {
      blogPosts = JSON.parse(readFileSync(blogPath, 'utf8'))
    }

    if (action === 'create') {
      // Add new post
      const newPost = {
        ...postData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        excerpt: postData.excerpt || postData.content?.substring(0, 150) + '...' || 'بدون توضیحات',
        views: 0,
        readTime: Math.ceil(postData.content.length / 200) + ' دقیقه',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      blogPosts.unshift(newPost)
    } else if (action === 'update') {
      // Update existing post
      const index = blogPosts.findIndex((post: BlogPost) => post.id === postId)
      if (index !== -1) {
        blogPosts[index] = { 
          ...blogPosts[index], 
          ...postData,
          excerpt: postData.excerpt || postData.content?.substring(0, 150) + '...' || blogPosts[index].excerpt,
          updatedAt: new Date().toISOString()
        }
      }
    } else if (action === 'delete') {
      // Delete post
      blogPosts = blogPosts.filter((post: BlogPost) => post.id !== postId)
    }

    // Write updated data back to file
    writeFileSync(blogPath, JSON.stringify(blogPosts, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: action === 'create' ? 'مقاله ایجاد شد' : 
               action === 'update' ? 'مقاله به‌روزرسانی شد' : 
               'مقاله حذف شد',
      data: blogPosts
    })

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در عملیات' },
      { status: 500 }
    )
  }
}
