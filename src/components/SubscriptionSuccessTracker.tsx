'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// gtag の型定義（layout.tsx の Script タグで読み込まれるグローバル関数）
declare function gtag(command: string, action: string, params?: Record<string, string>): void

/**
 * Stripe Checkout 完了後に GA の purchase イベントを発火するコンポーネント。
 * success/route.ts が ?epoch_subscribed=1 を付与してリダイレクトしてくるので、
 * それを検知してイベントを送信し、パラメータをURLから除去する。
 */
export default function SubscriptionSuccessTracker() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()

  useEffect(() => {
    if (searchParams.get('epoch_subscribed') !== '1') return

    // GA purchase イベントを送信
    gtag('event', 'purchase', {
      event_category: 'conversion',
      event_label:    'epoch_subscription',
    })

    // URLから ?epoch_subscribed=1 を除去（ブラウザ履歴に残さない）
    const params = new URLSearchParams(searchParams.toString())
    params.delete('epoch_subscribed')
    const cleanUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    router.replace(cleanUrl, { scroll: false })
  }, [searchParams, router, pathname])

  return null
}
