import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONTACT_SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'contact-settings.json')

interface ContactSettings {
  companyInfo: {
    name: string
    subtitle: string
    description: string
  }
  contactInfo: {
    phone: string
    mobile: string
    email: string
    address: string
    workingHours: string
  }
  socialMedia: {
    instagram: string
    telegram: string
    whatsapp: string
    linkedin: string
  }
  mapSettings: {
    latitude: number
    longitude: number
    zoom: number
  }
  updatedAt: string
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize contact settings file if it doesn't exist
if (!fs.existsSync(CONTACT_SETTINGS_FILE_PATH)) {
  const initialSettings: ContactSettings = {
    companyInfo: {
      name: "تورنادو",
      subtitle: "گاراژ تخصصی مکانیکی",
      description: "با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی، خدمات مکانیکی با کیفیت و قابل اعتماد ارائه می‌دهیم."
    },
    contactInfo: {
      phone: "021-12345678",
      mobile: "09126977639",
      email: "info@garage-website.ir",
      address: "تهران، خیابان ولیعصر، پلاک 123",
      workingHours: "شنبه تا پنج‌شنبه: 8:00 - 18:00"
    },
    socialMedia: {
      instagram: "",
      telegram: "",
      whatsapp: "",
      linkedin: ""
    },
    mapSettings: {
      latitude: 35.7219,
      longitude: 51.3347,
      zoom: 15
    },
    updatedAt: new Date().toISOString()
  }
  
  fs.writeFileSync(CONTACT_SETTINGS_FILE_PATH, JSON.stringify(initialSettings, null, 2))
}

function readContactSettings(): ContactSettings {
  try {
    const data = fs.readFileSync(CONTACT_SETTINGS_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading contact settings:', error)
    throw new Error('خطا در خواندن تنظیمات تماس')
  }
}

function writeContactSettings(settings: ContactSettings): boolean {
  try {
    settings.updatedAt = new Date().toISOString()
    fs.writeFileSync(CONTACT_SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing contact settings:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }
    
    const settings = readContactSettings()
    
    return NextResponse.json({
      success: true,
      data: settings
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/contact-settings:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }
    
    const body = await request.json()
    const { action, settings } = body
    
    switch (action) {
      case 'update':
        if (!settings) {
          return NextResponse.json({ success: false, message: 'تنظیمات ارسال نشده' }, { status: 400 })
        }
        
        if (writeContactSettings(settings)) {
          return NextResponse.json({
            success: true,
            message: 'تنظیمات تماس با موفقیت به‌روزرسانی شد',
            data: settings
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در ذخیره تنظیمات' }, { status: 500 })
        }
        
      default:
        return NextResponse.json({ success: false, message: 'عملیات نامعتبر' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/admin/contact-settings:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
