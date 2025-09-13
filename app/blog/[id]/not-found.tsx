import Link from 'next/link'
import { FileX, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="glass-card-dark p-12 max-w-md mx-auto">
          {/* Icon */}
          <div className="text-6xl mb-6">
            <FileX className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            مقاله یافت نشد
          </h1>
          
          {/* Description */}
          <p className="text-gray-400 mb-8">
            متأسفانه مقاله مورد نظر شما یافت نشد. ممکن است حذف شده باشد یا آدرس اشتباه باشد.
          </p>
          
          {/* Actions */}
          <div className="space-y-4">
            <Link 
              href="/blog" 
              className="btn-primary w-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              بازگشت به وبلاگ
            </Link>
            
            <Link 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
