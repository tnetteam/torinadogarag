import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'data', 'categories.json')

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  type: 'blog' | 'news'
  color?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize categories file if it doesn't exist
if (!fs.existsSync(CATEGORIES_FILE_PATH)) {
  const initialCategories = [
    {
      id: 1,
      name: 'تعمیر',
      slug: 'repair',
      type: 'blog',
      description: 'مقالات مربوط به تعمیر خودرو',
      color: '#ef4444',
      icon: '🔧',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'نگهداری',
      slug: 'maintenance',
      type: 'blog',
      description: 'مقالات مربوط به نگهداری خودرو',
      color: '#3b82f6',
      icon: '🛠️',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'تکنولوژی',
      slug: 'technology',
      type: 'blog',
      description: 'مقالات مربوط به تکنولوژی خودرو',
      color: '#8b5cf6',
      icon: '⚡',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'ایمنی',
      slug: 'safety',
      type: 'blog',
      description: 'مقالات مربوط به ایمنی خودرو',
      color: '#10b981',
      icon: '🛡️',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'برقی',
      slug: 'electrical',
      type: 'blog',
      description: 'مقالات مربوط به سیستم برقی خودرو',
      color: '#f59e0b',
      icon: '🔌',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      name: 'خودروهای جدید',
      slug: 'new-cars',
      type: 'news',
      description: 'اخبار مربوط به خودروهای جدید',
      color: '#06b6d4',
      icon: '🚗',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 7,
      name: 'خودروهای برقی',
      slug: 'electric-cars',
      type: 'news',
      description: 'اخبار مربوط به خودروهای برقی',
      color: '#84cc16',
      icon: '🔋',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 8,
      name: 'خودروهای لوکس',
      slug: 'luxury-cars',
      type: 'news',
      description: 'اخبار مربوط به خودروهای لوکس',
      color: '#f97316',
      icon: '💎',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(initialCategories, null, 2))
}

function readCategories() {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading categories:', error)
    return []
  }
}

function writeCategories(categories: Category[]) {
  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2))
    return true
  } catch (error) {
    console.error('Error writing categories:', error)
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
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'blog' or 'news'
    
    const categories = readCategories()
    
    // Filter by type if specified
    const filteredCategories = type ? categories.filter((cat: Category) => cat.type === type) : categories
    
    return NextResponse.json({
      success: true,
      data: filteredCategories
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error)
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
    const { action, categoryData, categoryId } = body
    
    const categories = readCategories()
    
    switch (action) {
      case 'create':
        const newId = Math.max(...categories.map((c: Category) => c.id), 0) + 1
        const newCategory = {
          id: newId,
          ...categoryData,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        categories.push(newCategory)
        
        if (writeCategories(categories)) {
          return NextResponse.json({
            success: true,
            message: 'دسته‌بندی با موفقیت ایجاد شد',
            data: newCategory
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در ذخیره دسته‌بندی' }, { status: 500 })
        }
        
      case 'update':
        const categoryIndex = categories.findIndex((c: Category) => c.id === categoryId)
        if (categoryIndex === -1) {
          return NextResponse.json({ success: false, message: 'دسته‌بندی یافت نشد' }, { status: 404 })
        }
        
        categories[categoryIndex] = {
          ...categories[categoryIndex],
          ...categoryData,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
          updatedAt: new Date().toISOString()
        }
        
        if (writeCategories(categories)) {
          return NextResponse.json({
            success: true,
            message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
            data: categories[categoryIndex]
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در به‌روزرسانی دسته‌بندی' }, { status: 500 })
        }
        
      case 'delete':
        const deleteIndex = categories.findIndex((c: Category) => c.id === categoryId)
        if (deleteIndex === -1) {
          return NextResponse.json({ success: false, message: 'دسته‌بندی یافت نشد' }, { status: 404 })
        }
        
        categories.splice(deleteIndex, 1)
        
        if (writeCategories(categories)) {
          return NextResponse.json({
            success: true,
            message: 'دسته‌بندی با موفقیت حذف شد'
          })
        } else {
          return NextResponse.json({ success: false, message: 'خطا در حذف دسته‌بندی' }, { status: 500 })
        }
        
      default:
        return NextResponse.json({ success: false, message: 'عملیات نامعتبر' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
