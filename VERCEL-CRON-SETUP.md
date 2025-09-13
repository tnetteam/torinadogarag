# 🚀 راهنمای تنظیم Vercel Cron برای تولید خودکار مقالات

## ✅ فایل‌های تنظیم شده:

### 1. `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-content?key=garage-cron-2024-secure-key",
      "schedule": "0 9,15,21 * * *"
    }
  ]
}
```

### 2. `data/cron-settings.json`
```json
{
  "enabled": true,
  "blogInterval": 8,
  "lastBlogGeneration": null,
  "articlesPerDay": 3,
  "generationHours": [9, 15, 21]
}
```

## 🎯 نحوه Deploy روی Vercel:

### 1️⃣ **آپلود پروژه:**
- پروژه را در GitHub قرار دهید
- یا مستقیماً در Vercel آپلود کنید

### 2️⃣ **اتصال به Vercel:**
- وارد [vercel.com](https://vercel.com) شوید
- پروژه را Import کنید
- تنظیمات را تایید کنید

### 3️⃣ **فعال‌سازی Cron:**
- Vercel به صورت خودکار `vercel.json` را می‌خواند
- Cron Job فعال می‌شود

## ⏰ زمان‌بندی:

- **9:00 صبح** - مقاله اول
- **15:00 بعدازظهر** - مقاله دوم  
- **21:00 شب** - مقاله سوم

## 🔧 تنظیمات:

### تغییر ساعت‌ها:
```json
"schedule": "0 8,14,20 * * *"  // 8:00, 14:00, 20:00
```

### تغییر تعداد مقالات:
```json
"articlesPerDay": 2  // 2 مقاله در روز
```

## 📊 نظارت:

- در پنل ادمین → تب "محتوای هوش مصنوعی"
- آمار تولید مقالات
- وضعیت Cron Job

## 🎉 نتیجه:

✅ **تولید خودکار فعال**
✅ **3 مقاله در روز**
✅ **سئو بهینه**
✅ **رایگان**

---
**نکته:** بعد از Deploy روی Vercel، مقالات به صورت خودکار تولید می‌شوند!
