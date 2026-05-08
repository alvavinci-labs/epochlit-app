import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { setSession } from '@/lib/session'
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
      const response = NextResponse.redirect(new URL(returnTo, req.url))
      await setSessionToResponse(email, response)
      return response
    }
  } catch (err) {
    console.error('Stripe セッション取得エラー:', err)
  }

  return NextResponse.redirect(new URL(returnTo, req.url))
}

// Route Handler 用: レスポンスオブジェクトに直接 Cookie をセット
async function setSessionToResponse(email: string, response: NextResponse) {
  const { SignJWT } = await import('jose')
  const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!)
  const SESSION_DURATION = 60 * 60 * 24 * 7 // 7日間

  const token = await new SignJWT({ email, verified: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET)

  response.cookies.set('epoch_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}
