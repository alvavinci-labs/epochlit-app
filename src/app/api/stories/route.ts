import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateHashId } from '@/lib/hashid'
import type { CreateStoryRequest } from '@/types'

// Quill パイプラインからの作品登録エンドポイント
// Authorization: Bearer <API_SECRET_KEY> が必要
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token      = authHeader?.replace('Bearer ', '')

  if (!token || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: '認証エラー' }, { status: 401 })
  }

  let body: CreateStoryRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 })
  }

  // 必須フィールドチェック
  const required = ['title', 'genre', 'preview', 'body', 'image_url']
  for (const field of required) {
    if (!body[field as keyof CreateStoryRequest]) {
      return NextResponse.json({ error: `${field} は必須です` }, { status: 400 })
    }
  }

  const hash_id = generateHashId()

  const { data, error } = await getSupabaseAdmin()
    .from('stories')
    .insert({
      hash_id,
      title:         body.title,
      genre:         body.genre,
      preview:       body.preview,
      body:          body.body,
      image_url:     body.image_url,
      alt_text:      body.alt_text ?? `${body.title} — Epoch SF短編小説の挿絵`,
      quality_score: body.quality_score ?? 0,
      theme:         body.theme ?? '',
      hashtags:      body.hashtags ?? [],
      published_at:  body.published_at ?? new Date().toISOString(),
    })
    .select('hash_id, title')
    .single()

  if (error) {
    console.error('作品登録エラー:', error)
    return NextResponse.json({ error: 'DB登録エラー' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    hash_id: data.hash_id,
    url:     `https://epochlit.com/sf/${data.hash_id}`,
  }, { status: 201 })
}
