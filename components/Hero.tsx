'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
  order: number
  status: string
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSlides = useCallback(async () => {
    try {
      const response = await fetch('/api/slider', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSlides(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSlides()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [fetchSlides])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">هیچ اسلایدی یافت نشد</div>
      </section>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${slides[currentSlide]?.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-dark-950 via-dark-950/80 to-transparent"></div>
          <div className="absolute inset-0 hero-pattern opacity-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 text-right">
              <div className="space-y-4 md:space-y-6">
                {/* Slide Indicators - Hidden on mobile */}
                <div className="hidden md:flex items-center space-x-2 space-x-reverse">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-primary-500 scale-125' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                <div className="space-y-4 md:space-y-6 animate-fade-in">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl hero-title text-gradient-animated leading-tight">
                    {slides[currentSlide]?.title}
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl hero-subtitle text-gradient-gold">
                    {slides[currentSlide]?.subtitle}
                  </h2>
                </div>

                {/* Description - Hidden on mobile */}
                <p className="hidden md:block text-lg text-gray-300 max-w-2xl hero-description animate-slide-up">
                  {slides[currentSlide]?.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-8 md:pt-8 animate-fade-in">
                  <a 
                    href="tel:09126977639"
                    className="btn-primary text-base md:text-lg px-6 md:px-10 py-3 md:py-5 shadow-glow-lg interactive-hover hero-button text-center"
                  >
                    تماس با ما
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Glass Elements - Hidden on mobile */}
            <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">
              <div className="relative">
                {/* Main Glass Vertical Bar */}
                <div className="w-2 h-96 glass-overlay rounded-full shadow-glow-lg animate-glow"></div>
                
                {/* Floating Glass Elements with Enhanced Animations */}
                <div className="absolute -right-6 top-8 w-12 h-12 glass-card rounded-full animate-float shadow-glow"></div>
                <div className="absolute -right-2 top-24 w-6 h-6 glass-card rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -right-8 top-40 w-8 h-8 glass-card rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                
                {/* Additional Decorative Elements */}
                <div className="absolute -right-10 top-16 w-4 h-4 glass-card rounded-full animate-pulse-slow"></div>
                <div className="absolute -right-4 top-32 w-7 h-7 glass-card rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -right-9 top-48 w-5 h-5 glass-card rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                
                {/* Glowing Dots */}
                <div className="absolute -right-3 top-20 w-2 h-2 bg-primary-500/60 rounded-full animate-pulse-slow"></div>
                <div className="absolute -right-5 top-36 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce-slow"></div>
                <div className="absolute -right-7 top-52 w-2 h-2 bg-primary-400/40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-20 glass-button p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 z-20 glass-button p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent"></div>
    </section>
  )
}