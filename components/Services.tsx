'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wrench, Settings, Zap, Shield, Car, Cog, Thermometer, Battery } from 'lucide-react'
import Section from './Section'
import AnimatedCard from './AnimatedCard'
import LoadingSpinner from './LoadingSpinner'
import { CardImage } from './OptimizedImage'

interface Service {
  id: number
  name: string
  description: string
  phone: string
  status: string
  icon: string
  features: string[]
  image?: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Filter only active services
          const activeServices = result.data.filter((service: Service) => service.status === 'active')
          setServices(activeServices)
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [fetchServices])

  // Icon mapping
  const getIcon = (iconName: string) => {
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
    return iconMap[iconName] || Wrench
  }

  return (
    <Section 
      title="خدمات ما"
      subtitle="با بیش از 15 سال تجربه، خدمات مکانیکی با کیفیت و قابل اعتماد برای تمامی خودروها ارائه می‌دهیم"
      background="pattern"
    >

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="در حال بارگذاری خدمات..." />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = getIcon(service.icon)
              return (
                <AnimatedCard
                  key={service.id}
                  variant="glass"
                  delay={index * 100}
                  className="p-8 group"
                >
                  {/* Service Image */}
                  {service.image && (
                    <div className="mb-6 service-image w-full h-48 border border-gray-600 group-hover:border-primary-500/50 transition-colors">
                      <CardImage
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        fill
                      />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary-500/30 group-hover:to-primary-600/40 transition-all duration-300 shadow-glow group-hover:shadow-glow-lg">
                    <IconComponent className="w-10 h-10 text-primary-400 group-hover:text-primary-300 transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {service.description}
                    </p>


                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-400 text-sm">
                            <div className="w-2 h-2 bg-primary-500 rounded-full ml-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Contact Button */}
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-center">
                        <a 
                          href={`tel:${service.phone}`}
                          className="btn-primary text-sm px-8 py-3 flex items-center gap-2 shadow-glow hover:shadow-glow-lg"
                        >
                          <span className="text-lg">📞</span>
                          تماس بگیرید
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card-dark p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">هیچ خدمتی یافت نشد</h3>
              <p className="text-gray-400">لطفاً بعداً دوباره تلاش کنید</p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card-dark p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              نیاز به مشاوره بیمه دارید؟
            </h3>
            <p className="text-gray-300 mb-6">
              کارشناسان ما آماده پاسخگویی به سوالات شما و ارائه مشاوره رایگان هستند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:09126977639"
                className="btn-primary text-lg px-8 py-4 text-center"
              >
                تماس با ما
              </a>
              <button className="btn-secondary text-lg px-8 py-4">
                دریافت مشاوره رایگان
              </button>
            </div>
          </div>
        </div>
    </Section>
  )
}