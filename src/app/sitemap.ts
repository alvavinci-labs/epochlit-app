import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: stories } = await getSupabaseAdmin()
    .from('stories')
    .select('hash_id, genre, published_at')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  const storyUrls = (stories ?? []).map((s) => ({
    url:          `https://epochlit.com/${s.genre}/${s.hash_id}`,
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
