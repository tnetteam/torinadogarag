// SEO Optimizer - سیستم بهینه‌سازی محتوا برای رتبه‌بندی اول گوگل

export interface SEOKeywords {
  primary: string[]
  secondary: string[]
  longTail: string[]
  local: string[]
}

export interface SEOContent {
  title: string
  metaDescription: string
  content: string
  excerpt: string
  keywords: string[]
  headings: {
    h1: string
    h2: string[]
    h3: string[]
  }
  internalLinks: string[]
  externalLinks: string[]
  images: {
    alt: string
    title: string
  }[]
}

// کلمات کلیدی هدف برای رتبه‌بندی اول
export const TARGET_KEYWORDS: SEOKeywords = {
  primary: [
    'مکانیک',
    'گیربکس',
    'سرسیلند',
    'تعمیر',
    'تعمیر ماشین چینی',
    'تعمیر ماشین آلمانی',
    'تعمیر ماشین خارجی'
  ],
  secondary: [
    'تعمیرگاه',
    'گاراژ',
    'تعمیر خودرو',
    'سرویس خودرو',
    'تعمیر موتور',
    'تعمیر ترمز',
    'تعمیر کولر',
    'تعمیر سیستم برقی',
    'تعمیر سیستم تعلیق',
    'تعمیر گیربکس اتوماتیک',
    'تعمیر گیربکس دستی'
  ],
  longTail: [
    'بهترین مکانیک تهران',
    'تعمیرگاه تخصصی خودروهای آلمانی',
    'تعمیر گیربکس BMW',
    'تعمیر گیربکس مرسدس',
    'تعمیر گیربکس آئودی',
    'تعمیر موتور خودروهای چینی',
    'تعمیرگاه تخصصی گیربکس',
    'سرویس خودروهای لوکس',
    'تعمیر سیستم برقی خودرو',
    'تعمیر کولر خودرو در تهران'
  ],
  local: [
    'مکانیک تهران',
    'تعمیرگاه تهران',
    'گاراژ تهران',
    'تعمیر خودرو تهران',
    'سرویس خودرو تهران',
    'تعمیر گیربکس تهران',
    'تعمیر موتور تهران',
    'تعمیر ترمز تهران'
  ]
}

// تولید محتوای SEO بهینه
export function generateSEOContent(
  topic: string,
  keywords: string[]
): SEOContent {
  // تولید عنوان SEO بهینه
  const title = generateSEOTitle(topic, keywords)
  
  // تولید meta description
  const metaDescription = generateMetaDescription(topic, keywords)
  
  // تولید محتوای اصلی
  const content = generateMainContent(topic, keywords)
  
  // تولید headings
  const headings = generateHeadings(topic, keywords)
  
  // تولید لینک‌های داخلی
  const internalLinks = generateInternalLinks(keywords)
  
  // تولید لینک‌های خارجی
  const externalLinks = generateExternalLinks()
  
  // تولید تصاویر
  const images = generateImageData(topic, keywords)
  
  return {
    title,
    metaDescription,
    content,
    excerpt: content.substring(0, 200) + '...',
    keywords,
    headings,
    internalLinks,
    externalLinks,
    images
  }
}

// تولید عنوان SEO بهینه
function generateSEOTitle(topic: string, keywords: string[]): string {
  const primaryKeyword = keywords[0]
  const localKeyword = keywords.find(k => k.includes('تهران')) || ''
  
  const titleTemplates = [
    `تعمیر ${primaryKeyword} | بهترین ${localKeyword} | گاراژ تخصصی تورنادو`,
    `${primaryKeyword} تخصصی | تعمیرگاه ${localKeyword} | گاراژ تورنادو`,
    `تعمیر ${primaryKeyword} در ${localKeyword} | گاراژ تخصصی مکانیکی`,
    `بهترین تعمیرگاه ${primaryKeyword} | ${localKeyword} | گاراژ تورنادو`,
    `تعمیر تخصصی ${primaryKeyword} | ${localKeyword} | گاراژ مکانیکی`
  ]
  
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
}

// تولید meta description
function generateMetaDescription(topic: string, keywords: string[]): string {
  const primaryKeyword = keywords[0]
  const localKeyword = keywords.find(k => k.includes('تهران')) || ''
  
  const descriptionTemplates = [
    `تعمیر تخصصی ${primaryKeyword} در ${localKeyword}. بهترین تعمیرگاه خودروهای آلمانی و چینی. خدمات 24 ساعته، ضمانت کار، قیمت مناسب.`,
    `${primaryKeyword} تخصصی در ${localKeyword}. تعمیرگاه مجهز با متخصصین باتجربه. تعمیر خودروهای BMW، مرسدس، آئودی، چینی.`,
    `بهترین تعمیرگاه ${primaryKeyword} در ${localKeyword}. گاراژ تخصصی تورنادو با 15 سال تجربه. تعمیر گیربکس، موتور، ترمز، کولر.`,
    `تعمیر ${primaryKeyword} با کیفیت عالی در ${localKeyword}. تعمیرگاه تخصصی خودروهای لوکس و چینی. ضمانت کار و قیمت رقابتی.`
  ]
  
  return descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)]
}

// تولید محتوای اصلی
function generateMainContent(topic: string, keywords: string[]): string {
  const primaryKeyword = keywords[0]
  
  const contentSections = [
    generateIntroduction(topic, primaryKeyword),
    generateProblemSection(primaryKeyword),
    generateSolutionSection(primaryKeyword),
    generateProcessSection(primaryKeyword),
    generateBenefitsSection(primaryKeyword),
    generateFAQSection(primaryKeyword),
    generateConclusion(topic, primaryKeyword)
  ]
  
  return contentSections.join('\n\n')
}

// تولید مقدمه
function generateIntroduction(topic: string, primaryKeyword: string): string {
  return `# تعمیر ${primaryKeyword} - راهنمای کامل

تعمیر ${primaryKeyword} یکی از مهم‌ترین خدمات تعمیرگاهی است که نیاز به تخصص و تجربه بالایی دارد. در گاراژ تخصصی تورنادو، ما با بیش از 15 سال تجربه در زمینه تعمیر خودروهای آلمانی و چینی، بهترین خدمات ${primaryKeyword} را ارائه می‌دهیم.

## چرا تعمیر ${primaryKeyword} مهم است؟

${primaryKeyword} یکی از اجزای حیاتی خودرو محسوب می‌شود که عملکرد صحیح آن بر روی عملکرد کلی خودرو تأثیر مستقیم دارد. تعمیر نادرست ${primaryKeyword} می‌تواند منجر به مشکلات جدی و هزینه‌های بالای تعمیر شود.`
}

// تولید بخش مشکلات
function generateProblemSection(primaryKeyword: string): string {
  return `## مشکلات رایج ${primaryKeyword}

### علائم خرابی ${primaryKeyword}:
- **صداهای غیرعادی**: صداهای عجیب و غریب از ${primaryKeyword}
- **لرزش**: لرزش غیرعادی در هنگام رانندگی
- **کاهش عملکرد**: کاهش قدرت و شتاب خودرو
- **مشکل در تعویض دنده**: مشکل در تعویض دنده‌ها
- **نشت روغن**: نشت روغن از ${primaryKeyword}

### علل خرابی ${primaryKeyword}:
1. **عدم سرویس منظم**: عدم تعویض روغن و فیلترها
2. **استفاده نادرست**: رانندگی نامناسب و فشار زیاد
3. **قطعات فرسوده**: فرسودگی طبیعی قطعات
4. **آلودگی**: ورود آلودگی و ذرات خارجی`
}

// تولید بخش راه‌حل
function generateSolutionSection(primaryKeyword: string): string {
  return `## راه‌حل‌های تعمیر ${primaryKeyword}

### خدمات تعمیر ${primaryKeyword} در گاراژ تورنادو:

#### 1. تشخیص عیب تخصصی
- استفاده از تجهیزات پیشرفته تشخیص
- بررسی کامل ${primaryKeyword}
- ارائه گزارش دقیق از وضعیت

#### 2. تعمیر تخصصی
- تعمیر ${primaryKeyword} با قطعات اصل
- استفاده از ابزارهای تخصصی
- تعمیر توسط متخصصین باتجربه

#### 3. سرویس و نگهداری
- تعویض روغن ${primaryKeyword}
- تعویض فیلترها
- تنظیم و کالیبراسیون

### مزایای تعمیر ${primaryKeyword} در گاراژ تورنادو:
- ✅ **ضمانت کار**: ضمانت 6 ماهه بر روی تعمیرات
- ✅ **قیمت مناسب**: قیمت‌های رقابتی و منصفانه
- ✅ **خدمات 24 ساعته**: خدمات اضطراری در تمام ساعات
- ✅ **قطعات اصل**: استفاده از قطعات با کیفیت
- ✅ **متخصصین باتجربه**: تیم متخصص با 15 سال تجربه`
}

// تولید بخش فرآیند
function generateProcessSection(primaryKeyword: string): string {
  return `## فرآیند تعمیر ${primaryKeyword}

### مراحل تعمیر ${primaryKeyword}:

#### مرحله 1: تشخیص اولیه
- بررسی علائم خرابی
- تست عملکرد ${primaryKeyword}
- تشخیص اولیه مشکل

#### مرحله 2: بازرسی کامل
- باز کردن ${primaryKeyword}
- بررسی تمام قطعات
- شناسایی قطعات معیوب

#### مرحله 3: تعمیر
- تعویض قطعات معیوب
- تعمیر قطعات قابل تعمیر
- مونتاژ مجدد ${primaryKeyword}

#### مرحله 4: تست و کالیبراسیون
- تست عملکرد ${primaryKeyword}
- کالیبراسیون سیستم
- تست نهایی

#### مرحله 5: تحویل
- تست رانندگی
- ارائه گارانتی
- تحویل خودرو به مشتری`
}

// تولید بخش مزایا
function generateBenefitsSection(primaryKeyword: string): string {
  return `## مزایای تعمیر ${primaryKeyword} در گاراژ تورنادو

### چرا گاراژ تورنادو را انتخاب کنید؟

#### 1. تخصص و تجربه
- بیش از 15 سال تجربه در تعمیر ${primaryKeyword}
- تیم متخصص و آموزش دیده
- استفاده از جدیدترین تکنولوژی‌ها

#### 2. کیفیت خدمات
- استفاده از قطعات اصل و با کیفیت
- ضمانت کار بر روی تمام تعمیرات
- خدمات پس از فروش کامل

#### 3. قیمت مناسب
- قیمت‌های رقابتی و منصفانه
- تخفیف‌های ویژه برای مشتریان دائمی
- امکان پرداخت اقساطی

#### 4. خدمات کامل
- خدمات 24 ساعته
- خدمات اضطراری
- خدمات در محل (در صورت نیاز)

### انواع خودروهای قابل تعمیر:
- **خودروهای آلمانی**: BMW، مرسدس بنز، آئودی، فولکس واگن
- **خودروهای چینی**: چری، جک، BYD، جیلی
- **خودروهای ژاپنی**: تویوتا، هوندا، نیسان
- **خودروهای کره‌ای**: هیوندای، کیا`
}

// تولید بخش سوالات متداول
function generateFAQSection(primaryKeyword: string): string {
  return `## سوالات متداول درباره تعمیر ${primaryKeyword}

### سوالات رایج مشتریان:

#### سوال 1: تعمیر ${primaryKeyword} چقدر طول می‌کشد؟
**پاسخ**: مدت زمان تعمیر ${primaryKeyword} بستگی به نوع خرابی دارد. معمولاً بین 1 تا 3 روز کاری طول می‌کشد.

#### سوال 2: آیا بر روی تعمیر ${primaryKeyword} گارانتی ارائه می‌دهید؟
**پاسخ**: بله، ما بر روی تمام تعمیرات ${primaryKeyword} گارانتی 6 ماهه ارائه می‌دهیم.

#### سوال 3: قیمت تعمیر ${primaryKeyword} چقدر است؟
**پاسخ**: قیمت تعمیر ${primaryKeyword} بستگی به نوع خرابی و قطعات مورد نیاز دارد. برای اطلاع از قیمت دقیق، با ما تماس بگیرید.

#### سوال 4: آیا قطعات اصل استفاده می‌کنید؟
**پاسخ**: بله، ما از قطعات اصل و با کیفیت استفاده می‌کنیم و گارانتی قطعات را نیز ارائه می‌دهیم.

#### سوال 5: آیا خدمات اضطراری ارائه می‌دهید؟
**پاسخ**: بله، ما خدمات اضطراری 24 ساعته ارائه می‌دهیم. در صورت نیاز، با ما تماس بگیرید.`
}

// تولید نتیجه‌گیری
function generateConclusion(topic: string, primaryKeyword: string): string {
  return `## نتیجه‌گیری

تعمیر ${primaryKeyword} نیاز به تخصص و تجربه بالایی دارد. در گاراژ تخصصی تورنادو، ما با تیم متخصص و تجهیزات پیشرفته، بهترین خدمات تعمیر ${primaryKeyword} را ارائه می‌دهیم.

### تماس با ما:
- **آدرس**: تهران، خیابان ولیعصر
- **تلفن**: 021-12345678
- **موبایل**: 09123456789
- **ایمیل**: info@tornado-garage.com
- **ساعات کاری**: 24 ساعته

### خدمات ما:
- تعمیر ${primaryKeyword}
- سرویس و نگهداری خودرو
- تعمیر موتور
- تعمیر ترمز
- تعمیر کولر
- تعمیر سیستم برقی

برای دریافت مشاوره رایگان و اطلاع از قیمت‌ها، با ما تماس بگیرید.`
}

// تولید headings
function generateHeadings(topic: string, keywords: string[]): { h1: string; h2: string[]; h3: string[] } {
  const primaryKeyword = keywords[0]
  
  return {
    h1: `تعمیر ${primaryKeyword} - راهنمای کامل`,
    h2: [
      `چرا تعمیر ${primaryKeyword} مهم است؟`,
      `مشکلات رایج ${primaryKeyword}`,
      `راه‌حل‌های تعمیر ${primaryKeyword}`,
      `فرآیند تعمیر ${primaryKeyword}`,
      `مزایای تعمیر ${primaryKeyword} در گاراژ تورنادو`,
      `سوالات متداول درباره تعمیر ${primaryKeyword}`,
      `نتیجه‌گیری`
    ],
    h3: [
      `علائم خرابی ${primaryKeyword}`,
      `علل خرابی ${primaryKeyword}`,
      `تشخیص عیب تخصصی`,
      `تعمیر تخصصی`,
      `سرویس و نگهداری`,
      `مرحله 1: تشخیص اولیه`,
      `مرحله 2: بازرسی کامل`,
      `مرحله 3: تعمیر`,
      `مرحله 4: تست و کالیبراسیون`,
      `مرحله 5: تحویل`
    ]
  }
}

// تولید لینک‌های داخلی
function generateInternalLinks(keywords: string[]): string[] {
  const baseLinks = [
    '/services',
    '/about',
    '/contact',
    '/gallery',
    '/blog'
  ]
  
  const keywordLinks = keywords.map(keyword => 
    `/blog/${keyword.replace(/\s+/g, '-')}`
  )
  
  return [...baseLinks, ...keywordLinks]
}

// تولید لینک‌های خارجی
function generateExternalLinks(): string[] {
  return [
    'https://www.bmw.com',
    'https://www.mercedes-benz.com',
    'https://www.audi.com',
    'https://www.volkswagen.com',
    'https://www.toyota.com'
  ]
}

// تولید داده تصاویر
function generateImageData(topic: string, keywords: string[]): { alt: string; title: string }[] {
  const primaryKeyword = keywords[0]
  
  return [
    {
      alt: `تعمیر ${primaryKeyword} در گاراژ تخصصی تورنادو`,
      title: `تعمیر ${primaryKeyword} - گاراژ تورنادو`
    },
    {
      alt: `تعمیرگاه تخصصی ${primaryKeyword} تهران`,
      title: `تعمیرگاه ${primaryKeyword} - تهران`
    },
    {
      alt: `متخصصین تعمیر ${primaryKeyword}`,
      title: `متخصصین ${primaryKeyword} - گاراژ تورنادو`
    }
  ]
}

// تولید محتوای SEO برای کلمات کلیدی خاص
export function generateKeywordSpecificContent(keyword: string): SEOContent {
  const keywords = [keyword, ...TARGET_KEYWORDS.secondary.slice(0, 3)]
  return generateSEOContent(keyword, keywords)
}

// تولید محتوای محلی SEO
export function generateLocalSEOContent(keyword: string, city: string = 'تهران'): SEOContent {
  const localKeywords = [
    `${keyword} ${city}`,
    `تعمیرگاه ${city}`,
    `گاراژ ${city}`,
    ...TARGET_KEYWORDS.local
  ]
  return generateSEOContent(`${keyword} ${city}`, localKeywords)
}
