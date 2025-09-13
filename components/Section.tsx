'use client'

import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  background?: 'default' | 'pattern' | 'gradient'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Section({ 
  children, 
  title, 
  subtitle, 
  className = '',
  background = 'default',
  padding = 'lg'
}: SectionProps) {
  const backgroundClasses = {
    default: 'bg-dark-950',
    pattern: 'bg-dark-950 dot-pattern',
    gradient: 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950'
  }

  const paddingClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24'
  }

  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16 animate-fade-in">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
