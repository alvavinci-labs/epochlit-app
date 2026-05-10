import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import { storyHref } from '@/lib/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: stories } = await getSupabaseAdmin()
    .from('stories')
    .select('hash_id, genre, published_at')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  const genreLastModified = new Map<string, Date>()
  for (const story of stories ?? []) {
    const publishedAt = new Date(story.published_at)
    const current = genreLastModified.get(story.genre)
    if (!current || publishedAt > current) {
      genreLastModified.set(story.genre, publishedAt)
    }
  }

  const genreUrls = Array.from(genreLastModified.entries()).map(([genre, lastModified]) => ({
    url:             `https://epochlit.com/${encodeURIComponent(genre)}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority:        0.7,
  }))

  const storyUrls = (stories ?? []).map((s) => ({
    url:             `https://epochlit.com${storyHref(s.genre, s.hash_id)}`,
    lastModified:    new Date(s.published_at),
    changeFrequency: 'never' as const,
    priority:        0.8,
  }))

  return [
    {
      url:             'https://epochlit.com',
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        1.0,
    },
    ...genreUrls,
    ...storyUrls,
  ]
}
