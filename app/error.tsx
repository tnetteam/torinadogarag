'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <span className="text-4xl">⚠️</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">خطا!</h1>
          <h2 className="text-xl font-semibold text-red-400 mb-4">مشکلی پیش آمده</h2>
          <p className="text-gray-300 mb-6">
            متأسفانه خطایی در سیستم رخ داده است. لطفاً دوباره تلاش کنید.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 w-full justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            تلاش مجدد
          </button>
          
          <Link 
            href="/"
            className="btn-ghost inline-flex items-center gap-2 text-lg px-8 py-4 w-full justify-center"
          >
            <Home className="w-5 h-5" />
            بازگشت به خانه
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-right">
            <summary className="text-gray-400 cursor-pointer mb-2">
              جزئیات خطا (فقط در حالت توسعه)
            </summary>
            <pre className="bg-dark-800 p-4 rounded-lg text-sm text-gray-300 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
