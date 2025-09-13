import { Metadata } from 'next'
import Gallery from '@/components/Gallery'

export const metadata: Metadata = {
  title: 'گالری تصاویر | گاراژ تخصصی مکانیکی',
  description: 'گالری تصاویر گاراژ تخصصی مکانیکی - نگاهی به محیط کار، تجهیزات و خدمات ما',
  keywords: 'گالری، تصاویر، گاراژ، مکانیکی، تعمیر خودرو',
  openGraph: {
    title: 'گالری تصاویر | گاراژ تخصصی مکانیکی',
    description: 'گالری تصاویر گاراژ تخصصی مکانیکی - نگاهی به محیط کار، تجهیزات و خدمات ما',
    type: 'website',
  },
}

export default function GalleryPage() {
  return (
    <div className="bg-dark-950 min-h-screen">
      <Gallery />
    </div>
  )
}
