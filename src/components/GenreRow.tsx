'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { StoryCard } from '@/types'

interface Props {
  title: string
  stories: StoryCard[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
  })
}

function Card({ story }: { story: StoryCard }) {
  return (
    <Link href={`/sf/${story.hash_id}`} className="block group flex-none w-44 sm:w-52">
      <article>
        {/* サムネイル */}
        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2">
          <Image
            src={story.image_url}
            alt={story.alt_text}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 176px, 208px"
          />
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* ジャンルバッジ */}
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] bg-epoch-purple/80 text-white rounded-full font-medium backdrop-blur-sm uppercase tracking-wide">
            {story.genre}
          </span>
          {/* ホバー時のオーバーレイ */}
          <div className="absolute inset-0 bg-epoch-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* タイトル・日付 */}
        <h3 className="font-serif text-epoch-text text-sm leading-snug line-clamp-2 group-hover:text-epoch-purple-light transition-colors">
          {story.title}
        </h3>
        <time className="text-epoch-dim/60 text-[11px] mt-1 block" dateTime={story.published_at}>
          {formatDate(story.published_at)}
        </time>
      </article>
    </Link>
  )
}

export default function GenreRow({ title, stories }: Props) {
  if (stories.length === 0) return null

  return (
    <section className="mb-10">
      {/* 行ヘッダー */}
      <h2 className="font-serif text-epoch-muted text-xs tracking-[0.3em] uppercase px-6 sm:px-10 mb-4">
        {title}
      </h2>

      {/* 横スクロールコンテナ */}
      <div className="flex gap-3 overflow-x-auto px-6 sm:px-10 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
        {stories.map((story) => (
          <div key={story.id} className="snap-start">
            <Card story={story} />
          </div>
        ))}
      </div>
    </section>
  )
}
