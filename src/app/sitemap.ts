import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'

// ジャンルと実際のNext.jsルートのマッピング
// 新ジャンルのルート（例: src/app/mystery/）を追加したらここにも追加すること
const GENRE_ROUTES: Record<string, string> = {
  sf: 'sf',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: stories } = await getSupabaseAdmin()
    .from('stories')
    .select('hash_id, genre, published_at')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  // ルートが存在するジャンルの作品のみサイトマップに含める
  const storyUrls = (stories ?? [])
    .filter((s) => GENRE_ROUTES[s.genre])
    .map((s) => ({
      url:          `https://epochlit.com/${GENRE_ROUTES[s.genre]}/${s.hash_id}`,
      lastModified: new Date(s.published_at),
      changeFrequency: 'never' as const,
      priority:     0.8,
    }))

  return [
    {
      url:             'https://epochlit.com',
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        1.0,
    },
    ...storyUrls,
  ]
}
