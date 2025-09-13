'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  loading?: boolean
  className?: string
}

export default function AnimatedButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  loading = false,
  className = '',
  ...props 
}: AnimatedButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-primary-500/25 border border-primary-400/20'
  }

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  }

  const baseClasses = `${variantClasses[variant]} ${sizeClasses[size]} interactive-hover ${className}`

  return (
    <button 
      className={baseClasses}
      disabled={loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          icon && <span>{icon}</span>
        )}
        <span>{children}</span>
      </div>
    </button>
  )
}
