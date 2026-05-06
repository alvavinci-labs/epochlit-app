import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { SessionPayload } from '@/types'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!)
const COOKIE_NAME = 'epoch_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7日間

// セッションCookieを発行する
export async function setSession(email: string): Promise<void> {
  const token = await new SignJWT({ email, verified: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

// セッションを検証して有効なら SessionPayload を返す
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// セッションを削除する
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
