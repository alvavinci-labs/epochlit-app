import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '利用規約',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-serif text-2xl font-bold text-epoch-text mb-2">
          利用規約
        </h1>
        <p className="text-epoch-dim text-xs mb-12">最終更新日：2026年5月</p>

        <div className="prose-epoch text-epoch-muted text-sm leading-relaxed space-y-10">

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、合同会社alvavinci（以下「当社」）が提供するAI短編小説サービス「Epoch」（epochlit.com、以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意の上、本サービスを利用するものとします。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第2条（サービス内容）</h2>
            <p>本サービスは、AIが生成する短編小説を毎日提供するサブスクリプションサービスです。冒頭約500字は無料で閲覧でき、全文の閲覧には有料サブスクリプションへの登録が必要です。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第3条（料金・決済）</h2>
            <p>有料サブスクリプションの料金は月額980円（税込）です。決済はStripe, Inc.を通じたクレジットカード払いのみとし、毎月自動更新されます。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第4条（キャンセル・返金）</h2>
            <p>サブスクリプションはいつでもキャンセルできます。キャンセル後は次回請求日をもってサービスが停止します。月途中のキャンセルによる日割り返金は原則行いません。ただし、当社の責に帰すべき事由によるサービス障害が生じた場合はこの限りではありません。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第5条（AI生成コンテンツに関する免責）</h2>
            <p>本サービスのコンテンツはAIによって自動生成されます。当社は生成されるコンテンツの正確性・完全性・特定目的への適合性について保証しません。また、フィクションとして提供されるものであり、現実の人物・団体・事件等とは一切関係ありません。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第6条（著作権）</h2>
            <p>本サービス上のコンテンツ（AI生成テキスト・画像を含む）の著作権は当社に帰属します。利用者は個人的な閲覧目的以外での複製・転載・二次利用を禁じます。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第7条（禁止事項）</h2>
            <p>利用者は以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-epoch-dim">
              <li>本サービスのコンテンツの無断転載・商業利用</li>
              <li>他者のメールアドレスを用いた不正利用</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>法令または公序良俗に反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第8条（サービスの変更・停止）</h2>
            <p>当社は事前の通知なく本サービスの内容を変更し、または提供を停止することがあります。これにより利用者に生じた損害について、当社は責任を負いません。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第9条（免責事項）</h2>
            <p>当社は、本サービスに関連して利用者に生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">第10条（準拠法・管轄）</h2>
            <p>本規約は日本法に準拠するものとし、本サービスに関する紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>

          <section>
            <h2 className="font-serif text-epoch-text text-base font-semibold mb-3">お問い合わせ</h2>
            <p className="text-epoch-dim">
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
