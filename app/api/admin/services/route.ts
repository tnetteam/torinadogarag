import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import fs from 'fs'
import path from 'path'

const SERVICES_FILE_PATH = path.join(process.cwd(), 'data', 'services.json')

interface Service {
  id: number
  name: string
  description: string
  phone: string
  status: string
  icon: string
  features: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

// Initialize services file if it doesn't exist
function initializeServicesFile() {
  if (!fs.existsSync(SERVICES_FILE_PATH)) {
    const initialServices = [
        {
          id: 1,
          name: 'تعمیر موتور',
          description: 'تعمیر تخصصی موتور خودروهای آلمانی و چینی',
          phone: '09123456789',
          status: 'active',
          icon: '🔧',
          features: ['تشخیص عیب', 'تعمیر تخصصی', 'تست عملکرد'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'تعمیر گیربکس',
          description: 'تعمیر گیربکس دستی و اتوماتیک',
          phone: '09123456790',
          status: 'active',
          icon: '⚙️',
          features: ['بازسازی کامل', 'تعویض قطعات', 'تست عملکرد'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'تعمیر سیستم برقی',
          description: 'تشخیص و تعمیر مشکلات سیستم برقی خودرو',
          phone: '09123456791',
          status: 'active',
          icon: '⚡',
          features: ['تشخیص عیب', 'تعمیر سیم‌کشی', 'تست سیستم'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
    ]
    
    const dir = path.dirname(SERVICES_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(SERVICES_FILE_PATH, JSON.stringify(initialServices, null, 2), 'utf8')
  }
}

function readServices() {
  try {
    initializeServicesFile()
    const data = fs.readFileSync(SERVICES_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading services:', error)
    return []
  }
}

function writeServices(services: Service[]) {
  try {
    const dir = path.dirname(SERVICES_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(SERVICES_FILE_PATH, JSON.stringify(services, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing services:', error)
    throw error
  }
}

async function saveServiceImage(imageFile: File): Promise<string> {
  try {
    // Dynamic import for server-side only
    const { optimizeImage, generateResponsiveImages } = await import('@/lib/image-optimizer')
    
    // Create directories
    const tempDir = path.join(process.cwd(), 'temp')
    const optimizedDir = path.join(process.cwd(), 'public', 'images', 'optimized')
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = imageFile.name.split('.').pop() || 'jpg'
    const tempFilename = `temp-service-${timestamp}.${fileExtension}`
    const tempPath = path.join(tempDir, tempFilename)

    // Save original file temporarily
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(tempPath, buffer)

    // Optimize image
    const baseName = `service-${timestamp}`
    await optimizeImage(tempPath, optimizedDir, {
      width: 800,
      height: 600,
      quality: 85,
      format: 'webp'
    })

    // Generate responsive images
    await generateResponsiveImages(tempPath, optimizedDir, baseName)

    // Clean up temp file
    fs.unlinkSync(tempPath)

    // Return the optimized WebP URL (use the base name without -optimized suffix)
    return `/images/optimized/${baseName}.webp`
  } catch (error) {
    console.error('Error saving service image:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    const services = readServices()
    
    return NextResponse.json({
      success: true,
      data: services
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/services:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در دریافت خدمات' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== 'garage-admin-2024-secure-key-12345') {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    // Handle FormData for file uploads
    const formData = await request.formData()
    const action = formData.get('action') as string
    const serviceDataStr = formData.get('serviceData') as string
    const serviceId = formData.get('serviceId') as string
    const imageFile = formData.get('image') as File | null

    let serviceData
    try {
      serviceData = JSON.parse(serviceDataStr)
    } catch {
      return NextResponse.json({ success: false, message: 'داده‌های خدمت نامعتبر است' }, { status: 400 })
    }

    let services = readServices()

    switch (action) {
      case 'create':
        if (!serviceData) {
          return NextResponse.json({ success: false, message: 'داده‌های خدمت لازم است' }, { status: 400 })
        }
        
        let imageUrl = ''
        if (imageFile) {
          imageUrl = await saveServiceImage(imageFile)
        }
        
        const newService = {
          id: Date.now(),
          ...serviceData,
          image: imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        services.push(newService)
        writeServices(services)
        return NextResponse.json({ success: true, message: 'خدمت با موفقیت ایجاد شد', data: newService })

      case 'update':
        if (!serviceData || !serviceId) {
          return NextResponse.json({ success: false, message: 'داده‌های خدمت و شناسه لازم است' }, { status: 400 })
        }
        
        const serviceIndex = services.findIndex((s: Service) => s.id === parseInt(serviceId))
        if (serviceIndex === -1) {
          return NextResponse.json({ success: false, message: 'خدمت یافت نشد' }, { status: 404 })
        }
        
        let updateImageUrl = services[serviceIndex].image
        if (imageFile) {
          try {
            updateImageUrl = await saveServiceImage(imageFile)
          } catch (error) {
            console.error('Error updating service image:', error)
            return NextResponse.json({ success: false, message: 'خطا در آپلود تصویر' }, { status: 500 })
          }
        }
        
        services[serviceIndex] = {
          ...services[serviceIndex],
          ...serviceData,
          image: updateImageUrl,
          updatedAt: new Date().toISOString()
        }
        
        writeServices(services)
        return NextResponse.json({ success: true, message: 'خدمت با موفقیت به‌روزرسانی شد' })

      case 'delete':
        if (!serviceId) {
          return NextResponse.json({ success: false, message: 'شناسه خدمت لازم است' }, { status: 400 })
        }
        
        const serviceToDelete = services.find((s: Service) => s.id === parseInt(serviceId))
        if (!serviceToDelete) {
          return NextResponse.json({ success: false, message: 'خدمت یافت نشد' }, { status: 404 })
        }
        
        // Delete image file if exists
        if (serviceToDelete.image) {
          try {
            const imagePath = path.join(process.cwd(), 'public', serviceToDelete.image)
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
            }
          } catch (deleteError) {
            console.error('Error deleting service image:', deleteError)
          }
        }
        
        services = services.filter((s: Service) => s.id !== parseInt(serviceId))
        writeServices(services)
        return NextResponse.json({ success: true, message: 'خدمت با موفقیت حذف شد' })

      default:
        return NextResponse.json({ success: false, message: 'عملیات نامعتبر' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/admin/services:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در عملیات خدمات' 
    }, { status: 500 })
  }
}