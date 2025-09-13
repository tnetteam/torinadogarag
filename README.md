# گاراژ تخصصی مکانیکی - وب‌سایت حرفه‌ای

یک وب‌سایت مدرن و بهینه برای گاراژ تخصصی مکانیکی با قابلیت‌های پیشرفته SEO و سیستم وبلاگ خودکار.

## ✨ ویژگی‌ها

### 🎨 طراحی و رابط کاربری
- طراحی مدرن و ریسپانسیو
- رنگ‌بندی حرفه‌ای (آبی + نارنجی)
- فونت‌های زیبا (Inter + Poppins)
- انیمیشن‌های نرم و جذاب
- سازگار با تمام دستگاه‌ها

### 🚀 عملکرد و بهینه‌سازی
- سرعت لود بالا (Static Export)
- بهینه‌سازی کامل برای SEO
- Schema.org markup
- Core Web Vitals عالی
- بدون نیاز به سرور مجازی

### 📝 سیستم وبلاگ
- مدیریت مقالات از پنل ادمین
- بهینه‌سازی SEO
- دسته‌بندی و تگ‌گذاری
- جستجو و فیلتر

### 🔧 خدمات تخصصی
- تعمیر موتور خودروهای آلمانی و چینی
- تعمیر گیربکس دستی و اتوماتیک
- سیستم برقی و الکترونیکی
- سیستم ترمز و خنک‌کننده
- سرویس دوره‌ای و نگهداری

### 👨‍💼 پنل مدیریت
- داشبورد کامل
- مدیریت مقالات وبلاگ
- مدیریت خدمات
- مدیریت گالری تصاویر
- تنظیمات سایت

## 🛠️ تکنولوژی‌های استفاده شده

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Styling:** Tailwind CSS + Custom Components
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Deployment:** Static Export (قابل اجرا روی هر هاستی)

## 📦 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+ 
- npm یا yarn

### مراحل نصب

1. **کلون کردن پروژه:**
```bash
git clone <repository-url>
cd garage-website
```

2. **نصب وابستگی‌ها:**
```bash
npm install
# یا
yarn install
```

3. **اجرای پروژه در حالت توسعه:**
```bash
npm run dev
# یا
yarn dev
```

4. **ساخت پروژه برای تولید:**
```bash
npm run build
npm run export
# یا
yarn build
yarn export
```

## 🚀 استقرار (Deployment)

این پروژه به صورت Static Export ساخته شده و قابل اجرا روی هر هاستی است:

### هاست معمولی
1. فایل‌های `out/` را آپلود کنید
2. تنظیمات هاست را برای SPA تنظیم کنید

### Netlify
```bash
npm run build && npm run export
# فایل‌های out/ را به Netlify آپلود کنید
```

### Vercel
```bash
vercel --prod
```

## 📁 ساختار پروژه

```
garage-website/
├── app/                    # Next.js App Router
│   ├── admin/             # پنل مدیریت
│   ├── blog/              # صفحات وبلاگ
│   ├── globals.css        # استایل‌های全局
│   ├── layout.tsx         # Layout اصلی
│   └── page.tsx           # صفحه اصلی
├── components/            # کامپوننت‌های React
│   ├── Header.tsx         # هدر سایت
│   ├── Footer.tsx         # فوتر سایت
│   ├── Hero.tsx           # بخش Hero
│   ├── Services.tsx       # بخش خدمات
│   ├── About.tsx          # بخش درباره ما
│   ├── Gallery.tsx        # گالری تصاویر
│   ├── BlogPreview.tsx    # پیش‌نمایش وبلاگ
│   ├── BlogList.tsx       # لیست مقالات
│   ├── Contact.tsx        # فرم تماس
│   └── AdminDashboard.tsx # پنل مدیریت
├── public/                # فایل‌های استاتیک
├── package.json           # وابستگی‌ها
├── tailwind.config.js     # تنظیمات Tailwind
├── next.config.js         # تنظیمات Next.js
└── tsconfig.json          # تنظیمات TypeScript
```

## 🔧 تنظیمات

### متغیرهای محیطی
فایل `.env.local` ایجاد کنید:

```env
# ChatGPT API
OPENAI_API_KEY=your_openai_api_key

# Image Generation API
DALL_E_API_KEY=your_dalle_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=گاراژ تخصصی مکانیکی
```

### تنظیمات SEO
- Meta tags در `app/layout.tsx`
- Schema.org markup برای کسب‌وکار محلی
- Sitemap.xml خودکار
- Robots.txt

## 📊 بهینه‌سازی SEO

### ویژگی‌های SEO
- ✅ Meta tags کامل
- ✅ Schema.org markup
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ سرعت لود بالا
- ✅ Mobile-first design
- ✅ Core Web Vitals

### کلمات کلیدی هدف
- تعمیر خودرو
- مکانیک
- خودرو آلمانی
- خودرو چینی
- گاراژ
- تعمیر موتور
- گیربکس

## 📝 سیستم وبلاگ

### قابلیت‌ها
- مدیریت مقالات از پنل ادمین
- بهینه‌سازی SEO
- دسته‌بندی و تگ‌گذاری
- جستجو و فیلتر

### مدیریت محتوا
```javascript
// مثال مدیریت مقالات
const createBlogPost = async (postData) => {
  const response = await fetch('/api/blog/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  });
  
  return response.json();
};
```

## 📱 سازگاری

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet (iPad, Android tablets)
- ✅ PWA Ready

## 🔒 امنیت

- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers
- ✅ Admin panel authentication

## 📈 آمار و تحلیل

### Google Analytics
```javascript
// اضافه کردن Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');
```

### Google Search Console
- Sitemap.xml خودکار
- Robots.txt بهینه
- Schema markup

## 🆘 پشتیبانی

برای پشتیبانی و سوالات:
- 📧 Email: aradmadadi@gmail.com
- 📞 Phone: 09126830739



---

**ساخته شده توسط تی نت برای گاراژ تخصصی مکانیکی**
