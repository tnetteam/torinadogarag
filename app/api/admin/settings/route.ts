import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current settings
    const settings = config.getConfig()

    // Return only safe settings (exclude sensitive data)
    const safeSettings = {
      site: settings.site,
      contact: settings.contact,
      social: settings.social,
      features: settings.features,
      analytics: {
        googleAnalyticsId: settings.analytics.googleAnalyticsId
      }
    }

    return NextResponse.json({
      success: true,
      data: safeSettings
    })

  } catch (error) {
    console.error('Get settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت تنظیمات' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate settings
    const validation = validateSettings(body)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'تنظیمات نامعتبر',
          errors: validation.errors 
        },
        { status: 400 }
      )
    }

    // Update settings
    config.update(body)

    // In a real application, you would save to database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'تنظیمات با موفقیت به‌روزرسانی شد',
      data: body
    })

  } catch (error) {
    console.error('Update settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی تنظیمات' },
      { status: 500 }
    )
  }
}

function validateSettings(settings: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate site settings
  if (settings.site && typeof settings.site === 'object') {
    const site = settings.site as Record<string, unknown>
    if (!site.name || typeof site.name !== 'string' || site.name.trim().length < 2) {
      errors.push('نام سایت باید حداقل 2 کاراکتر باشد')
    }

    if (!site.url || typeof site.url !== 'string' || !isValidUrl(site.url)) {
      errors.push('آدرس سایت معتبر نیست')
    }

    if (!site.description || typeof site.description !== 'string' || site.description.trim().length < 10) {
      errors.push('توضیحات سایت باید حداقل 10 کاراکتر باشد')
    }
  }

  // Validate contact settings
  if (settings.contact && typeof settings.contact === 'object') {
    const contact = settings.contact as Record<string, unknown>
    if (!contact.phone && !contact.mobile) {
      errors.push('حداقل یک شماره تماس الزامی است')
    }

    if (contact.email && typeof contact.email === 'string' && !isValidEmail(contact.email)) {
      errors.push('ایمیل معتبر نیست')
    }

    if (!contact.address || typeof contact.address !== 'string' || contact.address.trim().length < 5) {
      errors.push('آدرس باید حداقل 5 کاراکتر باشد')
    }
  }

  // Validate social media URLs
  if (settings.social && typeof settings.social === 'object') {
    const social = settings.social as Record<string, unknown>
    const socialFields = ['instagram', 'facebook', 'twitter', 'linkedin']
    socialFields.forEach(field => {
      if (social[field] && typeof social[field] === 'string' && !isValidUrl(social[field] as string)) {
        errors.push(`آدرس ${field} معتبر نیست`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
