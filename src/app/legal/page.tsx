import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
}

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-serif text-2xl font-bold text-epoch-text mb-8">
          特定商取引法に基づく表記
        </h1>
        {/* TODO: Hirokaが内容を記入してください */}
        <div className="text-epoch-muted text-sm leading-relaxed">
          <p className="text-epoch-dim italic mb-8">
            ※ このページの内容はHirokaが記入してください。
            月額課金サービスのため特定商取引法の表記が法律上必須です。
          </p>
          <table className="w-full border-collapse text-sm">
            <tbody className="divide-y divide-epoch-border/40">
              {[
                ['販売業者', '合同会社alvavinci'],
                ['所在地', '（記入してください）'],
                ['電話番号', '（記入してください）'],
                ['メールアドレス', '（記入してください）'],
                ['代表者', '（記入してください）'],
                ['販売価格', '（Stripeで設定した月額料金）'],
                ['お支払い方法', 'クレジットカード（Stripe）'],
                ['サービス提供時期', '決済完了後即時'],
                ['返品・キャンセル', '月途中のキャンセルは翌月から停止。返金は原則不可。'],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-3 pr-6 text-epoch-dim w-40 align-top">{label}</td>
                  <td className="py-3 text-epoch-muted">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  )
}
