import { NextResponse } from 'next/server'
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

function readSliderImages() {
  try {
    if (!fs.existsSync(SLIDER_FILE_PATH)) {
      return []
    }
    const data = fs.readFileSync(SLIDER_FILE_PATH, 'utf8')
    const slides = JSON.parse(data)
    // Return only active slides, sorted by order
    return slides
      .filter((slide: Slide) => slide.status === 'active')
      .sort((a: Slide, b: Slide) => a.order - b.order)
  } catch (error) {
    console.error('Error reading slider images:', error)
    return []
  }
}

export async function GET() {
  try {
    const slides = readSliderImages()
    
    return NextResponse.json({
      success: true,
      data: slides
    })
    
  } catch (error) {
    console.error('Error in GET /api/slider:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در دریافت تصاویر اسلایدر' 
    }, { status: 500 })
  }
}
