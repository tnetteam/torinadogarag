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

    // موضوعات پیشرفته و تخصصی
    const advancedTopics = [
      {
        keyword: 'تعمیر موتور خودروهای آلمانی',
        specificTopic: 'تشخیص و تعمیر مشکلات موتور BMW و Mercedes',
        targetAudience: 'expert' as const,
        length: 'long' as const
      },
      {
        keyword: 'تعمیر گیربکس اتوماتیک',
        specificTopic: 'نحوه تعمیر گیربکس CVT و DCT',
        targetAudience: 'intermediate' as const,
        length: 'long' as const
      },
      {
        keyword: 'سیستم برقی خودروهای چینی',
        specificTopic: 'مشکلات رایج سیستم برقی Chery و Geely',
        targetAudience: 'intermediate' as const,
        length: 'medium' as const
      },
      {
        keyword: 'تعمیر سیستم ترمز ABS',
        specificTopic: 'تشخیص و تعمیر سیستم ترمز ضد قفل',
        targetAudience: 'expert' as const,
        length: 'long' as const
      },
      {
        keyword: 'نگهداری موتور دیزل',
        specificTopic: 'نکات مهم نگهداری موتورهای دیزل مدرن',
        targetAudience: 'intermediate' as const,
        length: 'medium' as const
      },
      {
        keyword: 'تعمیر سیستم خنک‌کننده',
        specificTopic: 'تشخیص و تعمیر مشکلات رادیاتور و پمپ آب',
        targetAudience: 'beginner' as const,
        length: 'medium' as const
      },
      {
        keyword: 'تعمیر کولر خودرو',
        specificTopic: 'شارژ گاز و تعمیر کمپرسور کولر',
        targetAudience: 'intermediate' as const,
        length: 'medium' as const
      },
      {
        keyword: 'سیستم تعلیق خودرو',
        specificTopic: 'تعمیر و تنظیم سیستم تعلیق McPherson',
        targetAudience: 'expert' as const,
        length: 'long' as const
      },
      {
        keyword: 'تعمیر سیستم سوخت',
        specificTopic: 'تمیز کردن انژکتور و تنظیم پمپ بنزین',
        targetAudience: 'intermediate' as const,
        length: 'medium' as const
      },
      {
        keyword: 'تشخیص عیب با OBD',
        specificTopic: 'استفاده از دستگاه تشخیص عیب OBD2',
        targetAudience: 'expert' as const,
        length: 'long' as const
      }
    ]
    
    const randomTopic = advancedTopics[Math.floor(Math.random() * advancedTopics.length)]
    
    // تولید محتوا با Gemini
    const generatedContent = await generateCompleteContent(
      {
        keyword: randomTopic.keyword,
        specificTopic: randomTopic.specificTopic,
        type: 'blog',
        length: randomTopic.length,
        targetAudience: randomTopic.targetAudience,
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
    const { action, customRequest } = body

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

    if (action === 'generate-custom') {
      // تولید مقاله سفارشی
      if (!customRequest || !customRequest.keyword) {
        return NextResponse.json({
          success: false,
          message: 'کلمه کلیدی الزامی است'
        }, { status: 400 })
      }

      const settings = readGeminiSettings()
      if (!settings?.apiKey) {
        return NextResponse.json({
          success: false,
          message: 'Gemini API key not configured'
        }, { status: 500 })
      }

      const generatedContent = await generateCompleteContent(
        {
          keyword: customRequest.keyword,
          specificTopic: customRequest.specificTopic,
          type: 'blog',
          length: customRequest.length || 'medium',
          targetAudience: customRequest.targetAudience || 'intermediate',
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
        status: 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const existingPosts = readBlogPosts()
      const updatedPosts = [newPost, ...existingPosts]
      
      const success = writeBlogPosts(updatedPosts)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'مقاله سفارشی با موفقیت تولید شد',
          data: newPost
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'خطا در ذخیره مقاله' 
        }, { status: 500 })
      }
    }

    if (action === 'generate-batch') {
      // تولید چندین مقاله به صورت دسته‌ای
      const { count = 3 } = body
      const generatedPosts: BlogPost[] = []
      
      for (let i = 0; i < count; i++) {
        try {
          const newPost = await generateBlogPostWithAI()
          generatedPosts.push(newPost)
          
          // تاخیر کوتاه بین تولیدات
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error generating post ${i + 1}:`, error)
        }
      }

      if (generatedPosts.length > 0) {
        const existingPosts = readBlogPosts()
        const updatedPosts = [...generatedPosts, ...existingPosts]
        
        const success = writeBlogPosts(updatedPosts)
        
        if (success) {
          return NextResponse.json({
            success: true,
            message: `${generatedPosts.length} مقاله با موفقیت تولید شد`,
            data: generatedPosts
          })
        }
      }

      return NextResponse.json({ 
        success: false, 
        message: 'خطا در تولید مقالات دسته‌ای' 
      }, { status: 500 })
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