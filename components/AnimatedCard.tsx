'use client'

import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'glass' | 'dark' | 'gradient'
  hover?: boolean
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0, 
  variant = 'glass',
  hover = true 
}: AnimatedCardProps) {
  const variantClasses = {
    glass: 'card-glass',
    dark: 'card-dark',
    gradient: 'bg-gradient-to-br from-dark-900/90 to-dark-800/90 border border-dark-700/50'
  }

  const hoverClass = hover ? 'interactive-hover' : ''

  return (
    <div 
      className={`${variantClasses[variant]} ${hoverClass} ${className} animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
