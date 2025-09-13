// Form validation and handling utilities

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface ValidationError {
  field: string
  message: string
}

export function validateContactForm(data: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'نام باید حداقل 2 کاراکتر باشد'
    })
  }

  // Phone validation
  if (!data.phone || !isValidIranianPhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'شماره تماس معتبر وارد کنید'
    })
  }

  // Email validation (optional but if provided, should be valid)
  if (data.email && !isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'ایمیل معتبر وارد کنید'
    })
  }

  // Subject validation
  if (!data.subject || data.subject.trim().length < 3) {
    errors.push({
      field: 'subject',
      message: 'موضوع باید حداقل 3 کاراکتر باشد'
    })
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push({
      field: 'message',
      message: 'پیام باید حداقل 10 کاراکتر باشد'
    })
  }

  return errors
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidIranianPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Check if it's a valid Iranian mobile number
  const mobileRegex = /^09[0-9]{9}$/
  
  // Check if it's a valid Iranian landline number
  const landlineRegex = /^0[1-9][0-9]{8}$/
  
  return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone)
}

export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.startsWith('09')) {
    // Mobile number: 09123456789 -> 0912-345-6789
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (cleanPhone.startsWith('0')) {
    // Landline number: 02112345678 -> 021-1234-5678
    return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function generateContactEmailTemplate(data: ContactFormData): string {
  const formattedPhone = formatPhoneNumber(data.phone)
  
  return `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">پیام جدید از وب‌سایت گاراژ</h2>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #374151;">نام:</strong>
          <span style="margin-right: 10px;">${sanitizeInput(data.name)}</span>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #374151;">شماره تماس:</strong>
          <span style="margin-right: 10px;">${formattedPhone}</span>
        </div>
        
        ${data.email ? `
        <div style="margin-bottom: 20px;">
          <strong style="color: #374151;">ایمیل:</strong>
          <span style="margin-right: 10px;">${sanitizeInput(data.email)}</span>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #374151;">موضوع:</strong>
          <span style="margin-right: 10px;">${sanitizeInput(data.subject)}</span>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #374151;">پیام:</strong>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px; line-height: 1.6;">
            ${sanitizeInput(data.message).replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            این پیام از طریق فرم تماس وب‌سایت گاراژ تخصصی مکانیکی ارسال شده است.
          </p>
        </div>
      </div>
    </div>
  `
}

export function generateAutoReplyEmail(name: string): string {
  return `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">پیام شما دریافت شد</h2>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          سلام ${sanitizeInput(name)} عزیز،
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          از ارسال پیام شما متشکریم. پیام شما با موفقیت دریافت شد و در اسرع وقت با شما تماس خواهیم گرفت.
        </p>
        
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1d4ed8; margin-bottom: 10px;">اطلاعات تماس ما:</h3>
          <p style="color: #374151; margin: 5px 0;"><strong>تلفن:</strong> 021-12345678</p>
          <p style="color: #374151; margin: 5px 0;"><strong>موبایل:</strong> 0912-345-6789</p>
          <p style="color: #374151; margin: 5px 0;"><strong>آدرس:</strong> تهران، خیابان ولیعصر، پلاک 123</p>
          <p style="color: #374151; margin: 5px 0;"><strong>ساعات کاری:</strong> شنبه تا پنج‌شنبه: 8:00 - 18:00</p>
        </div>
        
        <p style="color: #374151; line-height: 1.6; margin-top: 20px;">
          با تشکر از اعتماد شما،<br>
          <strong>تیم گاراژ تخصصی مکانیکی</strong>
        </p>
      </div>
    </div>
  `
}

// Form submission handler
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Validate form data
    const errors = validateContactForm(data)
    if (errors.length > 0) {
      return {
        success: false,
        message: errors.map(error => error.message).join(', ')
      }
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.'
    }
    
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return {
      success: false,
      message: 'خطایی در ارسال پیام رخ داد. لطفاً دوباره تلاش کنید.'
    }
  }
}
