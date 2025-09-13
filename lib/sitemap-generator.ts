import fs from 'fs'
import path from 'path'

// Post interface for sitemap
interface PostWithDates {
  id: number
  updatedAt: string
  createdAt?: string
}

interface SitemapUrl {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class SitemapGenerator {
  private baseUrl: string
  private urls: SitemapUrl[] = []

  constructor(baseUrl: string = 'https://tornado-garage.ir') {
    this.baseUrl = baseUrl
  }

  addUrl(url: string, options: Partial<Omit<SitemapUrl, 'url'>> = {}) {
    this.urls.push({
      url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
      lastModified: options.lastModified || new Date(),
      changeFrequency: options.changeFrequency || 'weekly',
      priority: options.priority || 0.5
    })
  }

  addStaticPages() {
    // Main pages
    this.addUrl('/', { priority: 1, changeFrequency: 'daily' })
    this.addUrl('/about', { priority: 0.9, changeFrequency: 'monthly' })
    this.addUrl('/services', { priority: 0.9, changeFrequency: 'weekly' })
    this.addUrl('/blog', { priority: 0.8, changeFrequency: 'daily' })
    this.addUrl('/gallery', { priority: 0.7, changeFrequency: 'weekly' })
    this.addUrl('/contact', { priority: 0.6, changeFrequency: 'monthly' })
  }

  async addDynamicPages() {
    try {
      // Add blog posts
      const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json')
      if (fs.existsSync(blogPostsPath)) {
        const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'))
        blogPosts.forEach((post: { id: number; updatedAt: string }) => {
          this.addUrl(`/blog/${post.id}`, {
            lastModified: new Date(post.updatedAt || (post as PostWithDates).createdAt || new Date()),
            priority: 0.7,
            changeFrequency: 'monthly'
          })
        })
      }

    } catch (error) {
      console.error('Error adding dynamic pages to sitemap:', error)
    }
  }

  generateXML(): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${this.urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return xml
  }

  async saveToFile(filePath: string = 'public/sitemap.xml') {
    try {
      await this.addDynamicPages()
      const xml = this.generateXML()
      const fullPath = path.join(process.cwd(), filePath)
      fs.writeFileSync(fullPath, xml, 'utf8')
      console.log(`Sitemap saved to ${fullPath}`)
    } catch (error) {
      console.error('Error saving sitemap:', error)
    }
  }

  async generateAndSave() {
    this.addStaticPages()
    await this.saveToFile()
  }
}

// Usage example
export async function generateSitemap() {
  const generator = new SitemapGenerator()
  await generator.generateAndSave()
}
