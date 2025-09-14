import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import fs from 'fs'
import path from 'path'

const GALLERY_FILE_PATH = path.join(process.cwd(), 'data', 'gallery-images.json')

interface GalleryImage {
  id: number
  name: string
  description?: string
  image: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize gallery file if it doesn't exist
if (!fs.existsSync(GALLERY_FILE_PATH)) {
  const initialGallery = [
    {
      id: 1,
      name: 'تعمیر موتور BMW',
      description: 'تعمیر کامل موتور BMW X5',
      image: '/gallery/bmw-engine.jpg',
      category: 'تعمیر موتور',
      tags: ['BMW', 'موتور', 'تعمیر'],
      date: '15 دسامبر 2024',
      size: '2.5 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'تعمیر سیستم برقی',
      description: 'تعمیر و سیم‌کشی سیستم برقی خودرو',
      image: '/gallery/electrical-repair.jpg',
      category: 'سیستم برقی',
      tags: ['برقی', 'سیم‌کشی', 'تعمیر'],
      date: '12 دسامبر 2024',
      size: '1.8 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'تعمیر گیربکس',
      description: 'تعمیر کامل گیربکس اتوماتیک',
      image: '/gallery/transmission-repair.jpg',
      category: 'گیربکس',
      tags: ['گیربکس', 'اتوماتیک', 'تعمیر'],
      date: '10 دسامبر 2024',
      size: '3.2 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'تعمیر سیستم تعلیق',
      description: 'تعمیر و تنظیم سیستم تعلیق',
      image: '/gallery/suspension-repair.jpg',
      category: 'سیستم تعلیق',
      tags: ['تعلیق', 'تنظیم', 'تعمیر'],
      date: '8 دسامبر 2024',
      size: '2.1 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'تعمیر سیستم ترمز',
      description: 'تعمیر و تعویض لنت‌های ترمز',
      image: '/gallery/brake-repair.jpg',
      category: 'سیستم ترمز',
      tags: ['ترمز', 'لنت', 'تعمیر'],
      date: '5 دسامبر 2024',
      size: '1.9 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      name: 'تعمیر سیستم خنک‌کننده',
      description: 'تعمیر رادیاتور و سیستم خنک‌کننده',
      image: '/gallery/cooling-system.jpg',
      category: 'سیستم خنک‌کننده',
      tags: ['رادیاتور', 'خنک‌کننده', 'تعمیر'],
      date: '3 دسامبر 2024',
      size: '2.3 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(initialGallery, null, 2))
}

function readGalleryImages() {
  try {
    const data = fs.readFileSync(GALLERY_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading gallery images:', error)
    return []
  }
}

function writeGalleryImages(images: GalleryImage[]) {
  try {
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(images, null, 2))
    return true
  } catch (error) {
    console.error('Error writing gallery images:', error)
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
    
    const galleryImages = readGalleryImages()
    
    return NextResponse.json({
      success: true,
      data: galleryImages
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/gallery:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

async function saveGalleryImage(imageFile: File): Promise<string> {
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
    const tempFilename = `temp-gallery-${timestamp}.${fileExtension}`
    const tempPath = path.join(tempDir, tempFilename)

    // Save original file temporarily
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(tempPath, buffer)

    // Optimize image
    const baseName = `gallery-${timestamp}`
    await optimizeImage(tempPath, optimizedDir, {
      width: 1200,
      height: 800,
      quality: 90,
      format: 'webp'
    })

    // Generate responsive images
    await generateResponsiveImages(tempPath, optimizedDir, baseName)

    // Clean up temp file
    fs.unlinkSync(tempPath)

    // Return the optimized WebP URL (1024px version)
    return `/images/optimized/${baseName}-1024.webp`
  } catch (error) {
    console.error('Error saving gallery image:', error)
    throw error
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
    
    // Handle FormData for file uploads
    const formData = await request.formData()
    const action = formData.get('action') as string
    const imageDataStr = formData.get('imageData') as string
    const imageId = formData.get('imageId') as string
    const imageFile = formData.get('image') as File | null

    let imageData
    try {
      imageData = JSON.parse(imageDataStr)
    } catch {
      return NextResponse.json({ success: false, message: 'داده‌های تصویر نامعتبر است' }, { status: 400 })
    }
    
    const galleryImages = readGalleryImages()
    
    switch (action) {
      case 'create':
        if (!imageData) {
          return NextResponse.json({ success: false, message: 'داده‌های تصویر لازم است' }, { status: 400 })
        }
        
        let imageUrl = ''
        if (imageFile) {
          imageUrl = await saveGalleryImage(imageFile)
        }
        
        const newId = Math.max(...galleryImages.map((img: GalleryImage) => img.id), 0) + 1
        const newImage = {
          id: newId,
          ...imageData,
          image: imageUrl,
          date: new Date().toLocaleDateString('fa-IR'),
          size: '2.0 MB', // Default size
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        galleryImages.push(newImage)
        
        if (writeGalleryImages(galleryImages)) {
          return NextResponse.json({
            success: true,
            message: 'تصویر با موفقیت اضافه شد',
            data: newImage
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در ذخیره تصویر' }, { status: 500 })
        }
        
      case 'update':
        if (!imageData || !imageId) {
          return NextResponse.json({ success: false, message: 'داده‌های تصویر و شناسه لازم است' }, { status: 400 })
        }
        
        const imageIndex = galleryImages.findIndex((img: GalleryImage) => img.id === parseInt(imageId))
        if (imageIndex === -1) {
          return NextResponse.json({ success: false, message: 'تصویر یافت نشد' }, { status: 404 })
        }
        
        let updateImageUrl = galleryImages[imageIndex].image
        if (imageFile) {
          try {
            updateImageUrl = await saveGalleryImage(imageFile)
          } catch (error) {
            console.error('Error updating gallery image:', error)
            return NextResponse.json({ success: false, message: 'خطا در آپلود تصویر' }, { status: 500 })
          }
        }
        
        galleryImages[imageIndex] = {
          ...galleryImages[imageIndex],
          ...imageData,
          image: updateImageUrl,
          updatedAt: new Date().toISOString()
        }
        
        if (writeGalleryImages(galleryImages)) {
          return NextResponse.json({
            success: true,
            message: 'تصویر با موفقیت به‌روزرسانی شد',
            data: galleryImages[imageIndex]
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در به‌روزرسانی تصویر' }, { status: 500 })
        }
        
      case 'delete':
        if (!imageId) {
          return NextResponse.json({ success: false, message: 'شناسه تصویر لازم است' }, { status: 400 })
        }
        
        const deleteIndex = galleryImages.findIndex((img: GalleryImage) => img.id === parseInt(imageId))
        if (deleteIndex === -1) {
          return NextResponse.json({ success: false, message: 'تصویر یافت نشد' }, { status: 404 })
        }
        
        const imageToDelete = galleryImages[deleteIndex]
        
        // Delete image file if exists
        if (imageToDelete.image) {
          try {
            const imagePath = path.join(process.cwd(), 'public', imageToDelete.image)
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
            }
          } catch (deleteError) {
            console.error('Error deleting gallery image:', deleteError)
          }
        }
        
        galleryImages.splice(deleteIndex, 1)
        
        if (writeGalleryImages(galleryImages)) {
          return NextResponse.json({
            success: true,
            message: 'تصویر با موفقیت حذف شد'
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در حذف تصویر' }, { status: 500 })
        }
        
      default:
        return NextResponse.json({ success: false, message: 'عملیات نامعتبر' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/admin/gallery:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
