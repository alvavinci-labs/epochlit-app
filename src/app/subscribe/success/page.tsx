import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { setSession } from '@/lib/session'

interface Props {
  searchParams: Promise<{ session_id?: string; return_to?: string }>
}

export default async function SubscribeSuccessPage({ searchParams }: Props) {
  const { session_id, return_to } = await searchParams
  const returnTo = return_to ? decodeURIComponent(return_to) : '/'

  if (!session_id) {
    redirect(returnTo)
  }

  let email: string | null = null

  try {
    // Stripe セッションからメールアドレスを取得
    const session = await stripe.checkout.sessions.retrieve(session_id)
    email = session.customer_email ?? session.customer_details?.email ?? null
  } catch (err) {
    console.error('Stripe セッション取得エラー:', err)
  }

  // メール取得成功 → JWTセッションCookieを発行
  if (email) {
    await setSession(email)
  }

  // 元のページへリダイレクト（全文表示される状態になる）
  redirect(returnTo)
}
