import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Eye, ArrowLeft, Clock } from 'lucide-react'

export async function generateStaticParams() {
  // در build time، از فایل JSON مستقیماً بخوانیم
  try {
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    if (fs.existsSync(blogPostsPath)) {
      const data = fs.readFileSync(blogPostsPath, 'utf8')
      const posts = JSON.parse(data)
      
      return posts
        .filter((post: BlogPost) => post.status === 'published')
        .map((post: BlogPost) => ({
          id: post.id.toString(),
        }))
    }
  } catch (error) {
    console.error('Error generating static params:', error)
  }
  
  return []
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id)
  
  if (!post) {
    return {
      title: 'مقاله یافت نشد - گاراژ تخصصی مکانیکی'
    }
  }

  return {
    title: `${post.title} - گاراژ تخصصی مکانیکی`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || '',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  }
}

async function getBlogPost(id: string) {
  try {
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    if (fs.existsSync(blogPostsPath)) {
      const data = fs.readFileSync(blogPostsPath, 'utf8')
      const posts = JSON.parse(data)
      
      const post = posts.find((post: BlogPost) => post.id.toString() === id && post.status === 'published')
      return post
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
  }
  
  return null
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-header border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              بازگشت به وبلاگ
            </Link>
            <div className="text-sm text-gray-400">
              {new Date(post.date || post.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-400 text-sm rounded-full border border-primary-500/30">
                {post.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center">
                <User className="w-5 h-5 ml-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 ml-2" />
                <span>{new Date(post.date || post.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 ml-2" />
                <span>{(post.views || 0).toLocaleString()} بازدید</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 ml-2" />
                <span>{Math.ceil(post.content.length / 200)} دقیقه</span>
              </div>
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-dark-800 text-gray-300 text-sm rounded-full border border-dark-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-12">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="glass-card-dark p-8">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-gray-400">
                <p className="text-sm">نوشته شده توسط <span className="text-white font-medium">{post.author}</span></p>
                <p className="text-xs mt-1">در تاریخ {new Date(post.date || post.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <Link 
                href="/blog" 
                className="btn-primary"
              >
                مشاهده مقالات دیگر
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  )
}
