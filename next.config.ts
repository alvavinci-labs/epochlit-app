import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Higgsfield CDN（AWS CloudFront経由で配信）
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: '*.higgsfield.ai' },
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
