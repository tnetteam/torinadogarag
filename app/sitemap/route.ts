import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'
  
  try {
    // خواندن داده‌های سرویس‌ها
    const servicesPath = path.join(process.cwd(), 'data', 'services.json')
    let services: Record<string, unknown>[] = []
    if (fs.existsSync(servicesPath)) {
      const servicesData = fs.readFileSync(servicesPath, 'utf8')
      services = JSON.parse(servicesData)
    }


    // خواندن داده‌های وبلاگ
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    let blogPosts: Record<string, unknown>[] = []
    if (fs.existsSync(blogPath)) {
      const blogData = fs.readFileSync(blogPath, 'utf8')
      blogPosts = JSON.parse(blogData)
    }

    // ساخت sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- صفحات اصلی -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`

    // اضافه کردن صفحات سرویس‌ها
    services.forEach(service => {
      if (service.status === 'active') {
        const updatedAt = service.updatedAt as string
        sitemap += `
  <url>
    <loc>${baseUrl}/services/${service.id}</loc>
    <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      }
    })


    // اضافه کردن صفحات وبلاگ
    blogPosts.forEach(post => {
      if (post.status === 'published') {
        const updatedAt = post.updatedAt as string
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`
      }
    })

    sitemap += `
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // کش برای 1 ساعت
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // در صورت خطا، sitemap ساده برگردان
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
