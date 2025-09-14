// Cron Scheduler - سیستم زمان‌بندی خودکار
import { generateCompleteContent } from './gemini-content-generator'
import fs from 'fs'
import path from 'path'

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

interface CronSettings {
  enabled: boolean
  interval: 'daily' | 'weekly' | 'monthly'
  postsPerRun: number
  lastRun: string | null
  topics: string[]
  scheduleTime?: string // زمان اجرا (مثل "09:00")
  timezone?: string // منطقه زمانی
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
    interval: 'daily',
    postsPerRun: 2,
    lastRun: null,
    scheduleTime: '09:00',
    timezone: 'Asia/Tehran',
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

// اجرای Cron Job
export async function runCronJob(): Promise<{ success: boolean; message: string; data?: { postsGenerated: number; generatedPosts: string[]; nextRun?: string } }> {
  try {
    const cronSettings = readCronSettings()
    const geminiSettings = readGeminiSettings()
    
    if (!geminiSettings?.apiKey) {
      return {
        success: false,
        message: 'Gemini API key not configured'
      }
    }
    
    if (!shouldRunCron(cronSettings)) {
      return {
        success: false,
        message: 'Cron job already executed recently'
      }
    }
    
    const postsPerRun = cronSettings.postsPerRun || 2
    const topics = cronSettings.topics || []
    const generatedPosts: BlogPost[] = []
    
    // انتخاب موضوعات تصادفی
    const selectedTopics = topics
      .sort(() => 0.5 - Math.random())
      .slice(0, postsPerRun)
    
    console.log(`🚀 Starting cron job - generating ${selectedTopics.length} posts...`)
    
    // تولید مقالات
    for (const topic of selectedTopics) {
      try {
        console.log(`📝 Generating post for topic: ${topic}`)
        const newPost = await generateAutoBlogPost(topic, geminiSettings.apiKey)
        generatedPosts.push(newPost)
        
        // تاخیر کوتاه بین تولیدات
        await new Promise(resolve => setTimeout(resolve, 3000))
      } catch (error) {
        console.error(`❌ Error generating post for topic "${topic}":`, error)
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
        
        console.log(`✅ Cron job completed - ${generatedPosts.length} posts generated`)
        
        return {
          success: true,
          message: `${generatedPosts.length} مقاله با موفقیت تولید شد`,
          data: {
            postsGenerated: generatedPosts.length,
            generatedPosts: generatedPosts.map(post => post.title),
            nextRun: cronSettings.interval === 'daily' ? 'فردا' : 
                    cronSettings.interval === 'weekly' ? 'هفته آینده' : 'ماه آینده'
          }
        }
      }
    }
    
    return {
      success: false,
      message: 'خطا در تولید مقالات خودکار'
    }
    
  } catch (error) {
    console.error('❌ Cron job error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطا در اجرای Cron Job'
    }
  }
}

// شروع سیستم Cron
let cronInterval: NodeJS.Timeout | null = null

export function startCronScheduler(): void {
  if (cronInterval) {
    console.log('⚠️ Cron scheduler already running')
    return
  }
  
  console.log('🕐 Starting cron scheduler...')
  
  // اجرای اولیه
  runCronJob().then(result => {
    if (result.success) {
      console.log('✅ Initial cron job completed:', result.message)
    } else {
      console.log('⚠️ Initial cron job failed:', result.message)
    }
  })
  
  // اجرای هر ساعت یکبار برای بررسی
  cronInterval = setInterval(async () => {
    const result = await runCronJob()
    if (result.success) {
      console.log('✅ Scheduled cron job completed:', result.message)
    }
  }, 60 * 60 * 1000) // هر ساعت
  
  console.log('✅ Cron scheduler started - checking every hour')
}

// توقف سیستم Cron
export function stopCronScheduler(): void {
  if (cronInterval) {
    clearInterval(cronInterval)
    cronInterval = null
    console.log('🛑 Cron scheduler stopped')
  }
}

// بررسی وضعیت Cron
export function getCronStatus(): { running: boolean; lastRun: string | null; nextRun: string } {
  const cronSettings = readCronSettings()
  const lastRun = cronSettings.lastRun
  const nextRun = shouldRunCron(cronSettings) ? 'اکنون' : 'بعداً'
  
  return {
    running: cronInterval !== null,
    lastRun,
    nextRun
  }
}
