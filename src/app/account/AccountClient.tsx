'use client'

import { useEffect, useState } from 'react'

interface SubscriptionStatus {
  email:             string
  status:            string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd:  string
  subscriptionId?:   string
}

interface Props {
  email: string
}

export default function AccountClient({ email }: Props) {
  const [sub, setSub]           = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading]   = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showModal, setShowModal]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    fetch('/api/subscription/status')
      .then(r => r.json())
      .then(data => { setSub(data); setLoading(false) })
      .catch(() => { setError('情報の取得に失敗しました。'); setLoading(false) })
  }, [])

  async function handleCancel() {
    setCancelling(true)
    try {
      const res  = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setSub(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : prev)
        setDone(true)
      } else {
        setError(data.error ?? 'キャンセルに失敗しました。')
      }
    } catch {
      setError('通信エラーが発生しました。')
    } finally {
      setCancelling(false)
      setShowModal(false)
    }
  }

  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div>
      {/* メールアドレス */}
      <div className="mb-6 p-4 rounded-xl border border-epoch-border bg-epoch-surface">
        <p className="text-xs text-epoch-dim mb-1">登録メールアドレス</p>
        <p className="text-epoch-text font-medium">{email}</p>
      </div>

      {/* サブスク情報 */}
      {loading ? (
        <p className="text-epoch-dim text-sm animate-pulse">読み込み中…</p>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : sub?.status === 'none' ? (
        <div className="p-4 rounded-xl border border-epoch-border bg-epoch-surface text-epoch-muted text-sm">
          現在アクティブなサブスクリプションはありません。
        </div>
      ) : (
        <div className="space-y-4">
          {/* プラン詳細 */}
          <div className="p-5 rounded-xl border border-epoch-border bg-epoch-surface space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-epoch-dim text-sm">プラン</span>
              <span className="text-epoch-text font-medium">Epoch 月額プラン</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-epoch-dim text-sm">料金</span>
              <span className="text-epoch-text font-medium">¥980 / 月（税込）</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-epoch-dim text-sm">ステータス</span>
              <span>
                {sub?.cancelAtPeriodEnd ? (
                  <span className="text-amber-400 text-sm font-medium">キャンセル予約済み</span>
                ) : sub?.status === 'active' ? (
                  <span className="text-green-400 text-sm font-medium">アクティブ</span>
                ) : (
                  <span className="text-epoch-dim text-sm">{sub?.status}</span>
                )}
              </span>
            </div>
            {periodEnd && (
              <div className="flex justify-between items-center">
                <span className="text-epoch-dim text-sm">
                  {sub?.cancelAtPeriodEnd ? 'サービス終了日' : '次回更新日'}
                </span>
                <span className="text-epoch-text font-medium">{periodEnd}</span>
              </div>
            )}
          </div>

          {/* キャンセルボタン */}
          {!sub?.cancelAtPeriodEnd && !done && (
            <div className="pt-2">
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all"
              >
                サブスクリプションをキャンセル
              </button>
            </div>
          )}

          {/* キャンセル完了メッセージ */}
          {(sub?.cancelAtPeriodEnd || done) && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm leading-relaxed">
              キャンセルが予約されました。<br />
              {periodEnd} までは引き続き全作品をお読みいただけます。
            </div>
          )}
        </div>
      )}

      {/* 確認モーダル */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-epoch-surface border border-epoch-border rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h2 className="font-serif text-lg font-semibold text-epoch-text">
              キャンセルの確認
            </h2>
            <p className="text-epoch-muted text-sm leading-relaxed">
              {periodEnd && `${periodEnd}まで`}引き続きご利用いただけます。それ以降、全文へのアクセスが停止されます。
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-epoch-border text-epoch-muted hover:text-epoch-text rounded-full text-sm transition-all"
              >
                戻る
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-500/80 hover:bg-red-500 disabled:opacity-50 text-white rounded-full text-sm font-medium transition-all"
              >
                {cancelling ? '処理中…' : 'キャンセルする'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
