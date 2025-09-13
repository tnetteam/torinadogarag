// Gemini Content Generator - سیستم تولید محتوا با Google Gemini

export interface GeminiContentRequest {
  keyword: string
  type: 'blog' | 'service'
  length: 'short' | 'medium' | 'long'
  city?: string
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
}

// تولید محتوا با Gemini
export async function generateContentWithGemini(
  request: GeminiContentRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _geminiApiKey: string
): Promise<string> {
  try {
    // برای تست، محتوای نمونه برمی‌گردانیم
    const sampleContent = `# ${request.keyword}

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

    return sampleContent
  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
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
    
    // تولید excerpt
    const excerpt = content.substring(0, 200) + '...'
    
    // تولید meta description
    const metaDescription = content.substring(0, 150) + '...'
    
    return {
      title: extractTitle(content),
      content: content,
      excerpt: excerpt,
      metaDescription: metaDescription,
      keywords: getKeywordsForRequest(request),
      category: getCategoryForKeyword(request.keyword),
      image: image,
      author: 'هوش مصنوعی Gemini',
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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