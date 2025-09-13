import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const GEMINI_SETTINGS_FILE = path.join(process.cwd(), 'data', 'gemini-settings.json')

// خواندن تنظیمات Gemini
function readGeminiSettings() {
  try {
    if (fs.existsSync(GEMINI_SETTINGS_FILE)) {
      const data = fs.readFileSync(GEMINI_SETTINGS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return {
      apiKey: '',
      model: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.7,
      enabled: false,
      lastUpdate: null
    }
  } catch (error) {
    console.error('Error reading Gemini settings:', error)
    return {
      apiKey: '',
      model: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.7,
      enabled: false,
      lastUpdate: null
    }
  }
}

// نوشتن تنظیمات Gemini
function writeGeminiSettings(settings: Record<string, unknown>) {
  try {
    fs.writeFileSync(GEMINI_SETTINGS_FILE, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing Gemini settings:', error)
    return false
  }
}

// GET - خواندن تنظیمات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showFullKey = searchParams.get('showFullKey') === 'true'
    
    const settings = readGeminiSettings()
    
    // مخفی کردن API Key اگر درخواست نشده
    if (!showFullKey && settings.apiKey) {
      settings.apiKey = settings.apiKey.substring(0, 10) + '...'
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error fetching Gemini settings:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت تنظیمات Gemini'
    }, { status: 500 })
  }
}

// POST - ذخیره تنظیمات
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, settings } = body
    
    if (action === 'update') {
      const updatedSettings = {
        ...settings,
        lastUpdate: new Date().toISOString()
      }
      
      const success = writeGeminiSettings(updatedSettings)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'تنظیمات Gemini با موفقیت ذخیره شد'
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'خطا در ذخیره تنظیمات'
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'عملیات نامعتبر'
    }, { status: 400 })
  } catch (error) {
    console.error('Error saving Gemini settings:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در ذخیره تنظیمات'
    }, { status: 500 })
  }
}
