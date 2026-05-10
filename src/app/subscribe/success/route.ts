import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { setSessionToResponse } from '@/lib/session'
import { toSameOriginUrl } from '@/lib/urls'

// Stripe Checkout 完了後のリダイレクト先
// session_id からメールを取得し、JWTセッションCookieを発行して元ページへ戻す
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')
  const return_to  = searchParams.get('return_to')
  const returnTo   = toSameOriginUrl(return_to, req.nextUrl.origin)

  if (!session_id) {
    return NextResponse.redirect(new URL(returnTo, req.url))
  }

  try {
    // Stripe セッションからメールアドレスを取得
    const session = await getStripe().checkout.sessions.retrieve(session_id)
    const email = session.customer_email ?? session.customer_details?.email ?? null

    if (email) {
      // Route Handler 内では Cookie の書き込みが可能
      // GA purchase イベント発火のため ?epoch_subscribed=1 を付与してリダイレクト
      const redirectUrl = new URL(returnTo, req.url)
      redirectUrl.searchParams.set('epoch_subscribed', '1')
      redirectUrl.searchParams.set('epoch_transaction_id', session.id)
      if (session.amount_total !== null) {
        redirectUrl.searchParams.set('epoch_value', String(session.amount_total / 100))
      }
      if (session.currency) {
        redirectUrl.searchParams.set('epoch_currency', session.currency.toUpperCase())
      }
      const response = NextResponse.redirect(redirectUrl)
      await setSessionToResponse(email, response)
      return response
    }
  } catch (err) {
    console.error('Stripe セッション取得エラー:', err)
  }

  return NextResponse.redirect(new URL(returnTo, req.url))
}
