import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { StoryCard } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoryCardComponent from '@/components/StoryCard'
import { genreLabel } from '@/lib/genres'

export const revalidate = 3600

interface Props {
  params: Promise<{ genre: string }>
}

async function getGenreStories(genre: string): Promise<StoryCard[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .select('id, hash_id, title, genre, preview, image_url, alt_text, theme, published_at')
    .eq('genre', genre)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('ジャンル一覧取得エラー:', error)
    return []
  }
  return data ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params
  const label = genreLabel(genre)

  return {
    title: `${label}一覧 | Epoch`,
    description: `Epoch の${label}短編小説一覧。AIが毎夜生成する短編作品を配信。`,
    openGraph: {
      title: `${label}一覧 | Epoch`,
      description: `Epoch の${label}短編小説一覧。`,
      url: `https://epochlit.com/${encodeURIComponent(genre)}`,
    },
    alternates: { canonical: `https://epochlit.com/${encodeURIComponent(genre)}` },
  }
}

export default async function GenreListPage({ params }: Props) {
  const { genre } = await params
  const stories = await getGenreStories(genre)
  if (stories.length === 0) notFound()

  const label = genreLabel(genre)

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-epoch-dim hover:text-epoch-muted text-xs transition-colors mb-6"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              トップへ戻る
            </Link>
            <h1 className="font-serif text-epoch-muted text-xs tracking-[0.3em] uppercase mb-1">
              {label}
            </h1>
            <p className="text-epoch-dim text-xs">
              {stories.length}作品
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {stories.map((story) => (
              <StoryCardComponent key={story.id} story={story} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
