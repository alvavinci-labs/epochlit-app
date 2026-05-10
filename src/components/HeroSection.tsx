import Image from 'next/image'
import Link from 'next/link'
import type { StoryCard } from '@/types'
import { storyHref } from '@/lib/routes'

interface Props {
  story: StoryCard
}

export default function HeroSection({ story }: Props) {
  return (
    <section className="relative w-full h-[70vh] min-h-[480px] max-h-[700px] overflow-hidden">
      {/* 背景画像 */}
      <Image
        src={story.image_url}
        alt={story.alt_text}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-epoch-bg/80 via-transparent to-transparent" />

      {/* コンテンツ */}
      <div className="relative h-full flex items-end pb-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-lg animate-slide-up">
          <span className="inline-block px-3 py-1 text-xs bg-epoch-purple/80 text-white rounded-full mb-4 font-medium">
            最新作 · {story.genre.toUpperCase()}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-epoch-text leading-tight mb-4">
            {story.title}
          </h1>
          <p className="text-epoch-muted text-sm leading-relaxed mb-6 line-clamp-3">
            {story.preview.slice(0, 120)}…
          </p>
          <Link
            href={storyHref(story.genre, story.hash_id)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-epoch-purple hover:bg-epoch-purple/80 text-white rounded-full font-medium transition-all text-sm"
          >
            今すぐ読む
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
