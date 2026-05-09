import Image from 'next/image'
import Link from 'next/link'
import type { StoryCard } from '@/types'

interface Props {
  story: StoryCard
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function StoryCard({ story }: Props) {
  return (
    <Link href={`/${story.genre}/${story.hash_id}`} className="block group">
      <article className="story-card bg-epoch-card rounded-xl overflow-hidden border border-epoch-border/40">
        {/* サムネイル画像 */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={story.image_url}
            alt={story.alt_text}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-card-gradient" />
          {/* ジャンルバッジ */}
          <span className="absolute top-3 left-3 px-2 py-0.5 text-xs bg-epoch-purple/80 text-white rounded-full font-medium backdrop-blur-sm">
            {story.genre.toUpperCase()}
          </span>
        </div>

        {/* テキスト情報 */}
        <div className="p-4">
          <h2 className="font-serif text-epoch-text font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-epoch-purple-light transition-colors">
            {story.title}
          </h2>
          <p className="text-epoch-dim text-xs mb-3 line-clamp-2 leading-relaxed">
            {story.preview.slice(0, 80)}…
          </p>
          <div className="flex items-center justify-between text-xs text-epoch-dim">
            <span>{story.theme}</span>
            <time dateTime={story.published_at}>{formatDate(story.published_at)}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}
