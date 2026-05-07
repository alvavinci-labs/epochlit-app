'use client'

import { useState } from 'react'

// 未ログイン時: メールアドレスを入力してサブスク確認 → セッション発行
export default function EmailLookup() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/verify-subscription', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.verified) {
        // セッション発行済み → ページリロードでAccountClientが表示される
        window.location.reload()
      } else {
        setError('このメールアドレスでのご登録が確認できませんでした。')
      }
    } catch {
      setError('通信エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-epoch-border bg-epoch-surface">
      <p className="text-epoch-muted text-sm mb-5 leading-relaxed">
        登録時のメールアドレスを入力してください。サブスクリプションの状態を確認します。
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
          className="w-full px-4 py-3 rounded-xl bg-epoch-card border border-epoch-border text-epoch-text placeholder-epoch-dim text-sm focus:outline-none focus:border-epoch-purple transition-colors"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-epoch-purple hover:bg-epoch-purple/80 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
        >
          {loading ? '確認中…' : '確認する'}
        </button>
      </form>
    </div>
  )
}
