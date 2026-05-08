import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: '署名なし' }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook 署名検証エラー:', err)
    return NextResponse.json({ error: '署名検証失敗' }, { status: 400 })
  }

  // サブスクリプションの状態変化を subscribers テーブルに反映
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub      = event.data.object
      const customer = await getStripe().customers.retrieve(sub.customer as string)
      const email    = 'email' in customer ? customer.email : null
      if (!email) break

      await getSupabaseAdmin().from('subscribers').upsert({
        stripe_customer_id: sub.customer as string,
        email,
        status:     sub.status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_customer_id' })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await getSupabaseAdmin()
        .from('subscribers')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
  }

  return NextResponse.json({ received: true })
}
