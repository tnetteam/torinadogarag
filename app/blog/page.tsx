import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'

interface BlogPost {
  id: number
  title: string
  content: string
  author: string
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
  createdAt: string
  updatedAt: string
  excerpt?: string
  date?: string
}

export const metadata: Metadata = {
  title: 'وبلاگ - گاراژ تخصصی مکانیکی',
  description: 'مقالات و راهنماهای تخصصی تعمیر خودروهای آلمانی و چینی',
  keywords: 'وبلاگ، تعمیر خودرو، نگهداری، BMW، Mercedes، Audi، Geely، BYD',
}

async function getBlogPosts() {
  try {
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    if (fs.existsSync(blogPostsPath)) {
      const data = fs.readFileSync(blogPostsPath, 'utf8')
      const posts = JSON.parse(data)
      return posts.filter((post: BlogPost) => post.status === 'published')
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  }
  
  return []
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="text-gradient">وبلاگ تخصصی</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            مقالات و راهنماهای تخصصی برای تعمیر و نگهداری خودروهای آلمانی و چینی
          </p>
        </div>

        {/* Blog Posts Grid */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: BlogPost) => (
              <article key={post.id} className="glass-card-dark overflow-hidden group hover:scale-105 transition-all duration-300">
                {/* Image */}
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full border border-primary-500/30">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>👤 {post.author}</span>
                    <span>📅 {new Date(post.date || post.createdAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>👁️ {post.views?.toLocaleString() || 0} بازدید</span>
                    <span>⏱️ {Math.ceil(post.content.length / 200)} دقیقه</span>
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-dark-800 text-gray-300 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Read More Button */}
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    ادامه مطلب
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card-dark p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">هیچ مقاله‌ای یافت نشد</h3>
              <p className="text-gray-400">هنوز مقاله‌ای منتشر نشده است.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}