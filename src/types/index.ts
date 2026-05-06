export interface Story {
  id: string
  hash_id: string
  title: string
  genre: 'sf' | string
  preview: string       // 冒頭500字（無料公開）
  body: string          // 全文（有料会員のみ）
  image_url: string     // Higgsfield生成画像URL
  alt_text: string      // 画像ALTテキスト
  quality_score: number // 品質スコア（0-100）
  theme: string         // テーマカテゴリ（例: AI・機械知性）
  hashtags: string[]    // ハッシュタグ
  published_at: string  // ISO8601
  created_at: string
}

export interface StoryCard {
  id: string
  hash_id: string
  title: string
  genre: string
  preview: string
  image_url: string
  alt_text: string
  theme: string
  published_at: string
}

export interface Subscriber {
  id: string
  stripe_customer_id: string
  email: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  created_at: string
  updated_at: string
}

export interface SessionPayload {
  email: string
  verified: boolean
  exp: number
}

// Quill パイプラインから POST されるリクエストボディ
export interface CreateStoryRequest {
  title: string
  genre: string
  preview: string
  body: string
  image_url: string
  alt_text: string
  quality_score: number
  theme: string
  hashtags: string[]
  published_at?: string
}
