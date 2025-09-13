import Script from 'next/script'

interface StructuredDataProps {
  type: 'organization' | 'localBusiness' | 'service' | 'article' | 'breadcrumb'
  data: Record<string, unknown>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "گاراژ تخصصی مکانیکی تورنادو",
          "alternateName": "تورنادو گاراژ",
          "url": "https://tornado-garage.ir",
          "logo": "https://tornado-garage.ir/logo.png",
          "description": "گاراژ تخصصی مکانیکی با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی",
          "foundingDate": "2009",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "خیابان ولیعصر، کوچه 15، پلاک 23",
            "addressLocality": "تهران",
            "addressCountry": "IR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98-21-55555555",
            "contactType": "customer service",
            "availableLanguage": "Persian"
          },
          "sameAs": [
            "https://www.instagram.com/tornado_garage",
            "https://t.me/tornado_garage"
          ]
        }

      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "AutomotiveRepairShop",
          "name": "گاراژ تخصصی مکانیکی تورنادو",
          "image": "https://tornado-garage.ir/images/garage.jpg",
          "description": "تعمیر تخصصی خودروهای آلمانی و چینی با تجهیزات مدرن",
          "url": "https://tornado-garage.ir",
          "telephone": "+98-21-55555555",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "خیابان ولیعصر، کوچه 15، پلاک 23",
            "addressLocality": "تهران",
            "postalCode": "1234567890",
            "addressCountry": "IR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 35.7219,
            "longitude": 51.3347
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
              "opens": "08:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Friday",
              "opens": "08:00",
              "closes": "14:00"
            }
          ],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          },
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 35.7219,
              "longitude": 51.3347
            },
            "geoRadius": "50000"
          }
        }

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name,
          "description": data.description,
          "provider": {
            "@type": "Organization",
            "name": "گاراژ تخصصی مکانیکی تورنادو"
          },
          "areaServed": {
            "@type": "City",
            "name": "تهران"
          },
          "serviceType": "Automotive Repair",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "IRR"
          }
        }

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.excerpt,
          "image": data.image,
          "author": {
            "@type": "Organization",
            "name": "گاراژ تخصصی مکانیکی تورنادو"
          },
          "publisher": {
            "@type": "Organization",
            "name": "گاراژ تخصصی مکانیکی تورنادو",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tornado-garage.ir/logo.png"
            }
          },
          "datePublished": data.publishedAt,
          "dateModified": data.updatedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": (data as unknown as Array<{name: string, url: string}>).map((item, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      default:
        return {}
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}
