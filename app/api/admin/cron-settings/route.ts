import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// خواندن تنظیمات Cron
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'cron-settings.json')
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'فایل تنظیمات یافت نشد'
      }, { status: 404 })
    }

    const data = fs.readFileSync(filePath, 'utf8')
    const settings = JSON.parse(data)

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error reading cron settings:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در خواندن تنظیمات'
    }, { status: 500 })
  }
}

// ذخیره تنظیمات Cron
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // اعتبارسنجی داده‌ها
    if (!body.articlesPerDay || !Array.isArray(body.generationHours)) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های نامعتبر'
      }, { status: 400 })
    }

    const settings = {
      enabled: body.enabled !== undefined ? body.enabled : true,
      articlesPerDay: Math.max(1, Math.min(10, parseInt(body.articlesPerDay) || 1)),
      generationHours: body.generationHours.filter((hour: number) => hour >= 0 && hour <= 23).sort(),
      lastBlogGeneration: body.lastBlogGeneration || null
    }

    const filePath = path.join(process.cwd(), 'data', 'cron-settings.json')
    
    // ایجاد پوشه data اگر وجود ندارد
    const dataDir = path.dirname(filePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'تنظیمات با موفقیت ذخیره شد',
      data: settings
    })
  } catch (error) {
    console.error('Error saving cron settings:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در ذخیره تنظیمات'
    }, { status: 500 })
  }
}
