import { NextResponse } from 'next/server'
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

function readContactSettings(): ContactSettings | null {
  try {
    if (!fs.existsSync(CONTACT_SETTINGS_FILE_PATH)) {
      return null
    }
    
    const data = fs.readFileSync(CONTACT_SETTINGS_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading contact settings:', error)
    return null
  }
}

export async function GET() {
  try {
    const settings = readContactSettings()
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        message: 'تنظیمات تماس یافت نشد'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    })
    
  } catch (error) {
    console.error('Error in GET /api/contact-settings:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}
