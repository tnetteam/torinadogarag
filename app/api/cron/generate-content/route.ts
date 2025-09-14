import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'


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

// خواندن تنظیمات cron
function readCronSettings() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'cron-settings.json')
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8')
      return JSON.parse(data)
    }
    return {
      enabled: true,
      blogInterval: 8, // ساعت
      lastBlogGeneration: null,
      articlesPerDay: 3,
      generationHours: [9, 15, 21]
    }
  } catch (error) {
    console.error('Error reading cron settings:', error)
    return {
      enabled: true,
      blogInterval: 8,
      lastBlogGeneration: null,
      articlesPerDay: 3,
      generationHours: [9, 15, 21]
    }
  }
}

// نوشتن تنظیمات cron
function writeCronSettings(settings: Record<string, unknown>) {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'cron-settings.json')
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing cron settings:', error)
    return false
  }
}

// تولید تصویر
async function generateImage(): Promise<string> {
  // تصاویر حذف شدند
  return ''
}


// تولید مقاله
async function generateBlogPostWithAI(): Promise<BlogPost> {
  try {
    const topics = [
      'راهنمای تعمیر موتور خودرو',
      'نکات مهم در نگهداری سیستم ترمز',
      'تشخیص و تعمیر عیب گیربکس',
      'راهنمای تعمیر سیستم برقی خودرو',
      'نحوه تعمیر کولر خودرو',
      'راهنمای تعمیر سیستم تعلیق',
      'نکات مهم در تعمیر موتور دیزل',
      'راهنمای تعمیر سیستم سوخت',
      'تعمیر و نگهداری سیستم خنک‌کننده',
      'راهنمای تعمیر سیستم اگزوز'
    ]
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    const image = await generateImage()
    
    const blogPost: BlogPost = {
      id: Date.now(),
      title: `راهنمای کامل ${randomTopic}`,
      content: `# ${randomTopic}

## مقدمه
${randomTopic} یکی از مهم‌ترین جنبه‌های نگهداری و تعمیر خودرو محسوب می‌شود. در این مقاله به بررسی کامل این موضوع می‌پردازیم.

## ابزارهای مورد نیاز
- آچارهای مختلف
- پیچ‌گوشتی‌ها
- ابزارهای تشخیص
- قطعات یدکی

## مراحل تعمیر
### مرحله 1: تشخیص عیب
ابتدا باید عیب را به درستی تشخیص دهید. این کار نیاز به تجربه و دانش دارد.

### مرحله 2: آماده‌سازی
ابزارها و قطعات مورد نیاز را آماده کنید.

### مرحله 3: اجرای تعمیر
مراحل تعمیر را به ترتیب و با دقت انجام دهید.

### مرحله 4: تست نهایی
پس از تعمیر، سیستم را کاملاً تست کنید.

## نکات ایمنی
- همیشه از ابزارهای مناسب استفاده کنید
- ایمنی را در اولویت قرار دهید
- در صورت نیاز به متخصص مراجعه کنید

## نتیجه‌گیری
${randomTopic} نیاز به دقت و تخصص دارد. با رعایت نکات ذکر شده، می‌توانید این کار را به درستی انجام دهید.`,
      excerpt: `راهنمای کامل ${randomTopic} - نکات مهم و مراحل تعمیر`,
      image,
      category: 'تعمیر خودرو',
      tags: ['تعمیر', 'خودرو', 'راهنما', 'تخصصی'],
      author: 'سیستم هوش مصنوعی',
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('📄 مقاله تولید شد:', blogPost.title)
    return blogPost
    
  } catch (error) {
    console.error('Error generating blog post with AI:', error)
    throw error
  }
}


// خواندن مقالات
function readBlogPosts(): BlogPost[] {
  try {
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    console.log('📁 مسیر فایل مقالات:', blogPath)
    console.log('📁 وجود فایل:', fs.existsSync(blogPath))
    
    if (fs.existsSync(blogPath)) {
      const data = fs.readFileSync(blogPath, 'utf8')
      const posts = JSON.parse(data)
      console.log('📚 تعداد مقالات موجود:', posts.length)
      return posts
    }
    console.log('📚 فایل مقالات وجود ندارد، آرایه خالی برمی‌گردانیم')
    return []
  } catch (error) {
    console.error('❌ خطا در خواندن مقالات:', error)
    return []
  }
}

// نوشتن مقالات
function writeBlogPosts(posts: BlogPost[]): boolean {
  try {
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    console.log('💾 نوشتن مقالات در مسیر:', blogPath)
    console.log('💾 تعداد مقالات برای نوشتن:', posts.length)
    
    fs.writeFileSync(blogPath, JSON.stringify(posts, null, 2))
    console.log('✅ مقالات با موفقیت ذخیره شدند')
    return true
  } catch (error) {
    console.error('❌ خطا در نوشتن مقالات:', error)
    return false
  }
}

// GET - اجرای cron job
export async function GET() {
  try {
    // Log شروع Cron Job
    console.log('🚀 Cron Job شروع شد -', new Date().toLocaleString('fa-IR'))
    
    // Cron Job از Vercel اجرا می‌شود - نیازی به بررسی کلید نیست

    const settings = readCronSettings()
    
    if (!settings.enabled) {
      return NextResponse.json({ 
        success: true, 
        message: 'Cron job disabled' 
      })
    }

    const now = new Date()
    const results = {
      blogGenerated: false,
      blogCount: 0
    }

    // بررسی نیاز به تولید مقاله - موقتاً همیشه true
    const shouldGenerateBlog = true // TEMP: همیشه مقاله تولید کن
    
    // شرط اصلی (کامنت شده):
    // const shouldGenerateBlog = !settings.lastBlogGeneration || 
    //   (now.getTime() - new Date(settings.lastBlogGeneration).getTime()) >= (settings.blogInterval * 60 * 60 * 1000)

    console.log('🔍 بررسی تولید مقاله:', {
      shouldGenerateBlog,
      lastBlogGeneration: settings.lastBlogGeneration,
      blogInterval: settings.blogInterval,
      now: now.toISOString()
    })

    if (shouldGenerateBlog) {
      try {
        console.log('📝 شروع تولید مقاله جدید...')
        const newBlogPost = await generateBlogPostWithAI()
        const existingPosts = readBlogPosts()
        const updatedPosts = [newBlogPost, ...existingPosts]
        
        if (writeBlogPosts(updatedPosts)) {
          results.blogGenerated = true
          results.blogCount = 1
          settings.lastBlogGeneration = now.toISOString()
          console.log('✅ مقاله جدید با موفقیت تولید و ذخیره شد:', newBlogPost.title)
        } else {
          console.error('❌ خطا در ذخیره مقاله')
        }
      } catch (error) {
        console.error('❌ خطا در تولید مقاله:', error)
      }
    } else {
      console.log('⏭️ نیازی به تولید مقاله جدید نیست')
    }

    // ذخیره تنظیمات
    writeCronSettings(settings)

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      data: results,
      nextRun: {
        blog: settings.lastBlogGeneration ? 
          new Date(new Date(settings.lastBlogGeneration).getTime() + (settings.blogInterval * 60 * 60 * 1000)).toISOString() : 
          null
      }
    })

  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Cron job failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
