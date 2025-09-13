'use client'

import { useState, useEffect } from 'react'
import { Car, Wrench, Users, Award } from 'lucide-react'

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false)

  const stats = [
    {
      id: 1,
      number: 5000,
      suffix: '+',
      label: 'خودرو تعمیر شده',
      icon: Car,
      color: 'text-blue-500'
    },
    {
      id: 2,
      number: 15,
      suffix: '+',
      label: 'سال تجربه',
      icon: Wrench,
      color: 'text-primary-500'
    },
    {
      id: 3,
      number: 98,
      suffix: '%',
      label: 'رضایت مشتریان',
      icon: Users,
      color: 'text-green-500'
    },
    {
      id: 4,
      number: 50,
      suffix: '+',
      label: 'جوایز و گواهینامه',
      icon: Award,
      color: 'text-yellow-500'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let startTime: number
      const startCount = 0

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        
        setCount(Math.floor(progress * (end - startCount) + startCount))

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      requestAnimationFrame(updateCount)
    }, [end, duration])

    return <span>{count}</span>
  }

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-r from-dark-900 to-dark-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-10"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">آمار و دستاوردها</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            اعداد و آمارهایی که نشان‌دهنده کیفیت و اعتماد مشتریان به خدمات ما است
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="text-center group"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-dark-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-dark-800/70 transition-all duration-300 group-hover:scale-110">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>

              {/* Number */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter end={stat.number} />
                <span className="text-primary-500">{stat.suffix}</span>
              </div>

              {/* Label */}
              <div className="text-gray-300 text-lg font-medium">
                {stat.label}
              </div>

              {/* Decorative Line */}
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <div className="glass-card-dark p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              اعتماد مشتریان، افتخار ما
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              این آمار و ارقام نشان‌دهنده تعهد ما به ارائه خدمات با کیفیت و رضایت مشتریان است. 
              ما افتخار می‌کنیم که بخشی از سفر خودرویی شما هستیم.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-primary-500/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-6 h-6 bg-primary-400/30 rounded-full animate-pulse-orange"></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-primary-600/30 rounded-full animate-pulse"></div>
    </section>
  )
}