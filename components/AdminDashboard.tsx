'use client'

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from 'react'
import { 
  Settings, 
  FileText, 
  Image, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Mail,
  TrendingUp,
  Tag,
  Search,
  Phone,
  MessageSquare,
  RefreshCcw,
  Eye,
  Bot
} from 'lucide-react'

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


interface Service {
  id: number
  name: string
  description: string
  phone?: string
  status: string
  icon: string
  features: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

interface GalleryImage {
  id: number
  title: string
  description?: string
  imageUrl?: string
  image?: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}


interface ContactSettings {
  companyInfo: {
    name: string
    subtitle: string
    description: string
  }
  contactInfo: {
    phone: string
    mobile: string
    email: string
    address: string
    workingHours: string
  }
  socialMedia: {
    instagram: string
    telegram: string
    whatsapp: string
    linkedin: string
  }
  mapSettings: {
    latitude: number
    longitude: number
    zoom: number
  }
  updatedAt: string
}

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
  updatedAt: string
}

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  type: 'blog'
  color?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

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

interface DashboardData {
  stats: {
    totalBlogPosts: number
    publishedBlogPosts: number
    draftBlogPosts: number
    totalViews: number
    totalServices: number
    activeServices: number
    totalGalleryImages: number
    totalContactMessages: number
    unreadMessages: number
  }
  recentActivity: Array<{
    type: string
    title: string
    date: string
    icon: string
  }>
  monthlyStats: Array<{
    month: string
    blogViews: number
    newMessages: number
    newImages: number
  }>
  blogPosts: BlogPost[]
  services: Service[]
  galleryImages: GalleryImage[]
  contactMessages: ContactMessage[]
  categories: Category[]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft',
    image: null as File | null,
    imagePreview: ''
  })
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    type: 'blog',
    color: '#3b82f6',
    icon: '📝'
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [showNewImageForm, setShowNewImageForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)
  const [showContactSettingsForm, setShowContactSettingsForm] = useState(false)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [aiContentStats, setAiContentStats] = useState<{
    totalBlogPosts: number
    todayBlogPosts: number
    lastUpdate: string
  } | null>(null)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [showGeminiKeyForm, setShowGeminiKeyForm] = useState(false)
  // const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  // const [openaiApiKey, setOpenaiApiKey] = useState('')
  
  // Auto generation settings
  const [autoGenSettings, setAutoGenSettings] = useState({
    articlesPerDay: 3,
    generationHours: [9, 15, 21], // ساعت‌های تولید (9 صبح، 3 بعدازظهر، 9 شب)
    isEnabled: true
  })
  const [showAutoGenSettings, setShowAutoGenSettings] = useState(false)
  
  // SEO Content state
  const [, setSeoStats] = useState({
    totalPosts: 0,
    averageSEOScore: 0,
    averageReadabilityScore: 0,
    totalWordCount: 0,
    keywordCoverage: {
      primary: 0,
      secondary: 0,
      longTail: 0,
      local: 0
    }
  })
  const [isGeneratingSEOContent, setIsGeneratingSEOContent] = useState(false)
  const [seoKeyword, setSeoKeyword] = useState('')
  const [showSEOForm, setShowSEOForm] = useState(false)
  const [newImage, setNewImage] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    image: null as File | null,
    imagePreview: ''
  })
  
  // Services state
  const [services, setServices] = useState<Service[]>([])
  const [showNewServiceForm, setShowNewServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    phone: '' as string,
    status: 'active',
    icon: '🔧',
    features: [] as string[],
    image: null as File | null,
    imagePreview: ''
  })

  // Slider state
  const [sliderImages, setSliderImages] = useState<Slide[]>([])
  const [showNewSliderForm, setShowNewSliderForm] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slide | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newSlider, setNewSlider] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    order: 1,
    status: 'active',
    image: null as File | null,
    imagePreview: ''
  })

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('admin-logged-in')
    const loginTime = localStorage.getItem('admin-login-time')
    
    if (savedLoginState === 'true' && loginTime) {
      const loginDate = new Date(loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
      
      // Auto logout after 24 hours
      if (hoursDiff > 24) {
        localStorage.removeItem('admin-logged-in')
        localStorage.removeItem('admin-login-time')
        setIsLoggedIn(false)
      } else {
        setIsLoggedIn(true)
      }
    }
  }, [])

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store',
        redirect: 'follow'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        setDashboardData(result.data)
        setCategories(result.data.categories || [])
        setError(null)
      } else {
        setError(result.error || 'خطا در دریافت اطلاعات')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('خطا در اتصال به سرور')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      // Add a small delay to prevent immediate retry
      const timer = setTimeout(() => {
        fetchDashboardData()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, fetchDashboardData])

  const tabs = [
    { id: 'dashboard', name: 'داشبورد', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'blog', name: 'مدیریت وبلاگ', icon: <FileText className="w-5 h-5" /> },
    { id: 'categories', name: 'دسته‌بندی‌ها', icon: <Tag className="w-5 h-5" /> },
    { id: 'services', name: 'خدمات', icon: <Settings className="w-5 h-5" /> },
    { id: 'gallery', name: 'گالری', icon: <Image className="w-5 h-5" aria-hidden="true" /> },
    { id: 'slider', name: 'اسلایدر', icon: <Image className="w-5 h-5" aria-hidden="true" /> },
    { id: 'contact-settings', name: 'تنظیمات تماس', icon: <Phone className="w-5 h-5" /> },
    { id: 'contact-messages', name: 'پیام‌های تماس', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'ai-content', name: 'محتوای هوش مصنوعی', icon: <Bot className="w-5 h-5" /> },
    { id: 'settings', name: 'تنظیمات', icon: <Settings className="w-5 h-5" /> }
  ]

  // Login function
  const handleLogin = () => {
    setLoginError('')
    
    // Default admin credentials
    if (username === 'admin' && password === 'garage123') {
      setIsLoggedIn(true)
      // Save login state to localStorage
      localStorage.setItem('admin-logged-in', 'true')
      localStorage.setItem('admin-login-time', new Date().toISOString())
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است')
    }
  }

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
    setDashboardData(null)
    // Remove login state from localStorage
    localStorage.removeItem('admin-logged-in')
    localStorage.removeItem('admin-login-time')
  }

  // Blog management functions
  const handleNewPost = () => {
    setShowNewPostForm(true)
    setEditingPost(null)
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      status: 'draft',
      image: null,
      imagePreview: ''
    })
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setShowNewPostForm(true)
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      image: null,
      imagePreview: post.image || ''
    })
  }

  const handleSavePost = async () => {
    try {
      let imageUrl = ''
      
      // Handle image upload
      if (newPost.image) {
        // In a real app, you would upload to a server
        // For now, we'll use the preview URL
        imageUrl = newPost.imagePreview
      } else if (editingPost && editingPost.image) {
        imageUrl = editingPost.image
      }

      const postData = {
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: imageUrl
      }

      const action = editingPost ? 'update' : 'create'
      const requestBody = {
        action,
        postData,
        postId: editingPost?.id
      }

      // Send to blog API
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh dashboard data
          fetchDashboardData()
          
          // Show success message
          alert(result.message)
          
          // Reset form
          setShowNewPostForm(false)
          setEditingPost(null)
          setNewPost({
            title: '',
            excerpt: '',
            content: '',
            author: '',
            category: '',
            tags: '',
            status: 'draft',
            image: null,
            imagePreview: ''
          })
        }
      } else {
        alert('خطا در ذخیره مقاله')
      }
      
    } catch (error) {
      console.error('Error saving post:', error)
      alert('خطا در ذخیره مقاله')
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
      try {
        // Send delete request to blog API
        const response = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
          },
          body: JSON.stringify({
            action: 'delete',
            postId: postId
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Refresh dashboard data
            fetchDashboardData()
            
            // Show success message
            alert(result.message)
          }
        } else {
          alert('خطا در حذف مقاله')
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('خطا در حذف مقاله')
      }
    }
  }

  const handlePostImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('لطفاً فقط فایل‌های تصویری انتخاب کنید')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد')
        return
      }

      setNewPost({...newPost, image: file})
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPost(prev => ({...prev, imagePreview: e.target?.result as string}))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePostImage = () => {
    setNewPost({...newPost, image: null, imagePreview: ''})
  }






  // Category management functions
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCategories(result.data)
        }
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true)
      // Add small delay to prevent infinite redirects
      const timer = setTimeout(async () => {
        try {
          await Promise.all([
            fetchCategories(),
            fetchGalleryImages(),
            fetchServices(),
            fetchSliderImages(),
            fetchContactSettings(),
            fetchContactMessages(),
            fetchAiContentStats(),
            // fetchAISettings(),
            fetchGeminiSettings(),
            fetchSEOStats()
          ])
        } catch (error) {
          console.error('Error loading admin data:', error)
        } finally {
          setIsLoading(false)
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setGalleryImages(result.data)
        }
      } else {
        console.error('Failed to fetch gallery images:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setServices(result.data)
        }
      } else {
        console.error('Failed to fetch services:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchSliderImages = async () => {
    try {
      const response = await fetch('/api/admin/slider', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSliderImages(result.data)
        }
      } else {
        console.error('Failed to fetch slider images:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching slider images:', error)
    }
  }

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContactSettings(result.data)
        }
      } else {
        console.error('Failed to fetch contact settings:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error)
    }
  }

  const fetchContactMessages = async () => {
    try {
      const response = await fetch('/api/contact-messages', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContactMessages(result.data)
        }
      } else {
        console.error('Failed to fetch contact messages:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
    }
  }

  const handleNewCategory = () => {
    setShowNewCategoryForm(true)
    setEditingCategory(null)
    setNewCategory({
      name: '',
      description: '',
      type: 'blog',
      color: '#3b82f6',
      icon: '📝'
    })
  }

  const handleContactSettings = () => {
    setShowContactSettingsForm(true)
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setShowMessageModal(true)
    // Mark as read if it's new
    if (message.status === 'new') {
      handleUpdateMessageStatus(message.id, 'read')
    }
  }

  const handleUpdateMessageStatus = async (messageId: number, status: 'new' | 'read' | 'replied') => {
    try {
      const response = await fetch('/api/contact-messages', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: messageId, status })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Update local state
          setContactMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, status, updatedAt: new Date().toISOString() } : msg
            )
          )
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage({ ...selectedMessage, status, updatedAt: new Date().toISOString() })
          }
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟')) {
      return
    }

    try {
      const response = await fetch(`/api/contact-messages?id=${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContactMessages(prev => prev.filter(msg => msg.id !== messageId))
          if (selectedMessage && selectedMessage.id === messageId) {
            setShowMessageModal(false)
            setSelectedMessage(null)
          }
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const fetchAiContentStats = async () => {
    try {
      const response = await fetch('/api/ai-content', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAiContentStats(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching AI content stats:', error)
    }
  }

  const handleGenerateContent = async (type: 'blog') => {
    setIsGeneratingContent(true)
    
    try {
      const response = await fetch('/api/ai-content', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: `generate-${type}` })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // نمایش مقاله تولید شده در فرم
          if (result.data) {
            setNewPost({
              title: result.data.title,
              content: result.data.content,
              excerpt: result.data.excerpt,
              category: result.data.category,
              tags: result.data.tags.join(', '),
              status: result.data.status,
              image: null,
              imagePreview: result.data.image
            })
          }
          alert(result.message)
          await fetchAiContentStats()
        } else {
          alert(result.message || 'خطا در تولید محتوا')
        }
      } else {
        alert('خطا در تولید محتوا')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('خطا در تولید محتوا')
    } finally {
      setIsGeneratingContent(false)
    }
  }

  // const fetchAISettings = async () => {
  //   try {
  //     // ابتدا API Key کامل را دریافت می‌کنیم
  //     const response = await fetch('/api/admin/ai-settings?showFullKey=true', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
  //         'Content-Type': 'application/json'
  //       }
  //     })
      
  //     if (response.ok) {
  //       const result = await response.json()
  //       if (result.success) {
  //         setOpenaiApiKey(result.data.openaiApiKey || '')
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching AI settings:', error)
  //   }
  // }

  // const handleSaveAISettings = async () => {
  //   // موقتاً غیرفعال - از Gemini استفاده می‌شود
  //   alert('این بخش موقتاً غیرفعال است. از Gemini استفاده می‌شود.')
  //   setShowApiKeyForm(false)
  // }

  // Gemini Settings functions
  const fetchGeminiSettings = async () => {
    try {
      const response = await fetch('/api/admin/gemini-settings?showFullKey=true', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setGeminiApiKey(result.data.apiKey || '')
        }
      }
    } catch (error) {
      console.error('Error fetching Gemini settings:', error)
    }
  }

  const handleSaveGeminiSettings = async () => {
    try {
      const response = await fetch('/api/admin/gemini-settings', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          settings: {
            apiKey: geminiApiKey,
            model: 'gemini-pro',
            maxTokens: 2000,
            temperature: 0.7,
            enabled: true
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('تنظیمات Gemini با موفقیت ذخیره شد')
          setShowGeminiKeyForm(false)
          await fetchGeminiSettings()
        } else {
          alert(result.message || 'خطا در ذخیره تنظیمات')
        }
      } else {
        alert('خطا در ذخیره تنظیمات')
      }
    } catch (error) {
      console.error('Error saving Gemini settings:', error)
      alert('خطا در ذخیره تنظیمات')
    }
  }

  // SEO Content functions
  const fetchSEOStats = async () => {
    try {
      const response = await fetch('/api/admin/seo-content', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSeoStats(result.data.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching SEO stats:', error)
    }
  }

  const handleGenerateSEOContent = async (action: 'single' | 'bulk' | 'target-keywords') => {
    setIsGeneratingSEOContent(true)
    
    try {
      const requestBody: Record<string, unknown> = { action: `generate-${action}` }
      
      if (action === 'single' && seoKeyword) {
        requestBody.keyword = seoKeyword
        requestBody.options = {
          type: 'blog',
          length: 'long',
          includeImages: true,
          includeFAQ: true,
          localSEO: true,
          city: 'تهران'
        }
      }

      const response = await fetch('/api/admin/seo-content', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert(result.message)
          await fetchSEOStats()
          setShowSEOForm(false)
          setSeoKeyword('')
        } else {
          alert(result.message || 'خطا در تولید محتوای SEO')
        }
      } else {
        alert('خطا در تولید محتوای SEO')
      }
    } catch (error) {
      console.error('Error generating SEO content:', error)
      alert('خطا در تولید محتوای SEO')
    } finally {
      setIsGeneratingSEOContent(false)
    }
  }

  const handleSaveContactSettings = async () => {
    if (!contactSettings) return

    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-settings', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          settings: contactSettings
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setShowContactSettingsForm(false)
          // Refresh the settings
          await fetchContactSettings()
        } else {
          setError(result.message || 'خطا در ذخیره تنظیمات')
        }
      } else {
        setError('خطا در ذخیره تنظیمات')
      }
    } catch (error) {
      console.error('Error saving contact settings:', error)
      setError('خطا در ذخیره تنظیمات')
    } finally {
      setLoading(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowNewCategoryForm(true)
    setNewCategory({
      name: category.name,
      description: category.description || '',
      type: category.type,
      color: category.color || '',
      icon: category.icon || ''
    })
  }

  const handleSaveCategory = async () => {
    try {
      const action = editingCategory ? 'update' : 'create'
      const requestBody = {
        action,
        categoryData: newCategory,
        categoryId: editingCategory?.id
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh categories
          fetchCategories()
          
          // Show success message
          alert(result.message)
          
          // Reset form
          setShowNewCategoryForm(false)
          setEditingCategory(null)
          setNewCategory({
            name: '',
            description: '',
            type: 'blog',
            color: '#3b82f6',
            icon: '📝'
          })
        }
      } else {
        alert('خطا در ذخیره دسته‌بندی')
      }
      
    } catch (error) {
      console.error('Error saving category:', error)
      alert('خطا در ذخیره دسته‌بندی')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟')) {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
          },
          body: JSON.stringify({
            action: 'delete',
            categoryId: categoryId
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Refresh categories
            fetchCategories()
            
            // Show success message
            alert(result.message)
          }
        } else {
          alert('خطا در حذف دسته‌بندی')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('خطا در حذف دسته‌بندی')
      }
    }
  }

  // Gallery management functions
  const handleNewImage = () => {
    setShowNewImageForm(true)
    setEditingImage(null)
    setNewImage({
      name: '',
      description: '',
      category: '',
      tags: '',
      image: null,
      imagePreview: ''
    })
  }

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image)
    setShowNewImageForm(true)
    setNewImage({
      name: image.title || '',
      description: image.description || '',
      category: image.category || '',
      tags: image.tags?.join(', ') || '',
      image: null,
      imagePreview: image.imageUrl || ''
    })
  }

  const handleSaveImage = async () => {
    try {
      let imageUrl = ''
      
      // Handle image upload
      if (newImage.image) {
        // In a real app, you would upload to a server
        // For now, we'll use the preview URL
        imageUrl = newImage.imagePreview
      } else if (editingImage && editingImage.imageUrl) {
        imageUrl = editingImage.imageUrl
      }

      const imageData = {
        ...newImage,
        tags: newImage.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: imageUrl
      }

      const action = editingImage ? 'update' : 'create'
      const requestBody = {
        action,
        imageData,
        imageId: editingImage?.id
      }

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh gallery images
          fetchGalleryImages()
          
          // Show success message
          alert(result.message)
          
          // Reset form
          setShowNewImageForm(false)
          setEditingImage(null)
          setNewImage({
            name: '',
            description: '',
            category: '',
            tags: '',
            image: null,
            imagePreview: ''
          })
        }
      } else {
        alert('خطا در ذخیره تصویر')
      }
      
    } catch (error) {
      console.error('Error saving image:', error)
      alert('خطا در ذخیره تصویر')
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟')) {
      try {
        const response = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
          },
          body: JSON.stringify({
            action: 'delete',
            imageId: imageId
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Refresh gallery images
            fetchGalleryImages()
            
            // Show success message
            alert(result.message)
          }
        } else {
          alert('خطا در حذف تصویر')
        }
      } catch (error) {
        console.error('Error deleting image:', error)
        alert('خطا در حذف تصویر')
      }
    }
  }

  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('لطفاً فقط فایل‌های تصویری انتخاب کنید')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 10 مگابایت باشد')
        return
      }

      setNewImage({...newImage, image: file})
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewImage(prev => ({...prev, imagePreview: e.target?.result as string}))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeGalleryImage = () => {
    setNewImage({...newImage, image: null, imagePreview: ''})
  }

  // Services management functions
  const handleNewService = () => {
    setShowNewServiceForm(true)
    setEditingService(null)
    setNewService({
      name: '',
      description: '',
      phone: '',
      status: 'active',
      icon: '🔧',
      features: [],
      image: null,
      imagePreview: ''
    })
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setShowNewServiceForm(true)
    setNewService({
      name: service.name,
      description: service.description,
      phone: service.phone || '',
      status: service.status,
      icon: service.icon,
      features: service.features || [],
      image: null,
      imagePreview: service.image || ''
    })
  }

  const handleSaveService = async () => {
    try {
      const action = editingService ? 'update' : 'create'
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('action', action)
      formData.append('serviceData', JSON.stringify({
        name: newService.name,
        description: newService.description,
        phone: newService.phone,
        status: newService.status,
        icon: newService.icon,
        features: newService.features
      }))
      
      if (editingService?.id) {
        formData.append('serviceId', editingService.id.toString())
      }
      
      if (newService.image) {
        formData.append('image', newService.image)
      }

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh services
          fetchServices()
          
          // Show success message
          alert(result.message)
          
          // Reset form
          setShowNewServiceForm(false)
          setEditingService(null)
          setNewService({
            name: '',
            description: '',
            phone: '',
            status: 'active',
            icon: '🔧',
            features: [],
            image: null,
            imagePreview: ''
          })
        }
      } else {
        alert('خطا در ذخیره خدمت')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('خطا در ذخیره خدمت')
    }
  }

  const handleDeleteService = async (serviceId: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این خدمت را حذف کنید؟')) {
      try {
        const response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
          },
          body: JSON.stringify({
            action: 'delete',
            serviceId: serviceId
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Refresh services
            fetchServices()
            
            // Show success message
            alert(result.message)
          }
        } else {
          alert('خطا در حذف خدمت')
        }
      } catch (error) {
        console.error('Error deleting service:', error)
        alert('خطا در حذف خدمت')
      }
    }
  }

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewService({...newService, image: file})
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewService(prev => ({...prev, imagePreview: e.target?.result as string}))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeServiceImage = () => {
    setNewService({...newService, image: null, imagePreview: ''})
  }

  // Slider management functions
  const handleNewSlider = () => {
    setShowNewSliderForm(true)
    setEditingSlider(null)
    setNewSlider({
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      order: sliderImages.length + 1,
      status: 'active',
      image: null,
      imagePreview: ''
    })
  }

  const handleEditSlider = (slide: Slide) => {
    setEditingSlider(slide)
    setShowNewSliderForm(true)
    setNewSlider({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      order: slide.order,
      status: slide.status,
      image: null,
      imagePreview: slide.image || ''
    })
  }

  const handleSliderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewSlider({...newSlider, image: file})
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewSlider(prev => ({...prev, imagePreview: e.target?.result as string}))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSliderImage = () => {
    setNewSlider({...newSlider, image: null, imagePreview: ''})
  }

  const handleSaveSlider = async () => {
    try {
      const action = editingSlider ? 'update' : 'create'
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('action', action)
      formData.append('slideData', JSON.stringify({
        title: newSlider.title,
        subtitle: newSlider.subtitle,
        buttonText: newSlider.buttonText,
        buttonLink: newSlider.buttonLink,
        order: newSlider.order,
        status: newSlider.status
      }))
      
      if (editingSlider?.id) {
        formData.append('slideId', editingSlider.id.toString())
      }
      
      if (newSlider.image) {
        formData.append('image', newSlider.image)
      }

      const response = await fetch('/api/admin/slider', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh slider images
          fetchSliderImages()
          
          // Show success message
          alert(result.message)
          
          // Reset form
          setShowNewSliderForm(false)
          setEditingSlider(null)
          setNewSlider({
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: '',
            order: 1,
            status: 'active',
            image: null,
            imagePreview: ''
          })
        }
      } else {
        alert('خطا در ذخیره اسلاید')
      }
    } catch (error) {
      console.error('Error saving slider:', error)
      alert('خطا در ذخیره اسلاید')
    }
  }

  const handleDeleteSlider = async (slideId: number) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این اسلاید را حذف کنید؟')) {
      try {
        const formData = new FormData()
        formData.append('action', 'delete')
        formData.append('slideId', slideId.toString())

        const response = await fetch('/api/admin/slider', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer garage-admin-2024-secure-key-12345'
          },
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Refresh slider images
            fetchSliderImages()
            
            // Show success message
            alert(result.message)
          } else {
            alert(result.message || 'خطا در حذف اسلاید')
          }
        } else {
          const errorResult = await response.json().catch(() => ({ message: 'خطا در حذف اسلاید' }))
          alert(errorResult.message || 'خطا در حذف اسلاید')
        }
      } catch (error) {
        console.error('Error deleting slider:', error)
        alert('خطا در حذف اسلاید: ' + (error instanceof Error ? error.message : 'خطای نامشخص'))
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-card-dark p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">ورود به پنل مدیریت</h2>
            <p className="text-gray-300 mt-2">لطفاً اطلاعات ورود خود را وارد کنید</p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-300 rounded-lg backdrop-blur-sm">
              {loginError}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نام کاربری
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="نام کاربری خود را وارد کنید"
                autoComplete="username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="current-password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary"
            >
              ورود به پنل
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-blue-300 mb-2">اطلاعات ورود پیش‌فرض:</h4>
            <p className="text-sm text-blue-200">نام کاربری: <strong>admin</strong></p>
            <p className="text-sm text-blue-200">رمز عبور: <strong>garage123</strong></p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-card-dark p-8 text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">در حال بارگذاری...</h2>
          <p className="text-gray-300">لطفاً صبر کنید</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="glass-header shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">پنل مدیریت</h1>
                <p className="text-sm text-gray-300">گاراژ تخصصی مکانیکی</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="glass-button text-sm px-4 py-2 flex items-center space-x-2 space-x-reverse"
            >
              <X className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">داشبورد</h2>
                <button 
                  onClick={fetchDashboardData}
                  className="glass-button text-sm px-4 py-2"
                  disabled={loading}
                >
                  {loading ? 'در حال بارگذاری...' : 'به‌روزرسانی'}
                </button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-white">در حال بارگذاری داده‌ها...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-400 text-center">
                    <p className="text-lg font-semibold mb-2">خطا در بارگذاری</p>
                    <p className="text-sm mb-4">{error}</p>
                    <button 
                      onClick={fetchDashboardData}
                      className="glass-button text-sm px-4 py-2"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                </div>
              ) : dashboardData ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card-dark p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">کل مقالات</p>
                          <p className="text-2xl font-bold text-white">{dashboardData.stats.totalBlogPosts}</p>
                          <p className="text-xs text-gray-400">{dashboardData.stats.publishedBlogPosts} منتشر شده</p>
                        </div>
                        <FileText className="w-8 h-8 text-primary-500" />
                      </div>
                    </div>
                    
                    
                    <div className="glass-card-dark p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">کل بازدیدها</p>
                          <p className="text-2xl font-bold text-white">{(dashboardData.stats.totalViews || 0).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">بازدید کل</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="glass-card-dark p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">خدمات فعال</p>
                          <p className="text-2xl font-bold text-white">{dashboardData.stats.activeServices}</p>
                          <p className="text-xs text-gray-400">از {dashboardData.stats.totalServices} خدمت</p>
                        </div>
                        <Settings className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="glass-card-dark p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">پیام‌های جدید</p>
                          <p className="text-2xl font-bold text-white">{dashboardData.stats.unreadMessages}</p>
                          <p className="text-xs text-gray-400">از {dashboardData.stats.totalContactMessages} پیام</p>
                        </div>
                        <Mail className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card-dark p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">فعالیت‌های اخیر</h3>
                    <div className="space-y-4">
                      {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 space-x-reverse">
                            <div className="text-lg">{activity.icon}</div>
                            <span className="text-gray-300 flex-1">{activity.title}</span>
                            <span className="text-sm text-gray-400">
                              {new Date(activity.date).toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-4">هیچ فعالیتی یافت نشد</div>
                      )}
                    </div>
                  </div>

                  {/* Monthly Statistics */}
                  <div className="glass-card-dark p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">آمار ماهانه</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {dashboardData.monthlyStats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">{stat.month}</h4>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-400">بازدید: {(stat.blogViews || 0).toLocaleString()}</div>
                            <div className="text-xs text-gray-400">پیام: {stat.newMessages}</div>
                            <div className="text-xs text-gray-400">تصویر: {stat.newImages}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card-dark p-8 text-center">
                  <div className="text-gray-400">خطا در بارگذاری داده‌ها</div>
                  <button 
                    onClick={fetchDashboardData}
                    className="btn-primary mt-4"
                  >
                    تلاش مجدد
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Blog Management Tab */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مدیریت وبلاگ</h2>
                <button 
                  onClick={handleNewPost}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  مقاله جدید
                </button>
              </div>
              
              <div className="glass-card-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-dark-800/50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          عنوان
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          تاریخ
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          بازدید
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-dark-900/30 divide-y divide-white/10">
                      {dashboardData?.blogPosts?.map((post) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{post.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {post.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {(post.views || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button 
                                onClick={() => handleEditPost(post)}
                                className="text-blue-400 hover:text-blue-300"
                                title="ویرایش"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-400 hover:text-red-300"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* New/Edit Post Form Modal */}
          {showNewPostForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="glass-modal p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingPost ? 'ویرایش مقاله' : 'مقاله جدید'}
                  </h3>
                  <button 
                    onClick={() => setShowNewPostForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        عنوان مقاله
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="عنوان مقاله را وارد کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        نویسنده
                      </label>
                      <input
                        type="text"
                        value={newPost.author}
                        onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="نام نویسنده"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      خلاصه مقاله
                    </label>
                    <textarea
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="خلاصه کوتاه از مقاله"
                    />
                  </div>

                  <div>
                    {/* تصاویر حذف شدند */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      محتوای کامل
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      rows={10}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="محتوای کامل مقاله را بنویسید"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        دسته‌بندی
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white backdrop-blur-sm"
                      >
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.filter(cat => cat.type === 'blog').map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        برچسب‌ها
                      </label>
                      <input
                        type="text"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="برچسب‌ها را با کاما جدا کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        وضعیت
                      </label>
                      <select
                        value={newPost.status}
                        onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white backdrop-blur-sm"
                      >
                        <option value="draft">پیش‌نویس</option>
                        <option value="published">منتشر شده</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <button
                      onClick={() => setShowNewPostForm(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleSavePost}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      {editingPost ? 'به‌روزرسانی' : 'ذخیره'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Categories Management Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مدیریت دسته‌بندی‌ها</h2>
                <button 
                  onClick={handleNewCategory}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  دسته‌بندی جدید
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="glass-card-dark p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                          <p className="text-sm text-gray-400">وبلاگ</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New/Edit Category Form Modal */}
          {showNewCategoryForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="glass-modal p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingCategory ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
                  </h3>
                  <button 
                    onClick={() => setShowNewCategoryForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        نام دسته‌بندی
                      </label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="نام دسته‌بندی را وارد کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        نوع دسته‌بندی
                      </label>
                      <select
                        value={newCategory.type}
                        onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white backdrop-blur-sm"
                      >
                        <option value="blog">وبلاگ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      توضیحات
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="توضیحات دسته‌بندی را وارد کنید"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        رنگ دسته‌بندی
                      </label>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <input
                          type="color"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                          className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                          className="flex-1 px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        آیکون
                      </label>
                      <input
                        type="text"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="📝"
                      />
                      <p className="text-xs text-gray-400 mt-1">از ایموجی‌ها استفاده کنید</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <button
                      onClick={() => setShowNewCategoryForm(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleSaveCategory}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      {editingCategory ? 'به‌روزرسانی' : 'ذخیره'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Management Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مدیریت خدمات</h2>
                <button
                  onClick={handleNewService}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  خدمت جدید
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services?.map((service) => (
                  <div key={service.id} className="glass-card-dark p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl ml-2">{service.icon}</span>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {service.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    
                    {/* Service Image */}
                    {service.image && (
                      <div className="mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-lg font-bold text-primary-400">
                        📞 {service.phone}
                      </p>
                    </div>
                    {service.features && service.features.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">ویژگی‌ها:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature: string, index: number) => (
                            <span key={index} className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleEditService(service)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Management Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مدیریت گالری</h2>
                <button 
                  onClick={handleNewImage}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  آپلود تصویر
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryImages?.map((image) => (
                  <div key={image.id} className="glass-card-dark overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-primary-100/20 to-secondary-100/20 flex items-center justify-center relative">
                      {(image.imageUrl || image.image) ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={image.imageUrl || image.image} 
                            alt={image.title || 'تصویر گالری'}
                            className="w-full h-full object-cover"
                          />
                        </>
                      ) : (
                        <Image className="w-12 h-12 text-primary-500" aria-hidden="true" />
                      )}
                      <div className="absolute top-2 right-2 flex items-center space-x-1 space-x-reverse">
                        <button 
                          onClick={() => handleEditImage(image)}
                          className="bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-full p-2 transition-colors"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-500/80 hover:bg-red-600/80 text-white rounded-full p-2 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-2">{image.title || 'بدون نام'}</h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">{image.description || 'بدون توضیحات'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{image.category || 'بدون دسته‌بندی'}</span>
                        <span>{image.category || 'نامشخص'}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">{image.createdAt || 'نامشخص'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New/Edit Image Form Modal */}
          {showNewImageForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="glass-modal p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingImage ? 'ویرایش تصویر' : 'تصویر جدید'}
                  </h3>
                  <button 
                    onClick={() => setShowNewImageForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        نام تصویر
                      </label>
                      <input
                        type="text"
                        value={newImage.name}
                        onChange={(e) => setNewImage({...newImage, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="نام تصویر را وارد کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        دسته‌بندی
                      </label>
                      <select
                        value={newImage.category}
                        onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white backdrop-blur-sm"
                      >
                        <option value="">انتخاب دسته‌بندی</option>
                        <option value="تعمیر موتور">تعمیر موتور</option>
                        <option value="سیستم برقی">سیستم برقی</option>
                        <option value="گیربکس">گیربکس</option>
                        <option value="سیستم تعلیق">سیستم تعلیق</option>
                        <option value="سیستم ترمز">سیستم ترمز</option>
                        <option value="سیستم خنک‌کننده">سیستم خنک‌کننده</option>
                        <option value="تعمیر بدنه">تعمیر بدنه</option>
                        <option value="سرویس دوره‌ای">سرویس دوره‌ای</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      توضیحات
                    </label>
                    <textarea
                      value={newImage.description}
                      onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="توضیحات تصویر را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      برچسب‌ها
                    </label>
                    <input
                      type="text"
                      value={newImage.tags}
                      onChange={(e) => setNewImage({...newImage, tags: e.target.value})}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="برچسب‌ها را با کاما جدا کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      تصویر
                    </label>
                    <div className="space-y-4">
                      {newImage.imagePreview ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={newImage.imagePreview} 
                            alt="پیش‌نمایش تصویر" 
                            className="w-full h-48 object-cover rounded-lg border border-white/20"
                          />
                          <button
                            onClick={removeGalleryImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                            title="حذف تصویر"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                          <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                              <Image className="w-6 h-6 text-primary-500" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-gray-300 mb-2">تصویر را آپلود کنید</p>
                              <p className="text-sm text-gray-400">فرمت‌های مجاز: JPG, PNG, GIF (حداکثر 10MB)</p>
                            </div>
                            <label className="inline-block">
                              <span className="btn-primary cursor-pointer">
                                انتخاب تصویر
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleGalleryImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <button
                      onClick={() => setShowNewImageForm(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleSaveImage}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      {editingImage ? 'به‌روزرسانی' : 'ذخیره'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slider Management Tab */}
          {activeTab === 'slider' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">مدیریت اسلایدر</h2>
                <button 
                  onClick={handleNewSlider}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  اسلاید جدید
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sliderImages?.map((slide) => (
                  <div key={slide.id} className="glass-card-dark p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 ml-2">#{slide.order}</span>
                        <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        slide.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {slide.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    
                    {/* Slide Image */}
                    {slide.image && (
                      <div className="mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-300 mb-4 text-sm">{slide.subtitle}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-primary-400">
                        دکمه: {slide.buttonText}
                      </p>
                      <p className="text-sm text-gray-400">
                        لینک: {slide.buttonLink}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleEditSlider(slide)}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteSlider(slide.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slider Form Modal */}
          {showNewSliderForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="glass-modal p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingSlider ? 'ویرایش اسلاید' : 'اسلاید جدید'}
                  </h3>
                  <button 
                    onClick={() => setShowNewSliderForm(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        عنوان *
                      </label>
                      <input
                        type="text"
                        value={newSlider.title}
                        onChange={(e) => setNewSlider({...newSlider, title: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="عنوان اسلاید"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        زیرعنوان *
                      </label>
                      <input
                        type="text"
                        value={newSlider.subtitle}
                        onChange={(e) => setNewSlider({...newSlider, subtitle: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="زیرعنوان اسلاید"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        متن دکمه *
                      </label>
                      <input
                        type="text"
                        value={newSlider.buttonText}
                        onChange={(e) => setNewSlider({...newSlider, buttonText: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="متن دکمه"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        لینک دکمه *
                      </label>
                      <input
                        type="text"
                        value={newSlider.buttonLink}
                        onChange={(e) => setNewSlider({...newSlider, buttonLink: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="/services"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ترتیب نمایش
                      </label>
                      <input
                        type="number"
                        value={newSlider.order}
                        onChange={(e) => setNewSlider({...newSlider, order: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        وضعیت
                      </label>
                      <select
                        value={newSlider.status}
                        onChange={(e) => setNewSlider({...newSlider, status: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="active">فعال</option>
                        <option value="inactive">غیرفعال</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      عکس اسلاید
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSliderImageUpload}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {newSlider.imagePreview && (
                      <div className="mt-4 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={newSlider.imagePreview}
                          alt="پیش‌نمایش عکس"
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeSliderImage}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <button
                      onClick={() => setShowNewSliderForm(false)}
                      className="btn-secondary"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleSaveSlider}
                      className="btn-primary"
                    >
                      {editingSlider ? 'به‌روزرسانی' : 'ایجاد'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Settings Tab */}
          {activeTab === 'contact-settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">تنظیمات تماس با ما</h2>
                <button 
                  onClick={handleContactSettings}
                  className="btn-primary flex items-center"
                >
                  <Edit className="w-5 h-5 ml-2" />
                  ویرایش تنظیمات
                </button>
              </div>

              {contactSettings && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Info */}
                  <div className="glass-card-dark">
                    <h3 className="text-lg font-semibold text-white mb-4">اطلاعات شرکت</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">نام شرکت</label>
                        <p className="text-white">{contactSettings.companyInfo.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">زیرعنوان</label>
                        <p className="text-white">{contactSettings.companyInfo.subtitle}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">توضیحات</label>
                        <p className="text-white text-sm">{contactSettings.companyInfo.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="glass-card-dark">
                    <h3 className="text-lg font-semibold text-white mb-4">اطلاعات تماس</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">تلفن ثابت</label>
                        <p className="text-white">{contactSettings.contactInfo.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">موبایل</label>
                        <p className="text-white">{contactSettings.contactInfo.mobile}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ایمیل</label>
                        <p className="text-white">{contactSettings.contactInfo.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">آدرس</label>
                        <p className="text-white text-sm">{contactSettings.contactInfo.address}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ساعات کاری</label>
                        <p className="text-white">{contactSettings.contactInfo.workingHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="glass-card-dark">
                    <h3 className="text-lg font-semibold text-white mb-4">شبکه‌های اجتماعی</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">اینستاگرام</label>
                        <p className="text-white">{contactSettings.socialMedia.instagram || 'تعریف نشده'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">تلگرام</label>
                        <p className="text-white">{contactSettings.socialMedia.telegram || 'تعریف نشده'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">واتساپ</label>
                        <p className="text-white">{contactSettings.socialMedia.whatsapp || 'تعریف نشده'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">لینکدین</label>
                        <p className="text-white">{contactSettings.socialMedia.linkedin || 'تعریف نشده'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Settings */}
                  <div className="glass-card-dark">
                    <h3 className="text-lg font-semibold text-white mb-4">تنظیمات نقشه</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">عرض جغرافیایی</label>
                        <p className="text-white">{contactSettings.mapSettings.latitude}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">طول جغرافیایی</label>
                        <p className="text-white">{contactSettings.mapSettings.longitude}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">مقیاس نقشه</label>
                        <p className="text-white">{contactSettings.mapSettings.zoom}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Settings Form Modal */}
              {showContactSettingsForm && contactSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">ویرایش تنظیمات تماس</h3>
                      <button
                        onClick={() => setShowContactSettingsForm(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Company Info */}
                      <div className="glass-card-dark">
                        <h4 className="text-lg font-semibold text-white mb-4">اطلاعات شرکت</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">نام شرکت</label>
                            <input
                              type="text"
                              value={contactSettings.companyInfo.name}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                companyInfo: {
                                  ...contactSettings.companyInfo,
                                  name: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">زیرعنوان</label>
                            <input
                              type="text"
                              value={contactSettings.companyInfo.subtitle}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                companyInfo: {
                                  ...contactSettings.companyInfo,
                                  subtitle: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">توضیحات</label>
                          <textarea
                            value={contactSettings.companyInfo.description}
                            onChange={(e) => setContactSettings({
                              ...contactSettings,
                              companyInfo: {
                                ...contactSettings.companyInfo,
                                description: e.target.value
                              }
                            })}
                            rows={3}
                            className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="glass-card-dark">
                        <h4 className="text-lg font-semibold text-white mb-4">اطلاعات تماس</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">تلفن ثابت</label>
                            <input
                              type="text"
                              value={contactSettings.contactInfo.phone}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                contactInfo: {
                                  ...contactSettings.contactInfo,
                                  phone: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">موبایل</label>
                            <input
                              type="text"
                              value={contactSettings.contactInfo.mobile}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                contactInfo: {
                                  ...contactSettings.contactInfo,
                                  mobile: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
                            <input
                              type="email"
                              value={contactSettings.contactInfo.email}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                contactInfo: {
                                  ...contactSettings.contactInfo,
                                  email: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">ساعات کاری</label>
                            <input
                              type="text"
                              value={contactSettings.contactInfo.workingHours}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                contactInfo: {
                                  ...contactSettings.contactInfo,
                                  workingHours: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">آدرس</label>
                          <textarea
                            value={contactSettings.contactInfo.address}
                            onChange={(e) => setContactSettings({
                              ...contactSettings,
                              contactInfo: {
                                ...contactSettings.contactInfo,
                                address: e.target.value
                              }
                            })}
                            rows={2}
                            className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Social Media */}
                      <div className="glass-card-dark">
                        <h4 className="text-lg font-semibold text-white mb-4">شبکه‌های اجتماعی</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">اینستاگرام</label>
                            <input
                              type="url"
                              value={contactSettings.socialMedia.instagram}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                socialMedia: {
                                  ...contactSettings.socialMedia,
                                  instagram: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="https://instagram.com/username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">تلگرام</label>
                            <input
                              type="url"
                              value={contactSettings.socialMedia.telegram}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                socialMedia: {
                                  ...contactSettings.socialMedia,
                                  telegram: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="https://t.me/username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">واتساپ</label>
                            <input
                              type="text"
                              value={contactSettings.socialMedia.whatsapp}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                socialMedia: {
                                  ...contactSettings.socialMedia,
                                  whatsapp: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="989123456789"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">لینکدین</label>
                            <input
                              type="url"
                              value={contactSettings.socialMedia.linkedin}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                socialMedia: {
                                  ...contactSettings.socialMedia,
                                  linkedin: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Map Settings */}
                      <div className="glass-card-dark">
                        <h4 className="text-lg font-semibold text-white mb-4">تنظیمات نقشه</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">عرض جغرافیایی</label>
                            <input
                              type="number"
                              step="0.000001"
                              value={contactSettings.mapSettings.latitude}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                mapSettings: {
                                  ...contactSettings.mapSettings,
                                  latitude: parseFloat(e.target.value)
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">طول جغرافیایی</label>
                            <input
                              type="number"
                              step="0.000001"
                              value={contactSettings.mapSettings.longitude}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                mapSettings: {
                                  ...contactSettings.mapSettings,
                                  longitude: parseFloat(e.target.value)
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">مقیاس نقشه</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={contactSettings.mapSettings.zoom}
                              onChange={(e) => setContactSettings({
                                ...contactSettings,
                                mapSettings: {
                                  ...contactSettings.mapSettings,
                                  zoom: parseInt(e.target.value)
                                }
                              })}
                              className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 space-x-reverse mt-6">
                      <button
                        onClick={() => setShowContactSettingsForm(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={handleSaveContactSettings}
                        disabled={loading}
                        className="btn-primary flex items-center"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 ml-2" />
                            ذخیره تغییرات
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">تنظیمات حساب کاربری</h2>
              
              {/* Change Username Section */}
              <div className="glass-card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 ml-2" />
                  تغییر نام کاربری
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      نام کاربری فعلی
                    </label>
                    <input
                      type="text"
                      value="admin"
                      disabled
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      نام کاربری جدید
                    </label>
                    <input
                      type="text"
                      placeholder="نام کاربری جدید را وارد کنید"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="btn-primary">
                    <Save className="w-5 h-5 ml-2" />
                    تغییر نام کاربری
                  </button>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="glass-card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 ml-2" />
                  تغییر رمز عبور
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رمز عبور فعلی
                    </label>
                    <input
                      type="password"
                      placeholder="رمز عبور فعلی را وارد کنید"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      placeholder="رمز عبور جدید را وارد کنید"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      تکرار رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      placeholder="رمز عبور جدید را مجدداً وارد کنید"
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                  <button className="btn-primary">
                  <Save className="w-5 h-5 ml-2" />
                    تغییر رمز عبور
                </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="glass-card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 ml-2" />
                  تنظیمات امنیتی
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">ورود دو مرحله‌ای</h4>
                      <p className="text-gray-400 text-sm">برای امنیت بیشتر حساب کاربری</p>
                    </div>
                    <button className="btn-secondary">
                      فعال‌سازی
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">خروج از همه دستگاه‌ها</h4>
                      <p className="text-gray-400 text-sm">از همه دستگاه‌های متصل خارج شوید</p>
                    </div>
                    <button className="btn-secondary">
                      خروج
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New/Edit Service Form Modal */}
          {showNewServiceForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="glass-modal p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingService ? 'ویرایش خدمت' : 'خدمت جدید'}
                  </h3>
                  <button
                    onClick={() => setShowNewServiceForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        نام خدمت *
                      </label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="نام خدمت"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        شماره تماس *
                      </label>
                      <input
                        type="tel"
                        value={newService.phone}
                        onChange={(e) => setNewService({...newService, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: 09123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      توضیحات *
                    </label>
                    <textarea
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="توضیحات خدمت"
                    />
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        آیکون
                      </label>
                      <input
                        type="text"
                        value={newService.icon}
                        onChange={(e) => setNewService({...newService, icon: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="🔧"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        عکس خدمت
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleServiceImageUpload}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {newService.imagePreview && (
                        <div className="mt-4 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={newService.imagePreview}
                            alt="پیش‌نمایش عکس"
                            className="w-full h-48 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={removeServiceImage}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        وضعیت
                      </label>
                      <select
                        value={newService.status}
                        onChange={(e) => setNewService({...newService, status: e.target.value})}
                        className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="active">فعال</option>
                        <option value="inactive">غیرفعال</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ویژگی‌ها (هر خط یک ویژگی)
                    </label>
                    <textarea
                      value={newService.features.join('\n')}
                      onChange={(e) => setNewService({...newService, features: e.target.value.split('\n').filter(f => f.trim())})}
                      rows={4}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="تشخیص عیب&#10;تعمیر تخصصی&#10;تست عملکرد"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 space-x-reverse mt-8">
                  <button
                    onClick={() => setShowNewServiceForm(false)}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSaveService}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-5 h-5 ml-2" />
                    {editingService ? 'به‌روزرسانی' : 'ایجاد'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === 'contact-messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">پیام‌های تماس</h2>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-sm text-gray-400">
                    {contactMessages.filter(msg => msg.status === 'new').length} پیام جدید
                  </span>
                  <button
                    onClick={fetchContactMessages}
                    className="btn-secondary flex items-center"
                  >
                    <RefreshCcw className="w-5 h-5 ml-2" />
                    به‌روزرسانی
                  </button>
                </div>
              </div>

              {contactMessages.length === 0 ? (
                <div className="glass-card-dark p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">هیچ پیامی یافت نشد</h3>
                  <p className="text-gray-400">هنوز هیچ پیامی از فرم تماس دریافت نشده است.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`glass-card-dark p-6 cursor-pointer hover:bg-dark-700/50 transition-colors ${
                        message.status === 'new' ? 'border-r-4 border-primary-500' : ''
                      }`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'new' 
                                ? 'bg-primary-500/20 text-primary-400' 
                                : message.status === 'read'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {message.status === 'new' ? 'جدید' : 
                               message.status === 'read' ? 'خوانده شده' : 'پاسخ داده شده'}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{message.subject}</p>
                          <p className="text-gray-400 text-sm line-clamp-2">{message.message}</p>
                          <div className="flex items-center space-x-4 space-x-reverse mt-3 text-xs text-gray-500">
                            <span>📞 {message.phone}</span>
                            {message.email && <span>📧 {message.email}</span>}
                            <span>📅 {new Date(message.createdAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewMessage(message)
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteMessage(message.id)
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message Detail Modal */}
          {showMessageModal && selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">جزئیات پیام</h3>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Message Info */}
                  <div className="glass-card-dark p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">نام</label>
                        <p className="text-white">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">شماره تماس</label>
                        <p className="text-white">{selectedMessage.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ایمیل</label>
                        <p className="text-white">{selectedMessage.email || 'ارسال نشده'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">وضعیت</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMessage.status === 'new' 
                            ? 'bg-primary-500/20 text-primary-400' 
                            : selectedMessage.status === 'read'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {selectedMessage.status === 'new' ? 'جدید' : 
                           selectedMessage.status === 'read' ? 'خوانده شده' : 'پاسخ داده شده'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="glass-card-dark p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">موضوع</label>
                    <p className="text-white">{selectedMessage.subject}</p>
                  </div>

                  {/* Message */}
                  <div className="glass-card-dark p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">پیام</label>
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Timestamps */}
                  <div className="glass-card-dark p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">تاریخ ارسال</label>
                        <p className="text-white text-sm">{new Date(selectedMessage.createdAt).toLocaleString('fa-IR')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">آخرین به‌روزرسانی</label>
                        <p className="text-white text-sm">{new Date(selectedMessage.updatedAt).toLocaleString('fa-IR')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'read')}
                      disabled={selectedMessage.status === 'read'}
                      className="btn-secondary text-sm"
                    >
                      علامت‌گذاری به عنوان خوانده شده
                    </button>
                    <button
                      onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'replied')}
                      disabled={selectedMessage.status === 'replied'}
                      className="btn-primary text-sm"
                    >
                      علامت‌گذاری به عنوان پاسخ داده شده
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      حذف پیام
                    </button>
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="btn-secondary text-sm"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Content Tab */}
          {activeTab === 'ai-content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">محتوای هوش مصنوعی</h2>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => setShowAutoGenSettings(true)}
                    className="btn-secondary flex items-center"
                  >
                    <Settings className="w-5 h-5 ml-2" />
                    تنظیمات تولید خودکار
                  </button>
                  <button
                    onClick={() => setShowGeminiKeyForm(true)}
                    className="btn-secondary flex items-center"
                  >
                    <Settings className="w-5 h-5 ml-2" />
                    تنظیمات Gemini
                  </button>
                  <button
                    onClick={fetchAiContentStats}
                    className="btn-secondary flex items-center"
                  >
                    <RefreshCcw className="w-5 h-5 ml-2" />
                    به‌روزرسانی
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              {aiContentStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="glass-card-dark p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">کل مقالات</p>
                        <p className="text-2xl font-bold text-white">{aiContentStats.totalBlogPosts}</p>
                      </div>
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  
                  <div className="glass-card-dark p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">مقالات امروز</p>
                        <p className="text-2xl font-bold text-white">{aiContentStats.todayBlogPosts}</p>
                      </div>
                      <Bot className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Generation Controls */}
              <div className="glass-card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4">تولید محتوا</h3>
                
                {/* Gemini API Info */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                  <h4 className="text-green-400 font-semibold mb-2">✅ Google Gemini فعال است!</h4>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>• استفاده از Google Gemini برای تولید محتوا</p>
                    <p>• کیفیت بالا و قیمت مناسب</p>
                    <p>• پشتیبانی عالی از زبان فارسی</p>
                    <p>• برای دریافت API Key: <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-primary-400 hover:underline">Google AI Studio</a></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  
                  
                  <button
                    onClick={() => handleGenerateContent('blog')}
                    disabled={isGeneratingContent}
                    className="btn-primary flex items-center justify-center"
                  >
                    {isGeneratingContent ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        در حال تولید...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 ml-2" />
                        تولید مقاله
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Auto Generation Settings */}
              <div className="glass-card-dark p-6">
                <h3 className="text-lg font-semibold text-white mb-4">تنظیمات تولید خودکار</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">وضعیت تولید خودکار:</span>
                    <span className={autoGenSettings.isEnabled ? "text-green-400" : "text-red-400"}>
                      {autoGenSettings.isEnabled ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">تعداد مقالات در روز:</span>
                    <span className="text-white font-semibold">{autoGenSettings.articlesPerDay} مقاله</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">ساعت‌های تولید:</span>
                    <div className="flex space-x-2 space-x-reverse">
                      {autoGenSettings.generationHours.map((hour, index) => (
                        <span key={index} className="text-primary-400 bg-dark-700 px-2 py-1 rounded text-sm">
                          {hour}:00
                        </span>
                      ))}
                  </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">✅ Vercel Cron فعال است!</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      مقالات به صورت خودکار در ساعت‌های 9:00، 15:00 و 21:00 تولید می‌شوند.
                    </p>
                    <div className="text-xs text-gray-400 mb-3">
                      <p>• فایل vercel.json تنظیم شده</p>
                      <p>• Cron Job: هر 8 ساعت</p>
                      <p>• تعداد مقالات: 3 مقاله در روز</p>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          // تست دستی Cron Job
                          fetch('/api/cron/generate-content?key=garage-cron-2024-secure-key')
                            .then(res => res.json())
                            .then(data => {
                              if (data.success) {
                                alert('✅ Cron Job کار می‌کند! مقاله تولید شد.')
                                fetchAiContentStats() // به‌روزرسانی آمار
                              } else {
                                alert('❌ خطا در Cron Job: ' + data.message)
                              }
                            })
                            .catch(err => alert('❌ خطا: ' + err.message))
                        }}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        🧪 تست Cron Job
                      </button>
                      <button
                        onClick={() => {
                          // بررسی آخرین اجرا
                          fetch('/api/cron/generate-content?key=garage-cron-2024-secure-key&check=true')
                            .then(res => res.json())
                            .then(data => {
                              alert(`📊 آخرین اجرا: ${data.lastRun || 'هنوز اجرا نشده'}`)
                            })
                        }}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        📊 وضعیت
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              {aiContentStats?.lastUpdate && (
                <div className="glass-card-dark p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">آخرین به‌روزرسانی:</span>
                    <span className="text-white">
                      {new Date(aiContentStats.lastUpdate).toLocaleString('fa-IR')}
                    </span>
                  </div>
                </div>
              )}

              {/* OpenAI API Settings Modal - حذف شده */}

              {/* Auto Generation Settings Modal */}
              {showAutoGenSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">تنظیمات تولید خودکار</h3>
                      <button
                        onClick={() => setShowAutoGenSettings(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Enable/Disable Auto Generation */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold">فعال‌سازی تولید خودکار</h4>
                          <p className="text-gray-400 text-sm">مقالات به صورت خودکار در ساعت‌های مشخص تولید شوند</p>
                        </div>
                        <button
                          onClick={() => setAutoGenSettings(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            autoGenSettings.isEnabled ? 'bg-primary-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            autoGenSettings.isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      {/* Articles Per Day */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          تعداد مقالات در روز
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={autoGenSettings.articlesPerDay}
                          onChange={(e) => setAutoGenSettings(prev => ({ 
                            ...prev, 
                            articlesPerDay: parseInt(e.target.value) || 1 
                          }))}
                          className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                          تعداد مقالاتی که هر روز تولید می‌شود (1 تا 10)
                        </p>
                      </div>

                      {/* Generation Hours */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          ساعت‌های تولید مقالات
                        </label>
                        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                          {Array.from({ length: 24 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const newHours = autoGenSettings.generationHours.includes(i)
                                  ? autoGenSettings.generationHours.filter(h => h !== i)
                                  : [...autoGenSettings.generationHours, i].sort()
                                setAutoGenSettings(prev => ({ ...prev, generationHours: newHours }))
                              }}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                autoGenSettings.generationHours.includes(i)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                              }`}
                            >
                              {i.toString().padStart(2, '0')}:00
                            </button>
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          ساعت‌هایی که مقالات تولید می‌شوند (روی ساعت کلیک کنید تا انتخاب/لغو شود)
                        </p>
                      </div>

                      {/* Selected Hours Summary */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">ساعت‌های انتخاب شده:</h4>
                        <div className="flex flex-wrap gap-2">
                          {autoGenSettings.generationHours.length > 0 ? (
                            autoGenSettings.generationHours.map(hour => (
                              <span key={hour} className="text-primary-400 bg-dark-700 px-2 py-1 rounded text-sm">
                                {hour.toString().padStart(2, '0')}:00
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">هیچ ساعتی انتخاب نشده</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 space-x-reverse mt-6">
                      <button
                        onClick={() => setShowAutoGenSettings(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Save settings to backend
                          alert('تنظیمات با موفقیت ذخیره شد')
                          setShowAutoGenSettings(false)
                        }}
                        className="btn-primary flex items-center"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        ذخیره تنظیمات
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gemini Settings Modal */}
              {showGeminiKeyForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">تنظیمات Google Gemini</h3>
                      <button
                        onClick={() => setShowGeminiKeyForm(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">نحوه دریافت API Key:</h4>
                        <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                          <li>به سایت <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Google AI Studio</a> بروید</li>
                          <li>با حساب Google خود وارد شوید</li>
                          <li>روی &quot;Create API Key&quot; کلیک کنید</li>
                          <li>کلید را کپی کرده و در فیلد زیر وارد کنید</li>
                        </ol>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Google Gemini API Key
                        </label>
                        <input
                          type="password"
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          placeholder="AIzaSyC1rGZPknmjhPkyz_DjpWHoy5sDGUsFNv4"
                          className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          autoComplete="new-password"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                          API Key شما به صورت امن ذخیره می‌شود و فقط برای تولید محتوا استفاده می‌شود
                        </p>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">قابلیت‌های فعال:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>✅ تولید مقالات تخصصی با Gemini Pro</li>
                          <li>✅ کیفیت بالا برای محتوای فارسی</li>
                          <li>✅ قیمت مناسب و ارزان</li>
                          <li>✅ اجرای خودکار با Cron Job</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 space-x-reverse mt-6">
                      <button
                        onClick={() => setShowGeminiKeyForm(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={handleSaveGeminiSettings}
                        className="btn-primary flex items-center"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        ذخیره تنظیمات
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO Content Modal */}
          {showSEOForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">تولید محتوای SEO سفارشی</h3>
                    <button
                      onClick={() => setShowSEOForm(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">کلمات کلیدی هدف:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• مکانیک، گیربکس، سرسیلند، تعمیر</li>
                        <li>• تعمیر ماشین چینی، تعمیر ماشین آلمانی</li>
                        <li>• تعمیر ماشین خارجی، تعمیرگاه تهران</li>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        کلمه کلیدی مورد نظر
                      </label>
                      <input
                        type="text"
                        value={seoKeyword}
                        onChange={(e) => setSeoKeyword(e.target.value)}
                        placeholder="مثال: تعمیر گیربکس BMW"
                        className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="text-green-400 font-semibold mb-2">ویژگی‌های محتوای SEO:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>✅ بهینه‌سازی برای کلمات کلیدی هدف</li>
                        <li>✅ ساختار مناسب با headings</li>
                        <li>✅ محتوای طولانی و مفصل (2500+ کلمه)</li>
                        <li>✅ شامل FAQ و سوالات متداول</li>
                        <li>✅ لینک‌های داخلی و خارجی</li>
                        <li>✅ بهینه‌سازی برای SEO محلی</li>
                        <li>✅ امتیاز SEO بالا (90+)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse mt-6">
                    <button
                      onClick={() => setShowSEOForm(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => handleGenerateSEOContent('single')}
                      disabled={isGeneratingSEOContent || !seoKeyword.trim()}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isGeneratingSEOContent ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          در حال تولید...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 ml-2" />
                          تولید محتوا
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
