import { NextRequest, NextResponse } from 'next/server'
import { generateCompleteContent } from '@/lib/gemini-content-generator'
import fs from 'fs'
import path from 'path'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

interface CronSettings {
  enabled: boolean
  interval: 'daily' | 'weekly' | 'monthly'
  postsPerRun: number
  lastRun: string | null
  topics: string[]
}

// خواندن تنظیمات Cron
function readCronSettings(): CronSettings {
  try {
    const cronPath = path.join(process.cwd(), 'data', 'cron-settings.json')
    if (fs.existsSync(cronPath)) {
      const data = fs.readFileSync(cronPath, 'utf8')
      return JSON.parse(data) as CronSettings
    }
  } catch (error) {
    console.error('Error reading cron settings:', error)
  }
  
  // تنظیمات پیش‌فرض
  return {
    enabled: true,
    interval: 'daily', // daily, weekly, monthly
    postsPerRun: 2,
    lastRun: null,
    topics: [
      'تعمیر موتور خودروهای آلمانی',
      'تعمیر گیربکس اتوماتیک',
      'سیستم برقی خودروهای چینی',
      'تعمیر سیستم ترمز ABS',
      'نگهداری موتور دیزل',
      'تعمیر سیستم خنک‌کننده',
      'تعمیر کولر خودرو',
      'سیستم تعلیق خودرو',
      'تعمیر سیستم سوخت',
      'تشخیص عیب با OBD'
    ]
  }
}

// نوشتن تنظیمات Cron
function writeCronSettings(settings: CronSettings): boolean {
  try {
    const cronPath = path.join(process.cwd(), 'data', 'cron-settings.json')
    fs.writeFileSync(cronPath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing cron settings:', error)
    return false
  }
}

// خواندن مقالات وبلاگ
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

// نوشتن مقالات وبلاگ
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

// بررسی نیاز به اجرای Cron
function shouldRunCron(cronSettings: CronSettings): boolean {
  if (!cronSettings.enabled) return false
  
  const now = new Date()
  const lastRun = cronSettings.lastRun ? new Date(cronSettings.lastRun) : null
  
  if (!lastRun) return true
  
  const interval = cronSettings.interval || 'daily'
  const timeDiff = now.getTime() - lastRun.getTime()
  
  switch (interval) {
    case 'daily':
      return timeDiff >= 24 * 60 * 60 * 1000 // 24 hours
    case 'weekly':
      return timeDiff >= 7 * 24 * 60 * 60 * 1000 // 7 days
    case 'monthly':
      return timeDiff >= 30 * 24 * 60 * 60 * 1000 // 30 days
    default:
      return false
  }
}

// تولید مقاله خودکار
async function generateAutoBlogPost(topic: string, geminiApiKey: string): Promise<BlogPost> {
  const generatedContent = await generateCompleteContent(
    {
      keyword: topic,
      type: 'blog',
      length: 'medium',
      targetAudience: 'intermediate',
      city: 'تهران'
    },
    geminiApiKey
  )

  return {
    id: Date.now() + Math.random(),
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
}

// GET - بررسی وضعیت Cron
export async function GET() {
  try {
    const cronSettings = readCronSettings()
    const geminiSettings = readGeminiSettings()
    
    return NextResponse.json({
      success: true,
      data: {
        cronEnabled: cronSettings.enabled,
        geminiConfigured: !!geminiSettings?.apiKey,
        lastRun: cronSettings.lastRun,
        nextRun: shouldRunCron(cronSettings) ? 'اکنون' : 'بعداً',
        interval: cronSettings.interval,
        postsPerRun: cronSettings.postsPerRun
      }
    })
  } catch (error) {
    console.error('Error checking cron status:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در بررسی وضعیت Cron'
    }, { status: 500 })
  }
}

// POST - اجرای Cron Job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, force = false } = body
    
    const cronSettings = readCronSettings()
    const geminiSettings = readGeminiSettings()
    
    if (!geminiSettings?.apiKey) {
      return NextResponse.json({
        success: false,
        message: 'Gemini API key not configured'
      }, { status: 500 })
    }
    
    if (action === 'run-cron') {
      // بررسی نیاز به اجرا
      if (!force && !shouldRunCron(cronSettings)) {
        return NextResponse.json({
          success: false,
          message: 'Cron job قبلاً اجرا شده است'
        }, { status: 400 })
      }
      
      const postsPerRun = cronSettings.postsPerRun || 2
      const topics = cronSettings.topics || []
      const generatedPosts: BlogPost[] = []
      
      // انتخاب موضوعات تصادفی
      const selectedTopics = topics
        .sort(() => 0.5 - Math.random())
        .slice(0, postsPerRun)
      
      // تولید مقالات
      for (const topic of selectedTopics) {
        try {
          const newPost = await generateAutoBlogPost(topic, geminiSettings.apiKey)
          generatedPosts.push(newPost)
          
          // تاخیر کوتاه بین تولیدات
          await new Promise(resolve => setTimeout(resolve, 3000))
        } catch (error) {
          console.error(`Error generating post for topic "${topic}":`, error)
        }
      }
      
      if (generatedPosts.length > 0) {
        // ذخیره مقالات
        const existingPosts = readBlogPosts()
        const updatedPosts = [...generatedPosts, ...existingPosts]
        
        const success = writeBlogPosts(updatedPosts)
        
        if (success) {
          // به‌روزرسانی تنظیمات Cron
          cronSettings.lastRun = new Date().toISOString()
          writeCronSettings(cronSettings)
          
          return NextResponse.json({
            success: true,
            message: `${generatedPosts.length} مقاله با موفقیت تولید شد`,
            data: {
              generatedPosts,
              nextRun: cronSettings.interval === 'daily' ? 'فردا' : 
                      cronSettings.interval === 'weekly' ? 'هفته آینده' : 'ماه آینده'
            }
          })
        }
      }
      
      return NextResponse.json({
        success: false,
        message: 'خطا در تولید مقالات خودکار'
      }, { status: 500 })
    }
    
    if (action === 'update-settings') {
      const { enabled, interval, postsPerRun, topics } = body
      
      if (enabled !== undefined) cronSettings.enabled = enabled
      if (interval) cronSettings.interval = interval
      if (postsPerRun) cronSettings.postsPerRun = postsPerRun
      if (topics) cronSettings.topics = topics
      
      const success = writeCronSettings(cronSettings)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'تنظیمات Cron با موفقیت به‌روزرسانی شد',
          data: cronSettings
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'خطا در به‌روزرسانی تنظیمات'
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'عملیات نامعتبر'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا در اجرای Cron Job'
    }, { status: 500 })
  }
}
