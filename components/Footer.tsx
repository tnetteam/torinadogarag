'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

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

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact-settings', {
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

  const quickLinks = [
    { name: 'خانه', href: '/' },
    { name: 'درباره ما', href: '/about' },
    { name: 'خدمات', href: '/services' },
    { name: 'گالری', href: '/gallery' },
    { name: 'وبلاگ', href: '/blog' },
    { name: 'تماس با ما', href: '/contact' },
  ]

  const services = [
    { name: 'تعمیر موتور', href: '/services/engine' },
    { name: 'تعمیر گیربکس', href: '/services/transmission' },
    { name: 'سیستم برقی', href: '/services/electrical' },
    { name: 'سیستم ترمز', href: '/services/brake' },
    { name: 'نگهداری خودرو', href: '/services/maintenance' },
    { name: 'تعمیر کولر', href: '/services/ac' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ]

  return (
    <footer className="glass-nav border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="text-2xl font-bold text-white mb-2">
                <span className="text-gradient">
                  {contactSettings?.companyInfo.name || 'تورنادو'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {contactSettings?.companyInfo.subtitle || 'گاراژ تخصصی مکانیکی'}
              </p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {contactSettings?.companyInfo.description || 'با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی، خدمات مکانیکی با کیفیت و قابل اعتماد ارائه می‌دهیم.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 ml-3 text-primary-500" />
                <span>{contactSettings?.contactInfo.phone || '021-12345678'}</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 ml-3 text-primary-500" />
                <span>{contactSettings?.contactInfo.email || 'info@garage-website.ir'}</span>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="w-4 h-4 ml-3 text-primary-500 mt-0.5" />
                <span>{contactSettings?.contactInfo.address || 'تهران، خیابان ولیعصر، پلاک 123'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">لینک‌های سریع</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">خدمات ما</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-primary-500 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">عضویت در خبرنامه</h3>
            <p className="text-gray-300 text-sm mb-4">
              آخرین اخبار و اطلاعات خودرو را در ایمیل خود دریافت کنید
            </p>
            
            <div className="space-y-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-r-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-l-lg transition-colors">
                  عضویت
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-4">شبکه‌های اجتماعی</h4>
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-dark-800 hover:bg-primary-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} تورنادو - گاراژ تخصصی مکانیکی. تمامی حقوق محفوظ است - طراحی شده توسط{' '}
              <a 
                href="https://mytnet.ir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 transition-colors font-medium"
              >
                تی نت
              </a>
            </div>
            <div className="flex items-center space-x-6 space-x-reverse text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-500 transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-500 transition-colors">
                شرایط استفاده
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-primary-500 transition-colors">
                نقشه سایت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}