import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-epoch-bg via-epoch-bg/80 to-transparent backdrop-blur-sm">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 h-16 flex items-center">
        <Link href="/" className="group">
          <span className="font-serif text-2xl font-bold text-epoch-text tracking-widest group-hover:text-epoch-purple-light transition-colors">
            EPOCH
          </span>
        </Link>
      </div>
    </header>
  )
}
