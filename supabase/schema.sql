-- =====================================================
-- epochlit-app Supabase スキーマ
-- Supabase SQL Editor でこのファイルを実行してください
-- =====================================================

-- 作品テーブル
CREATE TABLE IF NOT EXISTS stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hash_id       TEXT NOT NULL UNIQUE,           -- URL用12桁ハッシュ
  title         TEXT NOT NULL,
  genre         TEXT NOT NULL DEFAULT 'sf',
  preview       TEXT NOT NULL,                  -- 冒頭500字（無料公開）
  body          TEXT NOT NULL,                  -- 全文（有料会員のみ）
  image_url     TEXT NOT NULL,                  -- Higgsfield画像URL
  alt_text      TEXT NOT NULL DEFAULT '',       -- 画像ALTテキスト
  quality_score INTEGER NOT NULL DEFAULT 0,     -- 品質スコア（0-100）
  theme         TEXT NOT NULL DEFAULT '',       -- テーマカテゴリ
  hashtags      TEXT[] NOT NULL DEFAULT '{}',   -- ハッシュタグ配列
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 会員テーブル（Stripe Webhook が更新）
CREATE TABLE IF NOT EXISTS subscribers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id  TEXT NOT NULL UNIQUE,
  email               TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active',  -- active / cancelled / past_due / trialing
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS stories_published_at_idx ON stories (published_at DESC);
CREATE INDEX IF NOT EXISTS stories_genre_idx         ON stories (genre);
CREATE INDEX IF NOT EXISTS subscribers_email_idx     ON subscribers (email);

-- Row Level Security（RLS）有効化
ALTER TABLE stories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- stories: 本文 body を含む実テーブルは service role のみが読む
-- anon / authenticated は body を除いた公開ビューだけを読む
DROP POLICY IF EXISTS "anon can read stories_public" ON stories;
REVOKE ALL ON TABLE stories FROM anon, authenticated;

CREATE OR REPLACE VIEW stories_public AS
  SELECT id, hash_id, title, genre, preview, image_url, alt_text, theme, hashtags, published_at
  FROM stories;

GRANT SELECT ON stories_public TO anon, authenticated;

-- subscribers: 外部からは読み書き不可（service role のみ）
CREATE POLICY "service role only" ON subscribers
  USING (false);

-- =====================================================
-- 完了後の確認クエリ
-- SELECT * FROM stories LIMIT 3;
-- SELECT * FROM subscribers LIMIT 3;
-- =====================================================
