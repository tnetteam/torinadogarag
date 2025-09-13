// Data management utilities for the garage website

export interface Service {
  id: number
  name: string
  description: string
  price: string
  status: 'active' | 'inactive'
  features: string[]
  icon?: string
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  status: 'published' | 'draft'
  views: number
  likes: number
  image?: string
  imageAlt?: string
  slug: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
}

export interface GalleryImage {
  id: number
  name: string
  url: string
  alt: string
  size: string
  date: string
  category?: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: 'new' | 'read' | 'replied'
}

// Sample data - in production, this would come from a database
export const sampleServices: Service[] = [
  {
    id: 1,
    name: "تعمیر موتور",
    description: "تعمیر و بازسازی کامل موتور خودروهای آلمانی و چینی با استفاده از قطعات اورجینال",
    price: "500000",
    status: "active",
    features: ["تعمیر موتور", "تعویض قطعات", "تنظیم موتور", "تست عملکرد"]
  },
  {
    id: 2,
    name: "تعمیر گیربکس",
    description: "تعمیر تخصصی گیربکس دستی و اتوماتیک با تجهیزات مدرن و تکنولوژی پیشرفته",
    price: "800000",
    status: "active",
    features: ["تعمیر گیربکس", "تعویض روغن", "تنظیم کلاچ", "تست عملکرد"]
  },
  {
    id: 3,
    name: "سیستم برقی",
    description: "تشخیص و تعمیر مشکلات سیستم برقی خودرو شامل باتری، دینام و استارت",
    price: "300000",
    status: "active",
    features: ["تشخیص برقی", "تعمیر دینام", "تعویض باتری", "سیم‌کشی"]
  },
  {
    id: 4,
    name: "سیستم خنک‌کننده",
    description: "تعمیر و نگهداری سیستم خنک‌کننده موتور شامل رادیاتور، پمپ آب و ترموستات",
    price: "250000",
    status: "active",
    features: ["تعمیر رادیاتور", "تعویض پمپ آب", "تنظیم ترموستات", "شستشو سیستم"]
  },
  {
    id: 5,
    name: "سیستم ترمز",
    description: "تعمیر و نگهداری سیستم ترمز شامل لنت، دیسک، کالیپر و سیلندر ترمز",
    price: "400000",
    status: "active",
    features: ["تعویض لنت", "تعمیر دیسک", "تنظیم کالیپر", "تست سیستم"]
  },
  {
    id: 6,
    name: "تعمیرات کلی",
    description: "خدمات جامع تعمیر و نگهداری خودرو شامل سرویس دوره‌ای و تعمیرات پیشگیرانه",
    price: "600000",
    status: "active",
    features: ["سرویس دوره‌ای", "تعمیرات پیشگیرانه", "بررسی فنی", "گزارش وضعیت"]
  }
]

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "نکات مهم برای نگهداری خودروهای آلمانی",
    excerpt: "خودروهای آلمانی به دلیل کیفیت بالا و تکنولوژی پیشرفته نیاز به نگهداری خاصی دارند. در این مقاله نکات مهم نگهداری را بررسی می‌کنیم.",
    content: "محتوای کامل مقاله...",
    author: "مهندس احمدی",
    date: "2024-01-15",
    category: "نگهداری",
    tags: ["خودرو آلمانی", "نگهداری", "BMW", "Mercedes"],
    status: "published",
    views: 1250,
    likes: 45,
    slug: "نکات-مهم-برای-نگهداری-خودروهای-آلمانی",
    seoTitle: "نکات نگهداری خودروهای آلمانی | گاراژ تخصصی",
    seoDescription: "راهنمای کامل نگهداری خودروهای آلمانی شامل BMW، Mercedes و سایر برندها",
    keywords: ["خودرو آلمانی", "نگهداری", "BMW", "Mercedes", "تعمیر"]
  },
  {
    id: 2,
    title: "مشکلات رایج خودروهای چینی و راه‌حل‌ها",
    excerpt: "خودروهای چینی در سال‌های اخیر محبوبیت زیادی پیدا کرده‌اند. در این مقاله مشکلات رایج و راه‌حل‌های آن‌ها را بررسی می‌کنیم.",
    content: "محتوای کامل مقاله...",
    author: "مهندس رضایی",
    date: "2024-01-12",
    category: "تعمیرات",
    tags: ["خودرو چینی", "تعمیرات", "Chery", "Geely"],
    status: "published",
    views: 890,
    likes: 32,
    slug: "مشکلات-رایج-خودروهای-چینی-و-راه-حل-ها",
    seoTitle: "مشکلات خودروهای چینی | راه‌حل‌های تخصصی",
    seoDescription: "تشخیص و حل مشکلات رایج خودروهای چینی شامل Chery، Geely و سایر برندها",
    keywords: ["خودرو چینی", "تعمیرات", "Chery", "Geely", "مشکلات"]
  }
]

export const sampleGalleryImages: GalleryImage[] = [
  {
    id: 1,
    name: "گاراژ-1.jpg",
    url: "/gallery/garage-1.jpg",
    alt: "گاراژ تخصصی - نمای کلی",
    size: "2.5 MB",
    date: "2024-01-15",
    category: "گاراژ"
  },
  {
    id: 2,
    name: "گاراژ-2.jpg",
    url: "/gallery/garage-2.jpg",
    alt: "تجهیزات مدرن تعمیر",
    size: "1.8 MB",
    date: "2024-01-14",
    category: "تجهیزات"
  }
]

// Utility functions
export function getServiceById(id: number): Service | undefined {
  return sampleServices.find(service => service.id === id)
}

export function getBlogPostById(id: number): BlogPost | undefined {
  return sampleBlogPosts.find(post => post.id === id)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return sampleBlogPosts.find(post => post.slug === slug)
}

export function getPublishedBlogPosts(): BlogPost[] {
  return sampleBlogPosts.filter(post => post.status === 'published')
}

export function getActiveServices(): Service[] {
  return sampleServices.filter(service => service.status === 'active')
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return sampleBlogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return sampleBlogPosts.filter(post => post.category === category)
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return sampleBlogPosts.filter(post => post.tags.includes(tag))
}
