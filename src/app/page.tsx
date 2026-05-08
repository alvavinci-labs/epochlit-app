import { getSupabasePublic } from '@/lib/supabase'
import type { StoryCard } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import GenreRow from '@/components/GenreRow'

// 1時間キャッシュ
export const revalidate = 3600

// ジャンルの表示名マップ
const GENRE_LABELS: Record<string, string> = {
  sf:      'SF',
  fantasy: 'ファンタジー',
  mystery: 'ミステリー',
  horror:  'ホラー',
  romance: 'ロマンス',
  other:   'その他',
}

async function getStories(): Promise<StoryCard[]> {
  const { data, error } = await getSupabasePublic()
    .from('stories_public')
    .select('id, hash_id, title, genre, preview, image_url, alt_text, theme, published_at')
    .order('published_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('作品取得エラー:', error)
    return []
  }
  return data ?? []
}

export default async function HomePage() {
  const stories = await getStories()
  const latest  = stories[0]

  // ジャンル別にグルーピング（順序を保持）
  const genreMap = new Map<string, StoryCard[]>()
  for (const story of stories) {
    const key = story.genre ?? 'other'
    if (!genreMap.has(key)) genreMap.set(key, [])
    genreMap.get(key)!.push(story)
  }

  // 「最新作」行：全ジャンル混合で最新 20 件
  const latestRow = stories.slice(0, 20)

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* ヒーローセクション */}
        {latest ? (
          <HeroSection story={latest} />
        ) : (
          <div className="h-[75vh] flex flex-col items-center justify-center gap-4">
            <p className="text-epoch-dim font-serif text-xl tracking-wider">
              準備中 — 毎夜20:00に新作が届きます
            </p>
          </div>
        )}

        {/* ジャンル行エリア */}
        <div className="pt-8 pb-20">
          {stories.length > 0 ? (
            <>
              {/* 最新作（全ジャンル混合・最新20件） */}
              <GenreRow title="最新作" stories={latestRow} />

              {/* ジャンル別：複数ジャンルが存在し、かつそのジャンルに2件以上ある場合のみ表示 */}
              {genreMap.size >= 2 && Array.from(genreMap.entries()).map(([genre, genreStories]) => (
                genreStories.length >= 2 && (
                  <GenreRow
                    key={genre}
                    title={GENRE_LABELS[genre] ?? genre.toUpperCase()}
                    stories={genreStories}
                  />
                )
              ))}
            </>
          ) : (
            <div className="text-center py-32">
              <p className="font-serif text-epoch-dim text-lg">
                まもなく第一話が届きます
              </p>
              <p className="text-epoch-dim/50 text-sm mt-2">
                毎夜20:00 JST — AIが新作を生成します
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
