import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import type { Story, StoryCard as StoryCardType } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Paywall from '@/components/Paywall'
import StoryCard from '@/components/StoryCard'
import { storyHref } from '@/lib/routes'

export const revalidate = 3600

interface Props {
  params: Promise<{ genre?: string; hash_id: string }>
}

type PublicStory = Omit<Story, 'body' | 'quality_score' | 'created_at'>

async function getPublicStory(hash_id: string): Promise<PublicStory | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .select('id, hash_id, title, genre, preview, image_url, alt_text, theme, hashtags, published_at')
    .eq('hash_id', hash_id)
    .single()

  if (error || !data) return null
  return data as PublicStory
}

async function getRelatedStories(genre: string, excludeHashId: string): Promise<StoryCardType[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .select('id, hash_id, title, genre, preview, image_url, alt_text, theme, published_at')
    .eq('genre', genre)
    .neq('hash_id', excludeHashId)
    .order('published_at', { ascending: false })
    .limit(3)

  if (error || !data) return []
  return data as StoryCardType[]
}

async function getPaidStoryBody(hash_id: string): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .select('body')
    .eq('hash_id', hash_id)
    .single()

  if (error || !data) return null
  return data.body as string
}

// 動的OGPメタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre, hash_id } = await params
  const story = await getPublicStory(hash_id)
  if (!story || (genre && story.genre !== genre)) return { title: '作品が見つかりません' }

  const description = story.preview.slice(0, 80)
  const url = `https://epochlit.com${storyHref(story.genre, hash_id)}`

  return {
    title: story.title,
    description,
    openGraph: {
      title:       `${story.title} | Epoch`,
      description,
      url,
      type:        'article',
      locale:      'ja_JP',
      publishedTime: story.published_at,
      images: [{
        url:    story.image_url,
        width:  1200,
        height: 1200,
        alt:    story.alt_text,
      }],
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@epochlit',
      title:       `${story.title} | Epoch`,
      description,
      images:      [story.image_url],
    },
    alternates: { canonical: url },
  }
}

export default async function StoryPage({ params }: Props) {
  const { genre, hash_id } = await params
  const story   = await getPublicStory(hash_id)
  if (!story || (genre && story.genre !== genre)) notFound()

  const session = await getSession()
  const isPaid  = session?.verified === true
  const [body, relatedStories] = await Promise.all([
    isPaid ? getPaidStoryBody(hash_id) : Promise.resolve(null),
    getRelatedStories(story.genre, hash_id),
  ])

  const publishedDate = new Date(story.published_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // JSON-LD 構造化データ
  const storyUrl = `https://epochlit.com${storyHref(story.genre, hash_id)}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   storyUrl,
    },
    headline:   story.title,
    description: story.preview.slice(0, 80),
    image:      story.image_url,
    datePublished: story.published_at,
    dateModified:  story.published_at,
    author: {
      '@type': 'Organization',
      name:    'Epoch',
      url:     'https://epochlit.com',
    },
    publisher: {
      '@type': 'Organization',
      name:    'Epoch',
      url:     'https://epochlit.com',
      logo: {
        '@type': 'ImageObject',
        url:     'https://epochlit.com/opengraph-image',
        width:   1200,
        height:  630,
      },
    },
    url: storyUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen pb-16">
        {/* ヒーロー画像（全幅） */}
        <div className="relative w-full h-[55vh] min-h-[360px] max-h-[600px] overflow-hidden">
          <Image
            src={story.image_url}
            alt={story.alt_text}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        {/* 作品本文エリア */}
        <article className="max-w-2xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          {/* 作品情報 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-xs text-epoch-muted">
              <span className="px-2 py-0.5 bg-epoch-purple/20 text-epoch-purple-light rounded-full border border-epoch-purple/30">
                {story.genre.toUpperCase()}
              </span>
              <span>{story.theme}</span>
              <time dateTime={story.published_at}>{publishedDate}</time>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-epoch-text leading-tight">
              {story.title}
            </h1>
          </div>

          {/* 無料公開エリア（冒頭500字） */}
          <div className={`prose-epoch text-epoch-text text-base leading-[2.0] tracking-wide ${!isPaid ? 'paywall-blur' : ''}`}>
            {story.preview.split('\n').map((para, i) => (
              para.trim() ? (
                <p key={i} className="mb-5">{para}</p>
              ) : (
                <br key={i} />
              )
            ))}
          </div>

          {/* ペイウォール or 全文 */}
          {isPaid && body ? (
            <>
              {/* 全文（有料会員） */}
              <div className="prose-epoch text-epoch-text text-base leading-[2.0] tracking-wide mt-2">
                {body.split('\n').map((para, i) => (
                  para.trim() ? (
                    <p key={i} className="mb-5">{para}</p>
                  ) : (
                    <br key={i} />
                  )
                ))}
              </div>
            </>
          ) : (
            <Paywall storyUrl={storyUrl} />
          )}

          {/* ハッシュタグ */}
          {story.hashtags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {story.hashtags.map((tag) => (
                <span key={tag} className="text-xs text-epoch-dim px-2 py-0.5 border border-epoch-border/40 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* X でシェア */}
          <div className="mt-10 pt-8 border-t border-epoch-border/40 text-center">
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${story.title} — Epoch短編小説\n${storyUrl}\n${story.hashtags?.join(' ')}\n#Epoch`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-epoch-border text-epoch-muted hover:text-epoch-text hover:border-epoch-muted rounded-full text-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X でシェア
            </a>
          </div>

          {/* 他の作品も読む */}
          {relatedStories.length > 0 && (
            <div className="mt-16 pt-12 border-t border-epoch-border/40">
              <h2 className="font-serif text-lg font-semibold text-epoch-text mb-6">
                他の作品も読む
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedStories.map((related) => (
                  <StoryCard key={related.hash_id} story={related} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <a
                  href={`/${story.genre}/`}
                  className="inline-flex items-center gap-1.5 text-sm text-epoch-muted hover:text-epoch-text transition-colors"
                >
                  すべての作品を見る
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </>
  )
}
