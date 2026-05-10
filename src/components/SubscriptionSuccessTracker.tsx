'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

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

    const value = Number(searchParams.get('epoch_value'))
    const currency = searchParams.get('epoch_currency') ?? 'JPY'
    const transactionId = searchParams.get('epoch_transaction_id') ?? undefined

    // GA purchase イベントを送信
    trackEvent('purchase', {
      event_category: 'conversion',
      event_label:    'epoch_subscription',
      currency,
      ...(Number.isFinite(value) ? { value } : {}),
      ...(transactionId ? { transaction_id: transactionId } : {}),
    })

    // URLから ?epoch_subscribed=1 を除去（ブラウザ履歴に残さない）
    const params = new URLSearchParams(searchParams.toString())
    params.delete('epoch_subscribed')
    params.delete('epoch_transaction_id')
    params.delete('epoch_value')
    params.delete('epoch_currency')
    const cleanUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    router.replace(cleanUrl, { scroll: false })
  }, [searchParams, router, pathname])

  return null
}
