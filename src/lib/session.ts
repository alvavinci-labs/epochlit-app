import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import type { SessionPayload } from '@/types'

const COOKIE_NAME = 'epoch_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7日間

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, verified: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSessionSecret())
}

// セッションCookieを発行する
export async function setSession(email: string): Promise<void> {
  const token = await createSessionToken(email)

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
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const secret = getSessionSecret()

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// Route Handler の redirect response にセッションCookieを付与する
export async function setSessionToResponse(email: string, response: NextResponse): Promise<void> {
  const token = await createSessionToken(email)
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

// セッションを削除する
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
