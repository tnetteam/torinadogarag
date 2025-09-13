import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { generateCompleteContent } from '@/lib/gemini-content-generator'

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  author: string
  status: 'draft' | 'published'
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// خواندن تنظیمات Gemini
function readGeminiSettings() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'gemini-settings.json')
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading Gemini settings:', error)
  }
  return null
}

// خواندن مقالات وبلاگ از فایل
function readBlogPosts(): BlogPost[] {
  try {
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    if (fs.existsSync(blogPath)) {
      const data = fs.readFileSync(blogPath, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// نوشتن مقالات وبلاگ در فایل
function writeBlogPosts(posts: BlogPost[]): boolean {
  try {
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    fs.writeFileSync(blogPath, JSON.stringify(posts, null, 2))
    return true
  } catch (error) {
    console.error('Error writing blog posts:', error)
    return false
  }
}

// تولید مقاله با Gemini
async function generateBlogPostWithAI(): Promise<BlogPost> {
  try {
    const settings = readGeminiSettings()
    
    if (!settings?.apiKey) {
      throw new Error('Gemini API key not configured')
    }

    const topics = [
      'نحوه تعمیر موتور خودرو',
      'راهنمای تعمیر سیستم ترمز',
      'نکات مهم در نگهداری خودرو',
      'تشخیص عیب گیربکس اتوماتیک',
      'تعمیر سیستم برقی خودرو',
      'راهنمای تعمیر کولر خودرو',
      'نحوه تعمیر سیستم تعلیق',
      'راهنمای تعمیر موتور دیزل',
      'نکات مهم در تعمیر سیستم سوخت',
      'راهنمای تعمیر سیستم خنک‌کننده'
    ]
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    
    // تولید محتوا با Gemini
    const generatedContent = await generateCompleteContent(
      {
        keyword: randomTopic,
        type: 'blog',
        length: 'long',
        city: 'تهران'
      },
      settings.apiKey
    )

    const newPost: BlogPost = {
      id: Date.now(),
      title: generatedContent.title,
      content: generatedContent.content,
      excerpt: generatedContent.excerpt,
      image: generatedContent.image,
      category: generatedContent.category,
      tags: generatedContent.keywords,
      author: generatedContent.author,
      status: generatedContent.status,
      publishedAt: generatedContent.publishedAt,
      createdAt: generatedContent.createdAt,
      updatedAt: generatedContent.updatedAt
    }

    return newPost
  } catch (error) {
    console.error('Error generating blog post:', error)
    throw error
  }
}

// GET - دریافت آمار محتوا
export async function GET() {
  try {
    const blogPosts = readBlogPosts()
    
    const today = new Date().toISOString().split('T')[0]
    const todayPosts = blogPosts.filter(post => 
      post.createdAt.split('T')[0] === today
    )

        return NextResponse.json({
          success: true,
      data: {
        totalBlogPosts: blogPosts.length,
        todayBlogPosts: todayPosts.length,
        lastUpdate: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching AI content stats:', error)
        return NextResponse.json({ 
          success: false, 
      message: 'خطا در دریافت آمار محتوا'
        }, { status: 500 })
      }
}

// POST - تولید محتوا
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'generate-blog') {
      // تولید مقاله جدید
      const newBlogPost = await generateBlogPostWithAI()
      const existingPosts = readBlogPosts()
      const updatedPosts = [newBlogPost, ...existingPosts]
      
      const success = writeBlogPosts(updatedPosts)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'مقاله با موفقیت تولید شد',
          data: newBlogPost
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'خطا در ذخیره مقاله' 
        }, { status: 500 })
      }
    }

      return NextResponse.json({ 
        success: false, 
        message: 'عملیات نامعتبر' 
      }, { status: 400 })
  } catch (error) {
    console.error('Error in AI content generation:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا در تولید محتوا'
    }, { status: 500 })
  }
}