# Remix App

このプロジェクトは、[Remix](https://remix.run/)を使用して構築されたフルスタックWebアプリケーションです。

## 開発の開始

### 前提条件

- Node.js 18.0.0以上
- npm または yarn
- Supabaseアカウント

### インストール

```bash
npm install
```

### 環境変数の設定

1. `.env`ファイルを作成
2. 以下の環境変数を設定：

```bash
# Supabase設定
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabaseの設定

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. 以下のSQLでテーブルを作成：

```sql
-- プロジェクトテーブルの作成
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('運用中', '完成', '開発中')),
  technologies TEXT[],
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- サンプルデータの挿入
INSERT INTO projects (title, description, image_url, url, featured, status, technologies) VALUES
('MCPサーバー組み込みアプリ', 'AIワークフローを踏まえた実装による、次世代のサーバーアプリケーション。', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop', 'https://example.com/project1', true, '開発中', ARRAY['TypeScript', 'Node.js', 'AI/ML', 'Docker']),
('AIワークフロー管理システム', '機械学習パイプラインの自動化と最適化を行うシステム。', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop', 'https://example.com/project2', false, '運用中', ARRAY['Python', 'TensorFlow', 'React', 'PostgreSQL']);
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
```

### 本番環境での起動

```bash
npm start
```

## プロジェクト構造

```
remix/
├── app/
│   ├── component/
│   │   └── section/
│   │       └── ProjectsSection.tsx  # Supabase連携のプロジェクト一覧
│   ├── components/
│   │   └── ui/                      # UIコンポーネント
│   ├── lib/
│   │   └── supabase.server.ts       # Supabaseサーバーサイドクライアント
│   ├── routes/
│   │   └── _index.tsx               # ホームページ
│   ├── root.tsx                     # ルートレイアウト
│   └── tailwind.css                 # スタイル
├── package.json
├── remix.config.js                   # Remix設定
├── tailwind.config.js                # Tailwind CSS設定
├── postcss.config.js                 # PostCSS設定
└── tsconfig.json                     # TypeScript設定
```

## 技術スタック

- **フレームワーク**: Remix
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **バリデーション**: Zod
- **アニメーション**: Framer Motion
- **ビルドツール**: Vite (Remix v2)

## 主要機能

- **プロジェクト一覧表示**: Supabaseからデータを取得して表示
- **データバリデーション**: Zodによる型安全なデータ処理
- **エラーハンドリング**: 適切なエラー表示とフォールバック
- **レスポンシブデザイン**: モバイルファーストのレイアウト
- **アニメーション**: スムーズなUIアニメーション

## 学習リソース

- [Remix公式ドキュメント](https://remix.run/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Zod公式ドキュメント](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## ライセンス

MIT
