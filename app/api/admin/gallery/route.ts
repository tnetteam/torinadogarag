import { NextRequest, NextResponse } from 'next/server'
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
    
    const body = await request.json()
    const { action, imageData, imageId } = body
    
    const galleryImages = readGalleryImages()
    
    switch (action) {
      case 'create':
        const newId = Math.max(...galleryImages.map((img: GalleryImage) => img.id), 0) + 1
        const newImage = {
          id: newId,
          ...imageData,
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
        const imageIndex = galleryImages.findIndex((img: GalleryImage) => img.id === imageId)
        if (imageIndex === -1) {
          return NextResponse.json({ success: false, message: 'تصویر یافت نشد' }, { status: 404 })
        }
        
        galleryImages[imageIndex] = {
          ...galleryImages[imageIndex],
          ...imageData,
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
        const deleteIndex = galleryImages.findIndex((img: GalleryImage) => img.id === imageId)
        if (deleteIndex === -1) {
          return NextResponse.json({ success: false, message: 'تصویر یافت نشد' }, { status: 404 })
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
