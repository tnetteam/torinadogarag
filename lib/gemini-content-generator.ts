// Gemini Content Generator - سیستم تولید محتوا با Google Gemini

export interface GeminiContentRequest {
  keyword: string
  type: 'blog' | 'service'
  length: 'short' | 'medium' | 'long'
  city?: string
  specificTopic?: string
  targetAudience?: 'beginner' | 'intermediate' | 'expert'
}

export interface GeneratedContent {
  title: string
  content: string
  excerpt: string
  metaDescription: string
  keywords: string[]
  category: string
  image: string
  author: string
  status: 'draft' | 'published'
  publishedAt: string
  createdAt: string
  updatedAt: string
  readTime: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  tools: string[]
  safetyNotes: string[]
  costEstimate?: string
  timeEstimate?: string
}

// تولید محتوا با Gemini API واقعی
export async function generateContentWithGemini(
  request: GeminiContentRequest,
  geminiApiKey: string
): Promise<string> {
  try {
    const prompt = createAdvancedPrompt(request)
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    // Fallback to sample content if API fails
    return generateFallbackContent(request)
  }
}

// ایجاد پرامپت پیشرفته برای Gemini
function createAdvancedPrompt(request: GeminiContentRequest): string {
  const difficulty = request.targetAudience || 'intermediate'
  const length = request.length || 'medium'
  
  const lengthInstructions = {
    short: 'حدود 800-1200 کلمه',
    medium: 'حدود 1500-2500 کلمه', 
    long: 'حدود 3000-4000 کلمه'
  }

  const difficultyInstructions = {
    beginner: 'برای مبتدیان و صاحبان خودرو که تجربه کمی دارند',
    intermediate: 'برای افرادی که تجربه متوسطی در تعمیر خودرو دارند',
    expert: 'برای مکانیک‌های حرفه‌ای و متخصصان'
  }

  return `شما یک متخصص مکانیک خودرو با 20 سال تجربه هستید که برای یک گاراژ تخصصی مکانیکی در تهران محتوا می‌نویسید.

موضوع مقاله: ${request.keyword}
${request.specificTopic ? `زیرموضوع خاص: ${request.specificTopic}` : ''}

لطفاً یک مقاله کامل و عمیق بنویسید که:

1. **طول محتوا**: ${lengthInstructions[length]}
2. **سطح مخاطب**: ${difficultyInstructions[difficulty]}
3. **ساختار مقاله**:
   - مقدمه جذاب و کاربردی
   - توضیح کامل مشکل و علل آن
   - مراحل گام‌به‌گام تعمیر (با جزئیات فنی)
   - ابزارهای مورد نیاز (با برندهای معتبر)
   - نکات ایمنی مهم
   - هزینه‌های تقریبی
   - زمان مورد نیاز
   - علائم هشدار دهنده
   - راه‌های پیشگیری
   - نتیجه‌گیری عملی

4. **ویژگی‌های محتوا**:
   - استفاده از اصطلاحات فنی صحیح
   - مثال‌های عملی و واقعی
   - اشاره به خودروهای آلمانی و چینی
   - قیمت‌های به‌روز (ریال)
   - آدرس‌های مکانی در تهران
   - شماره‌های تماس مفید

5. **نکات مهم**:
   - محتوا باید کاملاً عملی و قابل اجرا باشد
   - از کلمات کلیدی SEO استفاده کنید
   - جملات کوتاه و قابل فهم
   - استفاده از بولت پوینت و شماره‌گذاری
   - ذکر برندهای معتبر قطعات

لطفاً مقاله را به صورت Markdown بنویسید و از تگ‌های مناسب استفاده کنید.`
}

// محتوای جایگزین در صورت خطای API
function generateFallbackContent(request: GeminiContentRequest): string {
  return `# ${request.keyword} - راهنمای کامل

## مقدمه
${request.keyword} یکی از مهم‌ترین بخش‌های خودرو است که نیاز به نگهداری و تعمیر منظم دارد. در این مقاله به بررسی کامل این موضوع می‌پردازیم.

## ابزارهای مورد نیاز
- آچارهای مختلف
- پیچ‌گوشتی
- ابزارهای تشخیصی
- تجهیزات ایمنی

## مراحل کار
1. بررسی اولیه
2. تشخیص مشکل
3. تعمیر یا تعویض
4. تست عملکرد

## نکات ایمنی
- همیشه از تجهیزات ایمنی استفاده کنید
- قبل از شروع کار، باتری را جدا کنید
- در محیطی با تهویه مناسب کار کنید

## نتیجه‌گیری
با رعایت نکات ایمنی و استفاده از ابزارهای مناسب، می‌توانید ${request.keyword} را به درستی تعمیر کنید.`
}

// تولید تصویر با Gemini
export async function generateImageWithGemini(): Promise<string> {
  // تصاویر حذف شدند
  return ''
}

// تولید محتوای کامل
export async function generateCompleteContent(
  request: GeminiContentRequest,
  geminiApiKey: string
): Promise<GeneratedContent> {
  try {
    // تولید محتوا
    const content = await generateContentWithGemini(request, geminiApiKey)
    
    // تولید تصویر
    const image = await generateImageWithGemini()
    
    // استخراج اطلاعات از محتوا
    const extractedInfo = extractContentInfo(content)
    
    // تولید excerpt هوشمند
    const excerpt = generateSmartExcerpt(content, request.keyword)
    
    // تولید meta description
    const metaDescription = generateMetaDescription(content, request.keyword)
    
    // محاسبه زمان مطالعه
    const readTime = calculateReadTime(content)
    
    return {
      title: extractTitle(content),
      content: content,
      excerpt: excerpt,
      metaDescription: metaDescription,
      keywords: getKeywordsForRequest(request),
      category: getCategoryForKeyword(request.keyword),
      image: image,
      author: 'متخصص مکانیک تورنادو',
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: readTime,
      difficulty: request.targetAudience || 'intermediate',
      tools: extractedInfo.tools,
      safetyNotes: extractedInfo.safetyNotes,
      costEstimate: extractedInfo.costEstimate,
      timeEstimate: extractedInfo.timeEstimate
    }
  } catch (error) {
    console.error('Error generating complete content:', error)
    throw error
  }
}

// استخراج عنوان از محتوا
function extractTitle(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.trim().startsWith('# ')) {
      return line.trim().substring(2)
    }
  }
  return 'مقاله جدید'
}

// تعیین دسته‌بندی بر اساس کلمه کلیدی
function getCategoryForKeyword(keyword: string): string {
  if (keyword.includes('موتور')) return 'تعمیر موتور'
  if (keyword.includes('گیربکس')) return 'تعمیر گیربکس'
  if (keyword.includes('ترمز')) return 'تعمیر ترمز'
  if (keyword.includes('کولر')) return 'تعمیر کولر'
  if (keyword.includes('برقی')) return 'تعمیر سیستم برقی'
  return 'تعمیر عمومی'
}

// تولید کلمات کلیدی برای درخواست
function getKeywordsForRequest(request: GeminiContentRequest): string[] {
  const primaryKeywords = [
    'مکانیک',
    'گیربکس',
    'سرسیلند',
    'تعمیر',
    'تعمیر ماشین چینی',
    'تعمیر ماشین آلمانی',
    'تعمیر ماشین خارجی'
  ]

  const secondaryKeywords = [
    'تعمیرگاه',
    'گاراژ',
    'تعمیر خودرو',
    'سرویس خودرو',
    'تهران مکانیک',
    'تعمیرگاه تهران'
  ]

  const localKeywords = [
    'مکانیک تهران',
    'تعمیرگاه تهران',
    'گاراژ تهران'
  ]

  const keywords = [
    request.keyword,
    ...primaryKeywords.slice(0, 3),
    ...secondaryKeywords.slice(0, 3),
    ...localKeywords.slice(0, 2)
  ]

  return Array.from(new Set(keywords))
}

// استخراج اطلاعات از محتوا
function extractContentInfo(content: string): {
  tools: string[]
  safetyNotes: string[]
  costEstimate?: string
  timeEstimate?: string
} {
  const tools: string[] = []
  const safetyNotes: string[] = []
  let costEstimate: string | undefined
  let timeEstimate: string | undefined

  const lines = content.split('\n')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // استخراج ابزارها
    if (trimmedLine.includes('ابزار') || trimmedLine.includes('وسایل')) {
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        tools.push(trimmedLine.replace(/^[-•]\s*/, ''))
      }
    }
    
    // استخراج نکات ایمنی
    if (trimmedLine.includes('ایمنی') || trimmedLine.includes('هشدار')) {
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        safetyNotes.push(trimmedLine.replace(/^[-•]\s*/, ''))
      }
    }
    
    // استخراج هزینه
    if (trimmedLine.includes('هزینه') || trimmedLine.includes('قیمت')) {
      costEstimate = trimmedLine
    }
    
    // استخراج زمان
    if (trimmedLine.includes('زمان') || trimmedLine.includes('مدت')) {
      timeEstimate = trimmedLine
    }
  }

  return {
    tools: tools.slice(0, 10), // حداکثر 10 ابزار
    safetyNotes: safetyNotes.slice(0, 5), // حداکثر 5 نکته ایمنی
    costEstimate,
    timeEstimate
  }
}

// تولید excerpt هوشمند
function generateSmartExcerpt(content: string, keyword: string): string {
  // پیدا کردن پاراگراف اول که شامل کلمه کلیدی باشد
  const paragraphs = content.split('\n\n')
  
  for (const paragraph of paragraphs) {
    if (paragraph.includes(keyword) && paragraph.length > 100) {
      return paragraph.substring(0, 200) + '...'
    }
  }
  
  // اگر پاراگراف مناسب پیدا نشد، از ابتدای محتوا استفاده کن
  return content.substring(0, 200) + '...'
}

// تولید meta description
function generateMetaDescription(content: string, keyword: string): string {
  const excerpt = generateSmartExcerpt(content, keyword)
  return excerpt.substring(0, 150) + '...'
}

// محاسبه زمان مطالعه
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200 // سرعت متوسط مطالعه فارسی
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  if (minutes < 5) return 'کمتر از 5 دقیقه'
  if (minutes < 10) return '5-10 دقیقه'
  if (minutes < 15) return '10-15 دقیقه'
  return `${minutes} دقیقه`
}