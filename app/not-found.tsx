import Link from 'next/link'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gradient-animated mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">صفحه یافت نشد</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            <Home className="w-5 h-5" />
            بازگشت به خانه
          </Link>
          
          <div className="text-gray-400">
            یا
          </div>
          
          <Link 
            href="/contact"
            className="btn-ghost inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            تماس با ما
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-full flex items-center justify-center mx-auto animate-float">
            <span className="text-6xl">🔧</span>
          </div>
        </div>
      </div>
    </div>
  )
}
