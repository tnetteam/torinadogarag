'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import OptimizedImage, { CardImage } from './OptimizedImage'

interface GalleryImage {
  id: number
  name: string
  description: string
  image: string
  category: string
  tags: string[]
  date: string
  size: string
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGalleryImages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gallery', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setGalleryImages(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGalleryImages()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [fetchGalleryImages])

  const openModal = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <section className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">گالری تصاویر</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            نگاهی به محیط کار، تجهیزات و خدمات ما در گاراژ تخصصی مکانیکی تورنادو
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="glass-card-dark aspect-square animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">در حال بارگذاری...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl glass-card-dark aspect-square cursor-pointer"
                onClick={() => openModal(index)}
              >
                {/* Image */}
                {image.image ? (
                  <CardImage 
                    src={image.image} 
                    alt={image.name}
                    className="w-full h-full object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{image.name}</p>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{image.name}</h3>
                    <p className="text-sm text-gray-300">{image.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{image.category}</p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 glass-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="glass-button w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">هیچ تصویری یافت نشد</h3>
            <p className="text-gray-400">لطفاً بعداً دوباره تلاش کنید</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-primary text-lg px-8 py-4">
            مشاهده همه تصاویر
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-primary-500 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-500 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-500 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Image */}
            <div className="glass-card-dark rounded-xl overflow-hidden">
              {galleryImages[selectedImage].image ? (
                <OptimizedImage 
                  src={galleryImages[selectedImage].image} 
                  alt={galleryImages[selectedImage].name}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  quality={90}
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">{galleryImages[selectedImage].name}</h3>
                    <p className="text-gray-300">{galleryImages[selectedImage].description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-bold mb-2">{galleryImages[selectedImage].name}</h3>
              <p className="text-gray-300">{galleryImages[selectedImage].description}</p>
              <div className="flex items-center justify-center space-x-4 space-x-reverse mt-2 text-sm text-gray-400">
                <span>{galleryImages[selectedImage].category}</span>
                <span>•</span>
                <span>{galleryImages[selectedImage].date}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {selectedImage + 1} از {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}