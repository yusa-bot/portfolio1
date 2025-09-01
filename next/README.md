# Portfolio Next.js App

Next.js（App Router構成）を使用したポートフォリオアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: shadcn/ui + Radix UI
- **アニメーション**: Framer Motion
- **データベース**: Supabase
- **フォーム**: React Hook Form + Zod

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

## ディレクトリ構成

```
src/
├── app/                 # ページ・APIルート
├── components/          # UIコンポーネント
├── lib/                # サービス層（ビジネスロジック）
├── utils/              # ユーティリティ
├── types/              # 型定義
└── public/             # 静的ファイル
```

## 環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

