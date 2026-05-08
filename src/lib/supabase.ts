import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type Database = any

let publicClient: SupabaseClient | null = null
let adminClient: SupabaseClient | null = null

function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!value) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  return value
}

// 読み取り用（公開ビューのみを参照）
export function getSupabasePublic(): SupabaseClient {
  if (!publicClient) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    publicClient = createClient<Database>(getSupabaseUrl(), anonKey)
  }
  return publicClient
}

// サーバーサイド用（Webhook/API ルート、有料本文取得で使用）
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    adminClient = createClient<Database>(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return adminClient
}
