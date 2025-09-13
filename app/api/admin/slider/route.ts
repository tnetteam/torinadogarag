import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import fs from 'fs'
import path from 'path'

const SLIDER_FILE_PATH = path.join(process.cwd(), 'data', 'slider-images.json')

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
  order: number
  status: string
  createdAt: string
  updatedAt: string
}

// Initialize slider file if it doesn't exist
function initializeSliderFile() {
  if (!fs.existsSync(SLIDER_FILE_PATH)) {
    const initialSlides = [
      {
        id: 1,
        title: 'گاراژ تخصصی مکانیکی',
        subtitle: 'خدمات حرفه‌ای تعمیر خودرو',
        image: '/images/hero-1.jpg',
        buttonText: 'مشاهده خدمات',
        buttonLink: '/services',
        order: 1,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'تعمیر تخصصی موتور',
        subtitle: 'بهترین خدمات تعمیر موتور خودرو',
        image: '/images/hero-2.jpg',
        buttonText: 'تماس با ما',
        buttonLink: '/contact',
        order: 2,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'گارانتی کامل',
        subtitle: 'تمام خدمات با گارانتی تضمینی',
        image: '/images/hero-3.jpg',
        buttonText: 'درباره ما',
        buttonLink: '/about',
        order: 3,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    const dir = path.dirname(SLIDER_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(SLIDER_FILE_PATH, JSON.stringify(initialSlides, null, 2), 'utf8')
  }
}

function readSliderImages() {
  try {
    initializeSliderFile()
    const data = fs.readFileSync(SLIDER_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading slider images:', error)
    return []
  }
}

function writeSliderImages(slides: Slide[]) {
  try {
    const dir = path.dirname(SLIDER_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(SLIDER_FILE_PATH, JSON.stringify(slides, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing slider images:', error)
    throw error
  }
}

async function saveSliderImage(imageFile: File): Promise<string> {
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
    const tempFilename = `temp-slide-${timestamp}.${fileExtension}`
    const tempPath = path.join(tempDir, tempFilename)

    // Save original file temporarily
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(tempPath, buffer)

    // Optimize image
    const baseName = `slide-${timestamp}`
    await optimizeImage(tempPath, optimizedDir, {
      width: 1920,
      height: 1080,
      quality: 90,
      format: 'webp'
    })

    // Generate responsive images
    await generateResponsiveImages(tempPath, optimizedDir, baseName)

    // Clean up temp file
    fs.unlinkSync(tempPath)

    // Return the optimized WebP URL (use the base name without -optimized suffix)
    return `/images/optimized/${baseName}.webp`
  } catch (error) {
    console.error('Error saving slider image:', error)
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

    const slides = readSliderImages()
    
    return NextResponse.json({
      success: true,
      data: slides
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/slider:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در دریافت تصاویر اسلایدر' 
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
    const slideDataStr = formData.get('slideData') as string
    const slideId = formData.get('slideId') as string
    const imageFile = formData.get('image') as File | null

    let slideData
    try {
      slideData = JSON.parse(slideDataStr)
    } catch {
      return NextResponse.json({ success: false, message: 'داده‌های اسلاید نامعتبر است' }, { status: 400 })
    }

    let slides = readSliderImages()

    switch (action) {
      case 'create':
        if (!slideData) {
          return NextResponse.json({ success: false, message: 'داده‌های اسلاید لازم است' }, { status: 400 })
        }
        
        let imageUrl = ''
        if (imageFile) {
          imageUrl = await saveSliderImage(imageFile)
        }
        
        const newSlide = {
          id: Date.now(),
          ...slideData,
          image: imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        slides.push(newSlide)
        writeSliderImages(slides)
        return NextResponse.json({ success: true, message: 'اسلاید با موفقیت ایجاد شد', data: newSlide })

      case 'update':
        if (!slideData || !slideId) {
          return NextResponse.json({ success: false, message: 'داده‌های اسلاید و شناسه لازم است' }, { status: 400 })
        }
        
        const slideIndex = slides.findIndex((s: Slide) => s.id === parseInt(slideId))
        if (slideIndex === -1) {
          return NextResponse.json({ success: false, message: 'اسلاید یافت نشد' }, { status: 404 })
        }
        
        let updateImageUrl = slides[slideIndex].image
        if (imageFile) {
          updateImageUrl = await saveSliderImage(imageFile)
        }
        
        slides[slideIndex] = {
          ...slides[slideIndex],
          ...slideData,
          image: updateImageUrl,
          updatedAt: new Date().toISOString()
        }
        
        writeSliderImages(slides)
        return NextResponse.json({ success: true, message: 'اسلاید با موفقیت به‌روزرسانی شد' })

      case 'delete':
        if (!slideId) {
          return NextResponse.json({ success: false, message: 'شناسه اسلاید لازم است' }, { status: 400 })
        }
        
        const slideIdNum = parseInt(slideId)
        if (isNaN(slideIdNum)) {
          return NextResponse.json({ success: false, message: 'شناسه اسلاید نامعتبر است' }, { status: 400 })
        }
        
        const slideToDelete = slides.find((s: Slide) => s.id === slideIdNum)
        if (!slideToDelete) {
          return NextResponse.json({ success: false, message: 'اسلاید یافت نشد' }, { status: 404 })
        }
        
        // Delete image file if exists
        if (slideToDelete.image && slideToDelete.image.startsWith('/images/')) {
          try {
            const imagePath = path.join(process.cwd(), 'public', slideToDelete.image)
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
              console.log('Deleted image:', imagePath)
            }
          } catch (error) {
            console.error('Error deleting slider image:', error)
            // Continue with deletion even if image deletion fails
          }
        }
        
        slides = slides.filter((s: Slide) => s.id !== slideIdNum)
        writeSliderImages(slides)
        console.log('Slider deleted successfully, remaining slides:', slides.length)
        return NextResponse.json({ success: true, message: 'اسلاید با موفقیت حذف شد' })

      default:
        return NextResponse.json({ success: false, message: 'عملیات نامعتبر' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/admin/slider:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در عملیات اسلایدر' 
    }, { status: 500 })
  }
}
