import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MESSAGES_FILE_PATH = path.join(process.cwd(), 'data', 'contact-messages.json')

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
  updatedAt: string
}

// Read messages from file
function readMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE_PATH)) {
      const data = fs.readFileSync(MESSAGES_FILE_PATH, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading messages:', error)
    return []
  }
}

// Write messages to file
function writeMessages(messages: ContactMessage[]): boolean {
  try {
    fs.writeFileSync(MESSAGES_FILE_PATH, JSON.stringify(messages, null, 2))
    return true
  } catch (error) {
    console.error('Error writing messages:', error)
    return false
  }
}

// GET - Fetch all messages (admin only)
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

    const messages = readMessages()
    
    // Sort by creation date (newest first)
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: messages
    })

  } catch (error) {
    console.error('Error in GET /api/contact-messages:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !phone || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'نام، شماره تماس، موضوع و پیام الزامی است' 
      }, { status: 400 })
    }

    const messages = readMessages()
    
    const newMessage: ContactMessage = {
      id: Date.now(),
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    messages.push(newMessage)

    if (writeMessages(messages)) {
      return NextResponse.json({
        success: true,
        message: 'پیام شما با موفقیت ارسال شد',
        data: newMessage
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'خطا در ذخیره پیام' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in POST /api/contact-messages:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update message status
export async function PUT(request: NextRequest) {
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
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ 
        success: false, 
        message: 'شناسه پیام و وضعیت الزامی است' 
      }, { status: 400 })
    }

    const messages = readMessages()
    const messageIndex = messages.findIndex(msg => msg.id === id)

    if (messageIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: 'پیام یافت نشد' 
      }, { status: 404 })
    }

    messages[messageIndex].status = status
    messages[messageIndex].updatedAt = new Date().toISOString()

    if (writeMessages(messages)) {
      return NextResponse.json({
        success: true,
        message: 'وضعیت پیام به‌روزرسانی شد',
        data: messages[messageIndex]
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'خطا در به‌روزرسانی پیام' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in PUT /api/contact-messages:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete message
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'شناسه پیام الزامی است' 
      }, { status: 400 })
    }

    const messages = readMessages()
    const filteredMessages = messages.filter(msg => msg.id !== parseInt(id))

    if (filteredMessages.length === messages.length) {
      return NextResponse.json({ 
        success: false, 
        message: 'پیام یافت نشد' 
      }, { status: 404 })
    }

    if (writeMessages(filteredMessages)) {
      return NextResponse.json({
        success: true,
        message: 'پیام حذف شد'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'خطا در حذف پیام' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in DELETE /api/contact-messages:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
