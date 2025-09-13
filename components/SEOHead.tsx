import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export default function SEOHead({
  title = 'تورنادو | گاراژ تخصصی مکانیکی | تعمیر خودروهای آلمانی و چینی',
  description = 'گاراژ تخصصی مکانیکی تورنادو با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی. خدمات مکانیکی، تعمیر موتور، گیربکس و سیستم برقی.',
  keywords = [
    'تعمیر خودرو',
    'مکانیک',
    'خودرو آلمانی',
    'خودرو چینی',
    'گاراژ',
    'تعمیر موتور',
    'گیربکس',
    'سیستم برقی',
    'تورنادو',
    'تهران'
  ],
  image = 'https://tornado-garage.ir/images/og-image.jpg',
  url = 'https://tornado-garage.ir',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'گاراژ تخصصی مکانیکی تورنادو',
  section,
  tags = []
}: SEOHeadProps) {
  const fullTitle = title.includes('تورنادو') ? title : `${title} | تورنادو گاراژ`
  const fullUrl = url.startsWith('http') ? url : `https://tornado-garage.ir${url}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="تورنادو گاراژ" />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="تورنادو گاراژ" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IR-TE" />
      <meta name="geo.placename" content="تهران" />
      <meta name="geo.position" content="35.7219;51.3347" />
      <meta name="ICBM" content="35.7219, 51.3347" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="fa" />
      <meta name="language" content="Persian" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  )
}
