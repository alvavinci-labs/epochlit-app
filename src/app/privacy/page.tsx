import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-serif text-2xl font-bold text-epoch-text mb-8">
          プライバシーポリシー
        </h1>
        {/* TODO: Hirokaが内容を記入してください */}
        <div className="prose-epoch text-epoch-muted text-sm leading-relaxed space-y-6">
          <p className="text-epoch-dim italic">
            ※ このページの内容はHirokaが記入してください。
            個人情報（Stripe顧客情報・メールアドレス）の取り扱いについて記載が必要です。
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
