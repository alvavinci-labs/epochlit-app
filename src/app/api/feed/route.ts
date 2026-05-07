import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: stories } = await supabase
    .from('stories')
    .select('hash_id, title, genre, preview, image_url, published_at')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  const items = (stories ?? []).map((s) => `
    <item>
      <title><![CDATA[${s.title}]]></title>
      <link>https://epochlit.com/${s.genre}/${s.hash_id}</link>
      <guid>https://epochlit.com/${s.genre}/${s.hash_id}</guid>
      <pubDate>${new Date(s.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${s.preview.slice(0, 500)}]]></description>
      <enclosure url="${s.image_url}" type="image/jpeg" />
    </item>
  `).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Epoch — AIが紡ぐ、人間の未来</title>
    <link>https://epochlit.com</link>
    <description>AIが毎日書き下ろすSF短編小説</description>
    <language>ja</language>
    <atom:link href="https://epochlit.com/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
