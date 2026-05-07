import Link from 'next/link'
import { getSession } from '@/lib/session'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-epoch-bg via-epoch-bg/80 to-transparent backdrop-blur-sm">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="font-serif text-2xl font-bold text-epoch-text tracking-widest group-hover:text-epoch-purple-light transition-colors">
            EPOCH
          </span>
        </Link>

        {/* アカウント管理リンク（ログイン済み or 未ログイン共通表示） */}
        <Link
          href="/account"
          className="text-epoch-dim hover:text-epoch-muted text-xs transition-colors"
        >
          {session?.email ? 'アカウント' : 'ログイン'}
        </Link>
      </div>
    </header>
  )
}
