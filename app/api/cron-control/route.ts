import { NextRequest, NextResponse } from 'next/server'
import { startCronScheduler, stopCronScheduler, getCronStatus } from '@/lib/cron-scheduler'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - دریافت وضعیت Cron
export async function GET() {
  try {
    const status = getCronStatus()
    
    return NextResponse.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error getting cron status:', error)
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت وضعیت Cron'
    }, { status: 500 })
  }
}

// POST - کنترل Cron
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'start') {
      startCronScheduler()
      return NextResponse.json({
        success: true,
        message: 'سیستم Cron شروع شد'
      })
    }
    
    if (action === 'stop') {
      stopCronScheduler()
      return NextResponse.json({
        success: true,
        message: 'سیستم Cron متوقف شد'
      })
    }
    
    if (action === 'status') {
      const status = getCronStatus()
      return NextResponse.json({
        success: true,
        data: status
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'عملیات نامعتبر'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Error controlling cron:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا در کنترل Cron'
    }, { status: 500 })
  }
}
