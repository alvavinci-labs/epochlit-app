import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'お支払いをキャンセルしました',
}

export default function SubscribeCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-epoch-surface border border-epoch-border flex items-center justify-center">
            <svg className="w-8 h-8 text-epoch-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-epoch-text mb-3">
            お支払いをキャンセルしました
          </h1>
          <p className="text-epoch-muted text-sm leading-relaxed mb-8">
            サブスクリプション登録はキャンセルされました。<br />
            いつでも再度お試しいただけます。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-epoch-purple hover:bg-epoch-purple/80 text-white rounded-full font-medium transition-all text-sm"
          >
            トップページへ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
