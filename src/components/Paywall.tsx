'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface Props {
  storyUrl: string // 現在のページURL（Stripe成功後のリダイレクト先）
}

export default function Paywall({ storyUrl }: Props) {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // ペイウォール表示時に計測
  useEffect(() => {
    trackEvent('paywall_shown', { event_category: 'engagement' })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    // メールアドレス送信を計測
    trackEvent('paywall_email_submit', { event_category: 'engagement' })

    try {
      const res = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, createCheckout: true, returnUrl: storyUrl }),
      })
      if (!res.ok) throw new Error('failed to verify subscription')
      const data = await res.json()

      if (data.verified) {
        // セッション発行済み → ページリロードで全文表示
        window.location.reload()
      } else if (data.checkoutUrl) {
        // 未会員 → Stripe Checkout へ遷移
        trackEvent('begin_checkout', { event_category: 'conversion' })
        window.location.href = data.checkoutUrl
      } else {
        setError('登録ページを開けませんでした。もう一度お試しください。')
      }
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="paywall my-12 rounded-2xl border border-epoch-border bg-epoch-surface p-5 sm:p-8 text-center">
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
        月額会員登録で全作品の全文とバックナンバーが読み放題。<br />
        登録済みの方は同じメールアドレスで全文を表示できます。
      </p>

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
            {loading ? '確認中…' : '登録して続きを読む'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
      </form>

      <p className="mt-6 text-epoch-dim text-xs">
        ※ AI生成フィクションです。いつでもキャンセル可能。
      </p>
    </div>
  )
}
