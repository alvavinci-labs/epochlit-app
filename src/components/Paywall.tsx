'use client'

import { useState, useEffect } from 'react'

// gtag の型定義（layout.tsx の Script タグで読み込まれるグローバル関数）
declare function gtag(command: string, action: string, params?: Record<string, string>): void

interface Props {
  storyUrl: string // 現在のページURL（Stripe成功後のリダイレクト先）
}

export default function Paywall({ storyUrl }: Props) {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [step, setStep]         = useState<'input' | 'notfound'>('input')

  // ペイウォール表示時に計測
  useEffect(() => {
    gtag('event', 'paywall_shown', { event_category: 'engagement' })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    // メールアドレス送信を計測
    gtag('event', 'paywall_email_submit', { event_category: 'engagement' })

    try {
      const res = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.verified) {
        // セッション発行済み → ページリロードで全文表示
        window.location.reload()
      } else if (data.checkoutUrl) {
        // 未会員 → Stripe Checkout へ遷移
        gtag('event', 'begin_checkout', { event_category: 'conversion' })
        window.location.href = data.checkoutUrl
      } else {
        setStep('notfound')
      }
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-12 rounded-2xl border border-epoch-border bg-epoch-surface p-5 sm:p-8 text-center">
      {/* アイコン */}
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-epoch-purple/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-epoch-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h3 className="font-serif text-xl font-semibold text-epoch-text mb-2">
        続きは会員限定
      </h3>
      <p className="text-epoch-muted text-sm mb-6 leading-relaxed">
        月額会員登録で全作品の全文 + バックナンバーが読み放題。<br />
        登録済みの方はメールアドレスを入力してください。
      </p>

      {step === 'input' && (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <div className="flex flex-col xs:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              className="w-full px-4 py-2.5 rounded-full bg-epoch-card border border-epoch-border text-epoch-text placeholder-epoch-dim text-sm focus:outline-none focus:border-epoch-purple transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto px-5 py-2.5 bg-epoch-purple hover:bg-epoch-purple/80 disabled:opacity-50 text-white rounded-full text-sm font-medium transition-all whitespace-nowrap"
            >
              {loading ? '確認中…' : '続きを読む'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
        </form>
      )}

      {step === 'notfound' && (
        <div className="max-w-sm mx-auto">
          <p className="text-epoch-muted text-sm mb-4">
            <span className="text-epoch-text font-medium">{email}</span> の有効な会員登録が見つかりませんでした。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={async () => {
                setLoading(true)
                const res = await fetch('/api/verify-subscription', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, createCheckout: true, returnUrl: window.location.href }),
                })
                const data = await res.json()
                if (data.checkoutUrl) {
                  // 新規会員登録 → Stripe Checkout へ遷移
                  gtag('event', 'begin_checkout', { event_category: 'conversion', event_label: 'new_member' })
                  window.location.href = data.checkoutUrl
                }
                setLoading(false)
              }}
              disabled={loading}
              className="px-6 py-2.5 bg-epoch-purple hover:bg-epoch-purple/80 disabled:opacity-50 text-white rounded-full text-sm font-medium transition-all"
            >
              {loading ? '処理中…' : '月額会員になる'}
            </button>
            <button
              onClick={() => { setStep('input'); setEmail('') }}
              className="px-6 py-2.5 border border-epoch-border text-epoch-muted hover:text-epoch-text rounded-full text-sm transition-all"
            >
              メールを変更
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-epoch-dim text-xs">
        ※ AI生成フィクションです。いつでもキャンセル可能。
      </p>
    </div>
  )
}
