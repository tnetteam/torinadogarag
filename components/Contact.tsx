'use client'

import { useState, useEffect } from 'react'
import { MapPin, Send, CheckCircle } from 'lucide-react'

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContactSettings(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error)
    }
  }

  useEffect(() => {
    fetchContactSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        alert(result.message || 'خطا در ارسال پیام')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('خطا در ارسال پیام')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'آدرس',
      details: [
        contactSettings?.contactInfo.address || 'تهران، خیابان ولیعصر',
        'پلاک 123، طبقه همکف'
      ],
      color: 'text-red-500'
    }
  ]

  return (
    <section className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">تماس با ما</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            برای دریافت مشاوره رایگان و رزرو نوبت، با ما در تماس باشید
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="glass-card-dark p-8">
            <h3 className="text-2xl font-bold text-white mb-6">ارسال پیام</h3>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">پیام شما ارسال شد!</h4>
                <p className="text-gray-300">به زودی با شما تماس خواهیم گرفت.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="نام شما"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    شماره موبایل *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="09123456789"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    موضوع *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">انتخاب موضوع</option>
                    <option value="تعمیر موتور">تعمیر موتور</option>
                    <option value="تعمیر گیربکس">تعمیر گیربکس</option>
                    <option value="سیستم برقی">سیستم برقی</option>
                    <option value="سیستم ترمز">سیستم ترمز</option>
                    <option value="نگهداری خودرو">نگهداری خودرو</option>
                    <option value="تعمیر کولر">تعمیر کولر</option>
                    <option value="سایر">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    پیام *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center"
                >
                  <Send className="w-5 h-5 ml-2" />
                  ارسال پیام
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">اطلاعات تماس</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                برای دریافت مشاوره رایگان و رزرو نوبت، می‌توانید از طریق راه‌های زیر با ما در تماس باشید.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="glass-card-dark p-6 group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className={`w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center group-hover:bg-dark-700 transition-colors`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-300 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}