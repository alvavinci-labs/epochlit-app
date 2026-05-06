import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
}

const LEGAL_ITEMS = [
  ['販売業者',       '合同会社alvavinci'],
  ['代表者',         'Hiroka Ason'],
  ['所在地',         '請求があった場合には遅滞なく開示します'],
  ['電話番号',       '請求があった場合には遅滞なく開示します'],
  ['メールアドレス', 'inquiry-epochlit@alvavinci.com'],
  ['サービス名',     'Epoch（epochlit.com）'],
  ['販売価格',       '月額980円（税込）'],
  ['お支払い方法',   'クレジットカード（Visa / Mastercard / American Express / JCB）'],
  ['決済代行',       'Stripe, Inc.'],
  ['サービス提供時期', '決済完了後、即時'],
  ['契約期間',       '月単位の自動更新。キャンセルまで継続されます。'],
  ['キャンセル方法', 'サブスクリプション管理ページよりいつでもキャンセル可能。キャンセル後は次回請求日をもってサービスが停止します。'],
  ['返品・返金',     '月途中のキャンセルによる日割り返金は原則行いません。当社の責に帰すべき事由による障害が生じた場合はこの限りではありません。'],
  ['動作環境',       'モダンブラウザ（Chrome / Safari / Firefox / Edge 最新版）'],
] as const

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-serif text-2xl font-bold text-epoch-text mb-2">
          特定商取引法に基づく表記
        </h1>
        <p className="text-epoch-dim text-xs mb-12">最終更新日：2026年5月</p>

        <div className="text-sm">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-epoch-border/30">
              {LEGAL_ITEMS.map(([label, value]) => (
                <tr key={label}>
                  <td className="py-4 pr-6 text-epoch-dim w-36 align-top leading-relaxed">
                    {label}
                  </td>
                  <td className="py-4 text-epoch-muted leading-relaxed">
                    {label === 'メールアドレス' ? (
                      <a
                        href="mailto:inquiry-epochlit@alvavinci.com"
                        className="text-epoch-purple-light hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </td>
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
