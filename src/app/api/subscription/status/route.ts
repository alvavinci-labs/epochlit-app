import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getStripe } from '@/lib/stripe'

export async function GET() {
  // セッション確認
  const session = await getSession()
  if (!session?.email) {
    return NextResponse.json({ error: '未認証' }, { status: 401 })
  }

  const email = session.email

  try {
    const stripe = getStripe()
    // Stripe からサブスクリプション情報を取得
    const customers = await stripe.customers.list({ email, limit: 5 })

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 1,
      })

      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0]
        return NextResponse.json({
          email,
          status:              sub.status,                          // active / canceled / past_due 等
          cancelAtPeriodEnd:   sub.cancel_at_period_end,
          currentPeriodEnd:    new Date(sub.current_period_end * 1000).toISOString(),
          subscriptionId:      sub.id,
        })
      }
    }

    // サブスクなし
    return NextResponse.json({ email, status: 'none' })
  } catch (err) {
    console.error('サブスク情報取得エラー:', err)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
