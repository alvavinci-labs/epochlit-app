import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type Database = any

let adminClient: SupabaseClient | null = null

function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!value) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  return value
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
