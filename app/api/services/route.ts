import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const servicesPath = join(process.cwd(), 'data', 'services.json')
    
    let services = []
    try {
      const servicesData = readFileSync(servicesPath, 'utf-8')
      services = JSON.parse(servicesData)
    } catch {
      // If file doesn't exist, return empty array
      services = []
    }

    return NextResponse.json({
      success: true,
      data: services
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'خطا در دریافت خدمات'
      },
      { status: 500 }
    )
  }
}