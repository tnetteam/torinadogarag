'use client'

import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import StructuredData from './StructuredData'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const breadcrumbData = [
    { name: 'خانه', url: 'https://tornado-garage.ir' },
    ...items
  ]

  return (
    <>
      <StructuredData type="breadcrumb" data={{ itemListElement: breadcrumbData }} />
      <nav 
        className={`flex items-center space-x-2 space-x-reverse text-sm ${className}`}
        aria-label="مسیر ناوبری"
      >
        <Link 
          href="/" 
          className="flex items-center text-gray-400 hover:text-primary-400 transition-colors"
          aria-label="خانه"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 space-x-reverse">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            {index === items.length - 1 ? (
              <span className="text-white font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
