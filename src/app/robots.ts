import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account',
        '/subscribe/success',
        '/subscribe/cancel',
        '/api/',
      ],
    },
    sitemap: 'https://epochlit.com/sitemap.xml',
  }
}
