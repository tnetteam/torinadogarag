'use client'

import { useState, useEffect } from 'react'
// Service interface
interface Service {
  id: number
  name: string
  title?: string
  description: string
  price?: string
  status: string
  icon: string
  features: string[]
  createdAt: string
  updatedAt: string
  phone?: string
  phoneNumber?: string
  image?: string
  imageUrl?: string
  duration?: string
  warranty?: string
  category?: string
}
import { Phone, Clock, Shield, Wrench, Settings, Zap, Car, Cog, Thermometer, Battery } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'

// Icon mapping for services
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  '🔧': Wrench,
  '⚙️': Settings,
  '⚡': Zap,
  '🛡️': Shield,
  '🚗': Car,
  '🔩': Cog,
  '🔨': Wrench,
  '🔋': Battery,
  '🌡️': Thermometer
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        })
        if (!response.ok) {
          throw new Error('خطا در دریافت خدمات')
        }
        const data = await response.json()
        setServices(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای نامشخص')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleCall = (phoneNumber: string) => {
    console.log('Call button clicked with phone:', phoneNumber)
    if (phoneNumber) {
      // Remove any non-digit characters except +
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')
      console.log('Cleaned phone:', cleanPhone)
      window.location.href = `tel:${cleanPhone}`
    } else {
      console.log('No phone number provided')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری خدمات...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            خدمات ما
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto animate-slide-up">
            با تیم متخصص ما، تمام نیازهای خودروی شما را پوشش می‌دهیم. از تعمیرات ساده تا خدمات تخصصی
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded inline-block">
                <p>هیچ خدمتی در حال حاضر موجود نیست</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Wrench
                
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                      {/* Service Image */}
                      {(service.imageUrl || service.image) && (
                        <div className="relative h-48 rounded-t-2xl overflow-hidden">
                          <OptimizedImage
                            src={service.imageUrl || service.image || ''}
                            alt={service.title || service.name}
                            className="w-full h-full object-cover"
                            width={400}
                            height={300}
                            priority={index < 3}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}

                    <div className="p-6">
                      {/* Service Icon */}
                      <div className="flex items-center mb-4">
                        <div className="bg-primary-100 p-3 rounded-xl mr-4">
                          <IconComponent className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {service.title || service.name}
                        </h3>
                      </div>

                      {/* Service Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="space-y-3 mb-6">
                        {service.duration && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>مدت زمان: {service.duration}</span>
                          </div>
                        )}
                        {service.warranty && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Shield className="w-4 h-4 mr-2" />
                            <span>گارانتی: {service.warranty}</span>
                          </div>
                        )}
                        {service.category && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Wrench className="w-4 h-4 mr-2" />
                            <span>دسته‌بندی: {service.category}</span>
                          </div>
                        )}
                      </div>

                      {/* Call Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const phone = service.phoneNumber || service.phone
                          if (phone) {
                            handleCall(phone)
                          } else {
                            // Fallback to default number
                            handleCall('09123456789')
                          }
                        }}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center group"
                        type="button"
                      >
                        <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        تماس بگیرید
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            نیاز به مشاوره بیمه دارید؟
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            تیم متخصص ما آماده پاسخگویی به سوالات شما و ارائه بهترین راهکارها است
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:09126977639"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              تماس مستقیم
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              فرم تماس
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}