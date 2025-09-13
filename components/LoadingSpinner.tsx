'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-500/20"></div>
        
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
        
        {/* Inner Glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary-500/10 to-primary-600/10 animate-pulse-slow"></div>
      </div>
      
      {text && (
        <p className="text-gray-300 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}
