import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not set')
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeClient
}

// メールアドレスで有効なサブスクリプションを確認する
export async function checkSubscription(email: string): Promise<boolean> {
  try {
    const stripe = getStripe()
    const customers = await stripe.customers.list({ email, limit: 5 })
    if (customers.data.length === 0) return false

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
      })
      if (subscriptions.data.length > 0) return true
    }
    return false
  } catch (err) {
    console.error('Stripe サブスクリプション確認エラー:', err)
    return false
  }
}

// Stripe Checkout セッションを作成する
export async function createCheckoutSession(email: string, returnUrl: string): Promise<string> {
  const stripe = getStripe()
  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) throw new Error('STRIPE_PRICE_ID is not set')

  // returnUrl からオリジンを取得（success_url のベースに使用）
  const origin = new URL(returnUrl).origin
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // 決済完了後: /subscribe/success → JWT発行 → 元のページへリダイレクト
    success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&return_to=${encodeURIComponent(returnUrl)}`,
    cancel_url:  returnUrl,
    locale: 'ja',
  })
  return session.url!
}
