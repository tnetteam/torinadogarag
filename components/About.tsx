'use client'

import { Award, Users, Clock, Shield, CheckCircle } from 'lucide-react'

export default function About() {
  const stats = [
    { number: '15+', label: 'سال تجربه', icon: Clock },
    { number: '5000+', label: 'خودرو تعمیر شده', icon: Award },
    { number: '98%', label: 'رضایت مشتریان', icon: Users },
    { number: '24/7', label: 'پشتیبانی', icon: Shield },
  ]

  const features = [
    'تعمیر تخصصی خودروهای آلمانی و چینی',
    'استفاده از تجهیزات پیشرفته و مدرن',
    'تیم متخصص و با تجربه',
    'گارانتی کامل بر روی خدمات',
    'قیمت‌های رقابتی و منصفانه',
    'پشتیبانی 24 ساعته',
  ]

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="text-gradient">درباره تورنادو</span>
              </h2>
              <div className="w-24 h-1 bg-primary-500 rounded-full mb-8"></div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در زمینه تعمیر و نگهداری خودرو، 
                یکی از معتبرترین مراکز تعمیر خودرو در تهران محسوب می‌شود.
              </p>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                ما با استفاده از جدیدترین تجهیزات و تکنولوژی‌های روز دنیا، 
                خدمات مکانیکی با کیفیت و قابل اعتماد برای تمامی خودروها ارائه می‌دهیم.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                تیم متخصص ما با دانش و تجربه بالا، آماده ارائه خدمات تخصصی برای خودروهای آلمانی، 
                چینی و سایر برندها است.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">چرا تورنادو؟</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button className="btn-primary text-lg px-8 py-4">
                بیشتر بدانید
              </button>
            </div>
          </div>

          {/* Stats & Image */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card-dark p-6 text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/30 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-video glass-card-dark rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
                     style={{
                       backgroundImage: `url('/images/garage-interior.jpg')`,
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
                  <div className="relative z-10 text-center text-white">
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-10 h-10 text-primary-500" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">گاراژ مدرن</h4>
                    <p className="text-gray-300 text-sm">تجهیزات پیشرفته و محیط تمیز</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full animate-pulse-orange"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}