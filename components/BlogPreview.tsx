'use client'

import { Calendar, User, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { CardImage } from './OptimizedImage'

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  category: string
  tags: string[]
  image?: string
  views: number
  readTime: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function BlogPreview() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/posts?limit=3', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Blog API Response:', result) // Debug log
        if (result.success) {
          // Add excerpt from content if not present
          const postsWithExcerpt = (result.data || []).map((post: BlogPost) => ({
            ...post,
            excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || 'بدون توضیحات',
            date: post.createdAt || post.date || new Date().toISOString(),
            readTime: post.readTime || '5 دقیقه'
          }))
          console.log('Processed blog posts:', postsWithExcerpt) // Debug log
          setBlogPosts(postsWithExcerpt)
        }
      } else {
        console.error('Blog API Error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogPosts()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [fetchBlogPosts])

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">وبلاگ تخصصی</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            آخرین مقالات و راهنماهای تخصصی در زمینه تعمیر و نگهداری خودرو
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="glass-card-dark overflow-hidden animate-pulse">
                <div className="h-48 bg-dark-800"></div>
                <div className="p-6">
                  <div className="h-4 bg-dark-800 rounded mb-4"></div>
                  <div className="h-6 bg-dark-800 rounded mb-2"></div>
                  <div className="h-4 bg-dark-800 rounded mb-4"></div>
                  <div className="h-4 bg-dark-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className="glass-card-dark overflow-hidden group hover:scale-105 transition-all duration-500"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {post.image ? (
                  <CardImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    fill
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{post.title}</p>
                    </div>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 glass-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="glass-button p-3 rounded-full hover:scale-110 transition-all duration-300">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center text-gray-400 text-sm mb-4 space-x-4 space-x-reverse">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-2" />
                    <span>{new Date(post.date).toLocaleDateString('fa-IR')}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 ml-2" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 ml-2" />
                    <span>{(post.views || 0).toLocaleString()} بازدید</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                {/* Read More */}
                <Link
                  href={`/blog/${post.id}`}
                  className="text-primary-500 hover:text-primary-400 font-semibold text-sm flex items-center group-hover:mr-2 transition-all duration-300"
                >
                  ادامه مطلب
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:mr-0 transition-all duration-300" />
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

        {/* View All Button */}
        {blogPosts.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary text-lg px-8 py-4">
              مشاهده همه مقالات
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}