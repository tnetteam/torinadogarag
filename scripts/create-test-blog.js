#!/usr/bin/env node

/**
 * Create Test Blog Post
 * Creates a sample blog post for testing
 */

const fs = require('fs')
const path = require('path')

const BLOG_POSTS_FILE_PATH = path.join(process.cwd(), 'data', 'blog-posts.json')

const testBlogPost = {
  id: Date.now(),
  title: "تست مقاله جدید - نگهداری خودرو",
  content: "این یک مقاله تستی است که برای بررسی عملکرد سیستم وبلاگ ایجاد شده است. در این مقاله نکات مهم نگهداری خودرو را بررسی می‌کنیم. نگهداری منظم خودرو باعث افزایش عمر مفید آن و کاهش هزینه‌های تعمیرات می‌شود. از جمله نکات مهم می‌توان به تعویض روغن موتور، بررسی تایرها، تمیز کردن فیلتر هوا و بررسی سیستم ترمز اشاره کرد.",
  excerpt: "این یک مقاله تستی است که برای بررسی عملکرد سیستم وبلاگ ایجاد شده است. در این مقاله نکات مهم نگهداری خودرو را بررسی می‌کنیم...",
  author: "مدیر سایت",
  category: "نگهداری",
  tags: ["تست", "نگهداری", "خودرو", "مقاله"],
  status: "published",
  views: 0,
  likes: 0,
  image: "/images/blog-placeholder.jpg",
  imageAlt: "نگهداری خودرو",
  slug: "test-blog-post-maintenance",
  seoTitle: "تست مقاله - نگهداری خودرو",
  seoDescription: "مقاله تستی برای بررسی عملکرد سیستم وبلاگ",
  keywords: ["تست", "نگهداری خودرو", "مقاله"],
  date: new Date().toISOString().split('T')[0],
  readTime: "3 دقیقه",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Read existing blog posts
let blogPosts = []
if (fs.existsSync(BLOG_POSTS_FILE_PATH)) {
  try {
    const data = fs.readFileSync(BLOG_POSTS_FILE_PATH, 'utf8')
    blogPosts = JSON.parse(data)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    blogPosts = []
  }
}

// Add test blog post
blogPosts.unshift(testBlogPost)

// Write back to file
try {
  fs.writeFileSync(BLOG_POSTS_FILE_PATH, JSON.stringify(blogPosts, null, 2))
  console.log('✅ Test blog post created successfully!')
  console.log(`📝 Title: ${testBlogPost.title}`)
  console.log(`📊 Total blog posts: ${blogPosts.length}`)
  console.log(`📁 File: ${BLOG_POSTS_FILE_PATH}`)
} catch (error) {
  console.error('❌ Error writing blog posts:', error)
}
