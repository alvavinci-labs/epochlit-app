import type { Metadata } from 'next'
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
})

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://epochlit.com'),
  title: {
    default: 'Epoch — AIが紡ぐ、人間の未来',
    template: '%s | Epoch',
  },
  description: 'AIが毎日書き下ろす、SF短編小説。静謐で知的な世界へ。',
  keywords: ['SF小説', '短編小説', 'AI小説', '近未来', 'Epoch'],
  authors: [{ name: 'Epoch' }],
  creator: 'Epoch',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://epochlit.com',
    siteName: 'Epoch',
    title: 'Epoch — AIが紡ぐ、人間の未来',
    description: 'AIが毎日書き下ろす、SF短編小説。静謐で知的な世界へ。',
    // /opengraph-image.tsx が自動生成するOGP画像を使用
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Epoch — AIが紡ぐ、人間の未来' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@epochlit',
    creator: '@epochlit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Google Search Console 所有権確認
  verification: { google: 'YASmi-uikIeZX4ATqkQFk6VKkdu_yeh2WmVnTo4ylAg' },
  alternates: {
    types: {
      'application/rss+xml': 'https://epochlit.com/api/feed',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased bg-epoch-bg text-epoch-text min-h-screen">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RKZNCCLM9C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RKZNCCLM9C');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
