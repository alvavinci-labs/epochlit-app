import Link from 'next/link'
import type { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { StoryCard } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoryCardComponent from '@/components/StoryCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'SF一覧 | Epoch',
  description: 'AIが毎夜生成するSF短編小説の全作品一覧。近未来・AIと人間・宇宙・タイムSFなど多彩なテーマを毎日配信。',
  openGraph: {
    title: 'SF一覧 | Epoch',
    description: 'AIが毎夜生成するSF短編小説の全作品一覧。',
    url: 'https://epochlit.com/sf',
  },
  alternates: { canonical: 'https://epochlit.com/sf' },
}

async function getSFStories(): Promise<StoryCard[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .select('id, hash_id, title, genre, preview, image_url, alt_text, theme, published_at')
    .eq('genre', 'sf')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('SF一覧取得エラー:', error)
    return []
  }
  return data ?? []
}

export default async function SFListPage() {
  const stories = await getSFStories()

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">

          {/* ページヘッダー */}
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
              SF
            </h1>
            <p className="text-epoch-dim text-xs">
              {stories.length}作品
            </p>
          </div>

          {/* グリッド */}
          {stories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {stories.map((story) => (
                <StoryCardComponent key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="text-epoch-dim text-center py-32 text-sm">
              まだ作品がありません
            </p>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
