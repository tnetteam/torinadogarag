import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: http://localhost:3000/sitemap

# Disallow admin panel
Disallow: /admin/

# Disallow API routes
Disallow: /api/

# Allow important pages
Allow: /
Allow: /services
Allow: /gallery
Allow: /news
Allow: /blog
Allow: /contact`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
