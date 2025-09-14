# سیستم Cron Job خودکار

## 🚀 قابلیت‌های سیستم

### ✅ **اجرای خودکار**
- **تولید خودکار مقالات** در زمان‌های مشخص
- **بدون نیاز به دخالت دستی** - کاملاً خودکار
- **زمان‌بندی قابل تنظیم** (روزانه، هفتگی، ماهانه)
- **بررسی هر ساعت** برای اجرای زمان‌بندی شده

### ⚙️ **تنظیمات**

#### فایل: `data/cron-settings.json`
```json
{
  "enabled": true,           // فعال/غیرفعال
  "interval": "daily",       // daily, weekly, monthly
  "postsPerRun": 2,          // تعداد مقالات در هر اجرا
  "lastRun": null,           // آخرین اجرا
  "scheduleTime": "09:00",   // زمان اجرا
  "timezone": "Asia/Tehran", // منطقه زمانی
  "topics": [...]            // لیست موضوعات
}
```

## 🔧 **نحوه استفاده**

### 1. **شروع سیستم Cron**
```bash
# روش 1: از طریق npm script
npm run start-cron

# روش 2: از طریق API
curl -X POST http://localhost:3000/api/cron-control \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

### 2. **تست سیستم**
```bash
npm run test-cron
```

### 3. **بررسی وضعیت**
```bash
curl http://localhost:3000/api/cron-control
```

### 4. **اجرای دستی (فوری)**
```bash
curl -X POST http://localhost:3000/api/cron \
  -H "Content-Type: application/json" \
  -d '{"action": "run-cron", "force": true}'
```

## 📊 **API Endpoints**

### 1. **کنترل Cron**
```
GET /api/cron-control          # وضعیت
POST /api/cron-control         # شروع/توقف
```

### 2. **اجرای Cron**
```
POST /api/cron                 # اجرای دستی
```

## 🕐 **نحوه کارکرد**

### **زمان‌بندی:**
- **روزانه**: هر 24 ساعت یکبار
- **هفتگی**: هر 7 روز یکبار  
- **ماهانه**: هر 30 روز یکبار

### **فرآیند:**
1. **بررسی زمان**: سیستم هر ساعت بررسی می‌کند
2. **تشخیص نیاز**: اگر زمان اجرا رسیده باشد
3. **تولید محتوا**: با Gemini AI
4. **ذخیره خودکار**: در فایل blog-posts.json
5. **به‌روزرسانی**: زمان آخرین اجرا

## 🧪 **تست سیستم**

### **مراحل تست:**
```bash
# 1. شروع سرور
npm run dev

# 2. تست سیستم Cron
npm run test-cron

# 3. بررسی مقالات تولید شده
# فایل: data/blog-posts.json
```

### **خروجی مورد انتظار:**
```
🧪 Cron Job System Test Suite
==============================

⚙️ Testing Cron Settings
========================
✅ Cron settings found:
  - Enabled: true
  - Interval: daily
  - Posts per run: 2
  - Last run: null
  - Topics count: 10

🤖 Testing Gemini Settings
===========================
✅ Gemini settings found:
  - API Key: Configured
  - Model: gemini-pro
  - Enabled: true

📊 1. Checking cron status...
✅ Cron status: { running: false, lastRun: null, nextRun: 'اکنون' }

🚀 2. Starting cron scheduler...
✅ Cron scheduler started: سیستم Cron شروع شد

⚡ 3. Force running cron job...
✅ Cron job executed: 2 مقاله با موفقیت تولید شد
📄 Generated posts: 2
  1. راهنمای کامل تعمیر موتور BMW X5
  2. تعمیر گیربکس اتوماتیک CVT

📊 4. Final cron status...
✅ Final cron status: { running: true, lastRun: '2025-01-14T...', nextRun: 'فردا' }

📚 5. Checking blog posts...
✅ Total blog posts: 2
📄 Latest posts:
  1. راهنمای کامل تعمیر موتور BMW X5 (2025-01-14T...)
  2. تعمیر گیربکس اتوماتیک CVT (2025-01-14T...)
```

## 🎯 **مزایای سیستم**

### ✅ **خودکار بودن**
- **بدون دخالت دستی** - کاملاً خودکار
- **زمان‌بندی دقیق** - در زمان‌های مشخص
- **مداوم بودن** - 24/7 فعال

### ✅ **قابلیت تنظیم**
- **زمان‌بندی قابل تغییر** - روزانه/هفتگی/ماهانه
- **تعداد مقالات قابل تنظیم** - 1 تا 10 مقاله
- **موضوعات قابل انتخاب** - 10 موضوع تخصصی

### ✅ **کیفیت محتوا**
- **مقالات عمیق** - 1500-2500 کلمه
- **محتوای تخصصی** - برای خودروهای آلمانی و چینی
- **SEO بهینه** - کلمات کلیدی هدفمند

## 🔍 **نحوه نظارت**

### **بررسی وضعیت:**
```javascript
// از طریق API
fetch('/api/cron-control')
  .then(r => r.json())
  .then(data => console.log(data));

// خروجی:
{
  "success": true,
  "data": {
    "running": true,
    "lastRun": "2025-01-14T09:00:00.000Z",
    "nextRun": "فردا"
  }
}
```

### **بررسی مقالات:**
```javascript
// فایل: data/blog-posts.json
// آخرین مقالات تولید شده
```

## 🚨 **نکات مهم**

### **قبل از استفاده:**
1. ✅ **Gemini API Key** تنظیم شده باشد
2. ✅ **سرور در حال اجرا** باشد
3. ✅ **سیستم Cron شروع** شده باشد

### **برای تولید:**
1. 🕐 **زمان‌بندی** را تنظیم کنید
2. 🎯 **موضوعات** را انتخاب کنید
3. 📊 **تعداد مقالات** را مشخص کنید
4. 🚀 **سیستم را شروع** کنید

## 🎉 **نتیجه**

سیستم Cron Job شما حالا کاملاً خودکار است و می‌تواند:
- **روزانه 2 مقاله** تولید کند
- **بدون دخالت دستی** کار کند
- **در زمان‌های مشخص** اجرا شود
- **محتوای باکیفیت** تولید کند

**برای شروع:** `npm run start-cron` 🚀
