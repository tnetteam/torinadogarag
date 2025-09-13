import { Metadata } from 'next'
import AdminDashboard from '@/components/AdminDashboard'
import AdminErrorBoundary from '@/components/AdminErrorBoundary'

export const metadata: Metadata = {
  title: 'پنل مدیریت | گاراژ تخصصی مکانیکی',
  description: 'پنل مدیریت گاراژ تخصصی مکانیکی',
  robots: 'noindex, nofollow', // Prevent indexing of admin panel
}

export default function AdminPage() {
  return (
    <AdminErrorBoundary>
      <AdminDashboard />
    </AdminErrorBoundary>
  )
}
