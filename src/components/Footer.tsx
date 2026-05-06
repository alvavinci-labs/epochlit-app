import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-epoch-border/40 mt-24 py-12 text-epoch-dim text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-serif text-epoch-muted font-semibold tracking-widest mb-2">EPOCH</p>
            <p className="text-xs leading-relaxed max-w-xs">
              AIが紡ぐ、人間の未来。<br />
              毎日1本のSF短編小説をお届けします。
            </p>
            <p className="mt-3 text-xs text-epoch-dim">
              ※ 本作品はAIが生成したフィクションです。
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-xs">
            <Link href="/privacy" className="hover:text-epoch-muted transition-colors">プライバシーポリシー</Link>
            <Link href="/terms"   className="hover:text-epoch-muted transition-colors">利用規約</Link>
            <Link href="/legal"   className="hover:text-epoch-muted transition-colors">特定商取引法に基づく表記</Link>
            <a
              href="https://x.com/epochlit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-epoch-muted transition-colors"
            >
              X / @epochlit
            </a>
          </nav>
        </div>
        <p className="mt-8 text-xs text-center text-epoch-dim/60">
          © {new Date().getFullYear()} Epoch / alvavinci LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
