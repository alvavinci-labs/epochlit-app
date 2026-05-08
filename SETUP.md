# epochlit-app セットアップガイド

## 1. パッケージインストール

Node.js は `20.9.0` 以上が必要です。ローカルでは `.nvmrc` のバージョンを使ってください。

```bash
cd /Users/sora/develop/epochlit-app
nvm use
```

```bash
cd /Users/sora/develop/epochlit-app
npm install
```

## 2. Supabase プロジェクト作成

1. https://supabase.com でプロジェクトを新規作成（リージョン: ap-northeast-1 / 東京）
2. **SQL Editor** で `supabase/schema.sql` を実行
3. **Project Settings → API** から以下をコピー:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` キー → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Stripe 設定

1. https://dashboard.stripe.com で月額サブスクリプション商品を作成
2. 価格IDをメモ（`price_xxx`）→ `.env.local` の `STRIPE_PRICE_ID` に設定
3. Webhook エンドポイント登録: `https://epochlit.com/api/stripe/webhook`
   - イベント: `customer.subscription.created` / `updated` / `deleted`
   - Webhook シークレット → `STRIPE_WEBHOOK_SECRET`

## 4. 環境変数設定

```bash
cp .env.local.example .env.local
# .env.local を編集して全変数を埋める

# SESSION_SECRET 生成
openssl rand -base64 32

# API_SECRET_KEY 生成（Quill パイプライン用）
openssl rand -hex 32
```

## 5. ローカル起動確認

```bash
npm run dev
# http://localhost:3000 で確認
```

## 6. Vercel デプロイ

1. Vercel にリポジトリを連携（`alvavinc-labs/epochlit-app`）
2. Vercel ダッシュボードで環境変数を設定（`.env.local` の内容と同じ）
3. カスタムドメイン `epochlit.com` を設定

## 7. Quill パイプラインとの連携

`epoch-daily-story.md` の STEP 8 で以下を呼び出す:

```
POST https://epochlit.com/api/stories
Authorization: Bearer <API_SECRET_KEY>
Content-Type: application/json

{
  "title": "...",
  "genre": "sf",
  "preview": "冒頭500字",
  "body": "全文2000〜3000字",
  "image_url": "Higgsfield rawUrl",
  "alt_text": "タイトル — Epoch SF短編小説の挿絵",
  "quality_score": 85,
  "theme": "AI・機械知性",
  "hashtags": ["#SF小説", "#短編小説", "#Epoch"],
  "published_at": "2026-05-06T11:00:00.000Z"
}

→ レスポンス: { "success": true, "hash_id": "abc123def456", "url": "https://epochlit.com/sf/abc123def456" }
```

## 8. 法的ページの記入（必須・サービス公開前）

- `/src/app/privacy/page.tsx` — プライバシーポリシー
- `/src/app/terms/page.tsx` — 利用規約
- `/src/app/legal/page.tsx` — 特定商取引法表記
