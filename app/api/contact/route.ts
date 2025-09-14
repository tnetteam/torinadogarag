import { NextRequest, NextResponse } from 'next/server'
import { validateContactForm, submitContactForm } from '@/lib/forms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const errors = validateContactForm(body)
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors: errors,
          message: 'اطلاعات وارد شده صحیح نیست'
        },
        { status: 400 }
      )
    }

    // Submit the form
    const result = await submitContactForm(body)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    const contactSettingsPath = path.join(process.cwd(), 'data', 'contact-settings.json')
    
    if (!fs.existsSync(contactSettingsPath)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact settings not found' 
        },
        { status: 404 }
      )
    }
    
    const settings = JSON.parse(fs.readFileSync(contactSettingsPath, 'utf8'))
    
    return NextResponse.json({
      success: true,
      data: settings
    })
    
  } catch (error) {
    console.error('Error fetching contact settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching contact settings' 
      },
      { status: 500 }
    )
  }
}
