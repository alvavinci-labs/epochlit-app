import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST() {
  // セッション確認
  const session = await getSession()
  if (!session?.email) {
    return NextResponse.json({ error: '未認証' }, { status: 401 })
  }

  const email = session.email

  try {
    const stripe = getStripe()
    // Stripe からアクティブなサブスクリプションを取得
    const customers = await stripe.customers.list({ email, limit: 5 })

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status:   'active',
        limit:    1,
      })

      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0]

        // 期末キャンセル予約（即日停止ではなく次回更新日までは利用継続）
        const updated = await stripe.subscriptions.update(sub.id, {
          cancel_at_period_end: true,
        })

        // Supabase の subscribers テーブルを更新
        await getSupabaseAdmin()
          .from('subscribers')
          .update({
            status:     'cancel_at_period_end',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customer.id)

        return NextResponse.json({
          success:          true,
          currentPeriodEnd: new Date(updated.current_period_end * 1000).toISOString(),
        })
      }
    }

    return NextResponse.json({ error: 'アクティブなサブスクリプションが見つかりません' }, { status: 404 })
  } catch (err) {
    console.error('キャンセルエラー:', err)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
