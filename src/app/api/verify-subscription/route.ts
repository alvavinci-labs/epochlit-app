import { NextRequest, NextResponse } from 'next/server'
import { checkSubscription, createCheckoutSession } from '@/lib/stripe'
import { setSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, createCheckout, returnUrl } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'メールアドレスが必要です' }, { status: 400 })
    }

    const isSubscribed = await checkSubscription(email)

    if (isSubscribed) {
      // セッションCookieを発行
      await setSession(email)
      return NextResponse.json({ verified: true })
    }

    if (createCheckout && returnUrl) {
      // Stripe Checkout セッションを生成
      const checkoutUrl = await createCheckoutSession(email, returnUrl)
      return NextResponse.json({ verified: false, checkoutUrl })
    }

    return NextResponse.json({ verified: false })
  } catch (err) {
    console.error('サブスクリプション確認エラー:', err)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
