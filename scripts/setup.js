#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Garage Website...')

// Create necessary directories
const directories = [
  'public/images',
  'public/gallery',
  'public/blog',
  'data',
  'logs'
]

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }
})

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  const envContent = `# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=گاراژ تخصصی مکانیکی

# Admin Panel Security
ADMIN_SECRET_KEY=your_admin_secret_key_here

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id_here
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local file')
}

// Create sample data files
const sampleData = {
  services: [
    {
      id: 1,
      name: "تعمیر موتور",
      description: "تعمیر و بازسازی کامل موتور خودروهای آلمانی و چینی",
      price: "500000",
      status: "active",
      features: ["تعمیر موتور", "تعویض قطعات", "تنظیم موتور", "تست عملکرد"]
    },
    {
      id: 2,
      name: "تعمیر گیربکس",
      description: "تعمیر تخصصی گیربکس دستی و اتوماتیک",
      price: "800000",
      status: "active",
      features: ["تعمیر گیربکس", "تعویض روغن", "تنظیم کلاچ", "تست عملکرد"]
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "نکات مهم برای نگهداری خودروهای آلمانی",
      excerpt: "خودروهای آلمانی به دلیل کیفیت بالا و تکنولوژی پیشرفته نیاز به نگهداری خاصی دارند.",
      content: "محتوای کامل مقاله...",
      author: "مهندس احمدی",
      date: "2024-01-15",
      category: "نگهداری",
      tags: ["خودرو آلمانی", "نگهداری", "BMW", "Mercedes"],
      status: "published",
      views: 1250
    }
  ]
}

// Write sample data files
Object.entries(sampleData).forEach(([filename, data]) => {
  const filePath = path.join(process.cwd(), 'data', `${filename}.json`)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`✅ Created sample data: ${filename}.json`)
  }
})

console.log(`
🎉 Setup completed successfully!

Next steps:
1. Install dependencies: npm install
2. Configure your .env.local file
3. Run development server: npm run dev
4. Visit http://localhost:3000 to see your website
5. Visit http://localhost:3000/admin for admin panel

Important:
- Configure your site URL in .env.local
- Set up a secure ADMIN_SECRET_KEY for admin panel access
`)

console.log('📚 For more information, check the README.md file')
