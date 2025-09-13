import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const GALLERY_FILE_PATH = path.join(process.cwd(), 'data', 'gallery-images.json')

function readGalleryImages() {
  try {
    if (!fs.existsSync(GALLERY_FILE_PATH)) {
      return []
    }
    const data = fs.readFileSync(GALLERY_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading gallery images:', error)
    return []
  }
}

export async function GET() {
  try {
    const galleryImages = readGalleryImages()
    
    return NextResponse.json({
      success: true,
      data: galleryImages
    })
    
  } catch (error) {
    console.error('Error in GET /api/gallery:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در دریافت تصاویر گالری' 
    }, { status: 500 })
  }
}