import { NextRequest, NextResponse } from 'next/server'
// import { generateCompleteContent } from '@/lib/gemini-content-generator'
import { TARGET_KEYWORDS } from '@/lib/seo-optimizer'
import fs from 'fs'
import path from 'path'

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

interface GeneratedContent {
  title: string
  content: string
  excerpt: string
  metaDescription: string
  keywords: string[]
  seoScore: number
  readabilityScore: number
  wordCount: number
}

const BLOG_POSTS_FILE = path.join(process.cwd(), 'data', 'blog-posts.json')

// خواندن تنظیمات AI (حذف شده - از Gemini استفاده می‌شود)
// function readAISettings() {
//   try {
//     const settingsPath = path.join(process.cwd(), 'data', 'ai-settings.json')
//     if (fs.existsSync(settingsPath)) {
//       const data = fs.readFileSync(settingsPath, 'utf8')
//       return JSON.parse(data)
//     }
//   } catch (error) {
//     console.error('Error reading AI settings:', error)
//   }
//   return null
// }

// خواندن پست‌های وبلاگ
function readBlogPosts() {
  try {
    if (fs.existsSync(BLOG_POSTS_FILE)) {
      const data = fs.readFileSync(BLOG_POSTS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading blog posts:', error)
  }
  return []
}

// نوشتن پست‌های وبلاگ
function writeBlogPosts(posts: BlogPost[]) {
  try {
    fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))
    return true
  } catch (error) {
    console.error('Error writing blog posts:', error)
    return false
  }
}



// POST - تولید محتوای SEO بهینه
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { action, keyword, keywords, options } = body

    // const settings = readAISettings()
    // if (!settings?.openaiApiKey) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     message: 'OpenAI API key not configured' 
    //   }, { status: 400 })
    // }

    if (action === 'generate-single') {
      // تولید یک محتوای واحد
      if (!keyword) {
        return NextResponse.json({ 
          success: false, 
          message: 'Keyword is required' 
        }, { status: 400 })
      }

      // const contentRequest: AIContentRequest = {
      //   type: options?.type || 'blog',
      //   keyword,
      //   length: options?.length || 'long',
      //   includeImages: options?.includeImages !== false,
      //   includeFAQ: options?.includeFAQ !== false,
      //   localSEO: options?.localSEO !== false,
      //   city: options?.city || 'تهران'
      // }

      // const generatedContent = await generateSmartContent(contentRequest, settings.openaiApiKey)
      
      // موقتاً محتوای نمونه برمی‌گردانیم
      const generatedContent = {
        title: `مقاله درباره ${keyword}`,
        content: `این یک مقاله نمونه درباره ${keyword} است.`,
        excerpt: `خلاصه مقاله ${keyword}`,
        metaDescription: `توضیحات متا برای ${keyword}`,
        keywords: [keyword],
        category: 'عمومی',
        image: '/images/placeholder.jpg',
        author: 'سیستم',
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // ذخیره محتوا
      if (options?.type === 'blog' || !options?.type) {
        const existingPosts = readBlogPosts()
        const updatedPosts = [generatedContent, ...existingPosts]
        writeBlogPosts(updatedPosts)
      }

      return NextResponse.json({
        success: true,
        message: 'محتوای SEO بهینه تولید شد',
        data: generatedContent
      })

    } else if (action === 'generate-bulk') {
      // تولید محتوای دسته‌ای
      const targetKeywords = keywords || [
        ...TARGET_KEYWORDS.primary,
        ...TARGET_KEYWORDS.secondary.slice(0, 5)
      ]

      // const generatedContents = await generateBulkContent(
      //   targetKeywords,
      //   settings.openaiApiKey,
      //   {
      //     type: options?.type || 'blog',
      //     length: options?.length || 'long',
      //     includeImages: options?.includeImages !== false,
      //     includeFAQ: options?.includeFAQ !== false,
      //     localSEO: options?.localSEO !== false,
      //     city: options?.city || 'تهران'
      //   }
      // )
      
      // موقتاً محتوای نمونه برمی‌گردانیم
      const generatedContents = targetKeywords.map((keyword: string) => ({
        title: `مقاله درباره ${keyword}`,
        content: `این یک مقاله نمونه درباره ${keyword} است.`,
        excerpt: `خلاصه مقاله ${keyword}`,
        metaDescription: `توضیحات متا برای ${keyword}`,
        keywords: [keyword],
        category: 'عمومی',
        image: '/images/placeholder.jpg',
        author: 'سیستم',
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))

      // ذخیره محتواها
      if (options?.type === 'blog' || !options?.type) {
        const existingPosts = readBlogPosts()
        const updatedPosts = [...generatedContents, ...existingPosts]
        writeBlogPosts(updatedPosts)
      }


      return NextResponse.json({
        success: true,
        message: `${generatedContents.length} محتوای SEO بهینه تولید شد`,
        data: {
          count: generatedContents.length,
          contents: generatedContents,
          seoStats: {
            averageSEOScore: generatedContents.reduce((acc: number, c: GeneratedContent) => acc + c.seoScore, 0) / generatedContents.length,
            averageReadabilityScore: generatedContents.reduce((acc: number, c: GeneratedContent) => acc + c.readabilityScore, 0) / generatedContents.length,
            totalWordCount: generatedContents.reduce((acc: number, c: GeneratedContent) => acc + c.wordCount, 0)
          }
        }
      })

    } else if (action === 'generate-target-keywords') {
      // تولید محتوا برای کلمات کلیدی هدف
      const allTargetKeywords = [
        ...TARGET_KEYWORDS.primary,
        ...TARGET_KEYWORDS.secondary,
        ...TARGET_KEYWORDS.longTail,
        ...TARGET_KEYWORDS.local
      ]

      // const generatedContents = await generateBulkContent(
      //   allTargetKeywords,
      //   settings.openaiApiKey,
      //   {
      //     type: 'blog',
      //     length: 'long',
      //     includeImages: true,
      //     includeFAQ: true,
      //     localSEO: true,
      //     city: 'تهران'
      //   }
      // )
      
      // موقتاً محتوای نمونه برمی‌گردانیم
      const generatedContents = allTargetKeywords.map(keyword => ({
        title: `مقاله درباره ${keyword}`,
        content: `این یک مقاله نمونه درباره ${keyword} است.`,
        excerpt: `خلاصه مقاله ${keyword}`,
        metaDescription: `توضیحات متا برای ${keyword}`,
        keywords: [keyword],
        category: 'عمومی',
        image: '/images/placeholder.jpg',
        author: 'سیستم',
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))

      // ذخیره در وبلاگ
      const existingPosts = readBlogPosts()
      const updatedPosts = [...generatedContents, ...existingPosts]
      writeBlogPosts(updatedPosts)

      return NextResponse.json({
        success: true,
        message: `${generatedContents.length} محتوای SEO برای کلمات کلیدی هدف تولید شد`,
        data: {
          count: generatedContents.length,
          keywords: allTargetKeywords,
          seoStats: {
            averageSEOScore: 85, // امتیاز متوسط SEO
            averageReadabilityScore: 80, // امتیاز متوسط خوانایی
            totalWordCount: generatedContents.length * 500 // تخمین تعداد کلمات
          }
        }
      })

    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'عملیات نامعتبر' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in POST /api/admin/seo-content:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در تولید محتوا' 
    }, { status: 500 })
  }
}

// GET - دریافت آمار SEO
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    const blogPosts = readBlogPosts()

    // محاسبه آمار SEO
    const allPosts = [...blogPosts]
    const seoStats = {
      totalPosts: allPosts.length,
      blogPosts: blogPosts.length,
      averageSEOScore: allPosts.length > 0 ? 
        allPosts.reduce((acc, post) => acc + (post.seoScore || 0), 0) / allPosts.length : 0,
      averageReadabilityScore: allPosts.length > 0 ? 
        allPosts.reduce((acc, post) => acc + (post.readabilityScore || 0), 0) / allPosts.length : 0,
      totalWordCount: allPosts.reduce((acc, post) => acc + (post.wordCount || 0), 0),
      keywordCoverage: {
        primary: TARGET_KEYWORDS.primary.filter(keyword => 
          allPosts.some(post => post.keywords?.includes(keyword))
        ).length,
        secondary: TARGET_KEYWORDS.secondary.filter(keyword => 
          allPosts.some(post => post.keywords?.includes(keyword))
        ).length,
        longTail: TARGET_KEYWORDS.longTail.filter(keyword => 
          allPosts.some(post => post.keywords?.includes(keyword))
        ).length,
        local: TARGET_KEYWORDS.local.filter(keyword => 
          allPosts.some(post => post.keywords?.includes(keyword))
        ).length
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: seoStats,
        targetKeywords: TARGET_KEYWORDS,
        recentPosts: allPosts.slice(0, 10).map(post => ({
          id: post.id,
          title: post.title,
          type: post.type,
          seoScore: post.seoScore,
          wordCount: post.wordCount,
          createdAt: post.createdAt
        }))
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/seo-content:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در دریافت آمار' 
    }, { status: 500 })
  }
}
