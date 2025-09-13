import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Stats from '@/components/Stats'
import Gallery from '@/components/Gallery'
import BlogPreview from '@/components/BlogPreview'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <div className="bg-dark-950 min-h-screen">
      <Hero />
      <Services />
      <About />
      <Stats />
      <Gallery />
      <BlogPreview />
      <Contact />
    </div>
  )
}
