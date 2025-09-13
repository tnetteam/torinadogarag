'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('همه')

  // Sample blog posts - in real project, these would come from API
  const blogPosts = [
    {
      id: 1,
      title: "نکات مهم برای نگهداری خودروهای آلمانی",
      excerpt: "خودروهای آلمانی به دلیل کیفیت بالا و تکنولوژی پیشرفته نیاز به نگهداری خاصی دارند. در این مقاله نکات مهم نگهداری را بررسی می‌کنیم.",
      image: "/blog/german-cars.jpg",
      author: "مهندس احمدی",
      date: "2024-01-15",
      readTime: "5 دقیقه",
      category: "نگهداری",
      tags: ["خودرو آلمانی", "نگهداری", "BMW", "Mercedes"]
    },
    {
      id: 2,
      title: "مشکلات رایج خودروهای چینی و راه‌حل‌ها",
      excerpt: "خودروهای چینی در سال‌های اخیر محبوبیت زیادی پیدا کرده‌اند. در این مقاله مشکلات رایج و راه‌حل‌های آن‌ها را بررسی می‌کنیم.",
      image: "/blog/chinese-cars.jpg",
      author: "مهندس رضایی",
      date: "2024-01-12",
      readTime: "7 دقیقه",
      category: "تعمیرات",
      tags: ["خودرو چینی", "تعمیرات", "Chery", "Geely"]
    },
    {
      id: 3,
      title: "تشخیص مشکلات موتور با استفاده از صدا",
      excerpt: "صداهای غیرعادی موتور می‌توانند نشان‌دهنده مشکلات مختلفی باشند. در این مقاله نحوه تشخیص مشکلات از طریق صدا را آموزش می‌دهیم.",
      image: "/blog/engine-sound.jpg",
      author: "مهندس محمدی",
      date: "2024-01-10",
      readTime: "6 دقیقه",
      category: "تشخیص",
      tags: ["موتور", "تشخیص عیب", "صدا", "تعمیر"]
    },
    {
      id: 4,
      title: "راهنمای کامل تعمیر گیربکس اتوماتیک",
      excerpt: "گیربکس اتوماتیک یکی از پیچیده‌ترین بخش‌های خودرو است. در این مقاله راهنمای کاملی برای تعمیر و نگهداری آن ارائه می‌دهیم.",
      image: "/blog/automatic-transmission.jpg",
      author: "مهندس کریمی",
      date: "2024-01-08",
      readTime: "8 دقیقه",
      category: "تعمیرات",
      tags: ["گیربکس", "اتوماتیک", "تعمیر", "نگهداری"]
    },
    {
      id: 5,
      title: "نحوه تشخیص و تعمیر مشکلات سیستم برقی",
      excerpt: "سیستم برقی خودرو شامل اجزای مختلفی است که هر کدام می‌توانند دچار مشکل شوند. در این مقاله نحوه تشخیص و تعمیر آن‌ها را بررسی می‌کنیم.",
      image: "/blog/electrical-system.jpg",
      author: "مهندس نوری",
      date: "2024-01-05",
      readTime: "6 دقیقه",
      category: "تشخیص",
      tags: ["سیستم برقی", "باتری", "دینام", "تشخیص"]
    },
    {
      id: 6,
      title: "مقایسه روغن‌های موتور و انتخاب بهترین نوع",
      excerpt: "انتخاب روغن موتور مناسب برای عملکرد بهتر و عمر طولانی‌تر موتور بسیار مهم است. در این مقاله انواع روغن‌ها را مقایسه می‌کنیم.",
      image: "/blog/motor-oil.jpg",
      author: "مهندس صادقی",
      date: "2024-01-03",
      readTime: "5 دقیقه",
      category: "نگهداری",
      tags: ["روغن موتور", "نگهداری", "مقایسه", "انتخاب"]
    }
  ]

  const categories = ['همه', 'نگهداری', 'تعمیرات', 'تشخیص']

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'همه' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در مقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{post.title}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <Link 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                >
                  ادامه مطلب
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              مقاله‌ای یافت نشد
            </h3>
            <p className="text-gray-600">
              لطفاً کلمات کلیدی دیگری را امتحان کنید
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn-primary">
              مشاهده مقالات بیشتر
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
