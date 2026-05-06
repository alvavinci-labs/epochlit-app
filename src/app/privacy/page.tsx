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
        <h1 className="font-serif text-2xl font-bold text-epoch-text mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-epoch-dim text-xs mb-12">最終更新日：2026年5月</p>

        <div className="prose-epoch text-epoch-muted text-sm leading-relaxed space-y-10">

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">1. 事業者</h2>
            <p>合同会社alvavinci（以下「当社」）は、Epoch（epochlit.com、以下「本サービス」）において、利用者の個人情報を以下の方針に従って取り扱います。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">2. 収集する情報</h2>
            <p>本サービスでは、以下の情報を収集します。</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-epoch-dim">
              <li>メールアドレス（有料コンテンツのサブスクリプション確認時）</li>
              <li>決済情報（クレジットカード番号等はStripe, Inc.が管理し、当社は保持しません）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報、閲覧ページ等）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">3. 利用目的</h2>
            <p>収集した情報は以下の目的で利用します。</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-epoch-dim">
              <li>有料サブスクリプションの認証・管理</li>
              <li>決済処理および請求管理</li>
              <li>サービス改善および不正利用の防止</li>
              <li>お問い合わせへの対応</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">4. 第三者提供</h2>
            <p>当社は、以下の場合を除き、個人情報を第三者に提供しません。</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-epoch-dim">
              <li>法令に基づく場合</li>
              <li>決済処理のため Stripe, Inc. に提供する場合（<a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" className="text-epoch-purple-light hover:underline">Stripe プライバシーポリシー</a>）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">5. Cookie・セッション</h2>
            <p>本サービスは、サブスクリプション認証のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることができますが、その場合一部機能が利用できなくなる場合があります。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">6. 情報の保管・削除</h2>
            <p>個人情報はサブスクリプションの有効期間中および法令で定める保存期間中、安全な環境で管理します。情報の削除をご希望の場合は、下記お問い合わせ先までご連絡ください。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">7. プライバシーポリシーの変更</h2>
            <p>当社は必要に応じて本ポリシーを改定することがあります。重要な変更がある場合はサービス上でお知らせします。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">8. お問い合わせ</h2>
            <p>個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。</p>
            <p className="mt-2 text-epoch-dim">
              合同会社alvavinci<br />
              メール：<a href="mailto:inquiry-epochlit@alvavinci.com" className="text-epoch-purple-light hover:underline">inquiry-epochlit@alvavinci.com</a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
