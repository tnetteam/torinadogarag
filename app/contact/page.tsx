'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'
import Section from '@/components/Section'
import AnimatedCard from '@/components/AnimatedCard'
import Contact from '@/components/Contact'

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


export default function ContactPage() {
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

  return (
    <div className="bg-dark-950 min-h-screen">
      {/* Hero Section */}
      <Section 
        title="تماس با ما"
        subtitle="آماده خدمت‌رسانی به شما عزیزان هستیم"
        background="gradient"
        padding="lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedCard variant="glass" delay={0} className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-xl flex items-center justify-center ml-4">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">آدرس</h3>
                  <p className="text-gray-300 text-sm">تهران، خیابان ولیعصر</p>
                </div>
              </div>
              <p className="text-gray-300">
                {contactSettings?.contactInfo.address || 'تهران، خیابان ولیعصر، کوچه 15، پلاک 23'}<br />
                {contactSettings?.companyInfo.subtitle || 'گاراژ تخصصی مکانیکی تورنادو'}
              </p>
            </AnimatedCard>

            <AnimatedCard variant="glass" delay={100} className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-xl flex items-center justify-center ml-4">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">تلفن</h3>
                  <p className="text-gray-300 text-sm">تماس مستقیم</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <a href={`tel:${contactSettings?.contactInfo.phone || '+982155555555'}`} className="hover:text-primary-400 transition-colors">
                    {contactSettings?.contactInfo.phone || '021-55555555'}
                  </a>
                </p>
                <p className="text-gray-300">
                  <a href={`tel:${contactSettings?.contactInfo.mobile || '+989123456789'}`} className="hover:text-primary-400 transition-colors">
                    {contactSettings?.contactInfo.mobile || '0912-345-6789'}
                  </a>
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard variant="glass" delay={200} className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-xl flex items-center justify-center ml-4">
                  <span className="text-2xl">🕒</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ساعات کاری</h3>
                  <p className="text-gray-300 text-sm">روزهای هفته</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <p>{contactSettings?.contactInfo.workingHours || 'شنبه تا چهارشنبه: 8:00 - 18:00'}</p>
                <p>پنج‌شنبه: 8:00 - 14:00</p>
                <p>جمعه: تعطیل</p>
              </div>
            </AnimatedCard>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimatedCard variant="glass" delay={300} className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">ارسال پیام</h3>
              <Contact />
            </AnimatedCard>
          </div>
        </div>
      </Section>

      {/* Location Section */}
      <Section 
        title="موقعیت مکانی"
        subtitle="آدرس و دسترسی به گاراژ"
        background="pattern"
        padding="lg"
      >
        <AnimatedCard variant="glass" delay={0} className="p-8">
          <div className="max-w-2xl mx-auto">
            {/* Address Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">آدرس گاراژ</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {contactSettings?.contactInfo.address || 'تهران، رسالت، خیابان نیرو دریایی، کارواش خلیج فارس، مجموعه تورنادو'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">ساعات کاری</h3>
                  <p className="text-gray-300">
                    {contactSettings?.contactInfo.workingHours || 'شنبه تا جمعه: 8:00 - 22:00'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </AnimatedCard>
      </Section>
    </div>
  )
}
