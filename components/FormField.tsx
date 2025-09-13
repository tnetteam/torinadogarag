'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  options?: { value: string; label: string }[]
  rows?: number
  className?: string
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
  rows = 3,
  className = ''
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputClasses = `
    w-full px-4 py-3 bg-dark-800/50 border rounded-lg transition-all duration-300
    text-white placeholder-gray-400 backdrop-blur-sm
    ${error 
      ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
      : isFocused 
        ? 'border-primary-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20' 
        : 'border-white/20 hover:border-white/30'
    }
    ${className}
  `

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <option value="">انتخاب کنید...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              className={inputClasses}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        )

      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 mr-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-red-400 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}
