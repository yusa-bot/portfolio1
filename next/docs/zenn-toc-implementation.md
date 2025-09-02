# Zenn TOC（目次）取得処理の実装まとめ

## 🎯 概要
Zenn記事の目次（Table of Contents）を取得・表示する機能の実装について説明します。

## 🏗️ アーキテクチャ

### 1. API層 (`/app/api/updates/articles/zenn/detail/route.ts`)
```typescript
// Zenn APIからの記事詳細取得
const response = await fetch(`https://zenn.dev/api/articles/${slug}`);
const data = await response.json();

// レスポンス構造: { article: { ...articleData, toc: [...] } }
const validatedData = ZennArticleDetailResponseSchema.parse(data);
const article = validatedData.article;
```

### 2. TOCフラット化処理
```typescript
const flatten = (nodes: any[], acc: any[] = []) => {
  for (const n of nodes) {
    if (n && typeof n.level === "number" && n.text) {
      if (n.level >= 1 && n.level <= 3) {
        // URLエンコードされたIDをデコード
        const decodedId = n.id ? decodeURIComponent(n.id) : slugify(n.text);
        acc.push({
          id: decodedId,
          text: n.text,
          level: n.level
        });
      }
    }
    // 子要素の再帰処理
    if (Array.isArray(n.children) && n.children.length) {
      flatten(n.children, acc);
    }
  }
  return acc;
};
```

### 3. フロントエンド層

#### ZennArticleCard
```typescript
// TOC取得のuseEffect
useEffect(() => {
  const fetchArticleToc = async () => {
    if (article.toc && article.toc.length > 0) return; // 既にある場合はスキップ

    const slug = article.url.split('/').pop();
    const response = await fetch(`/api/updates/articles/zenn/detail?slug=${slug}`);
    const articleDetail = await response.json();
    setArticleWithToc(articleDetail);
  };

  fetchArticleToc();
}, [article.id, article.toc, article.url]);
```

#### ZennToc コンポーネント
```typescript
// TOCアイテムのクリック処理（アンカーリンク）
const handleTocItemClick = (e: React.MouseEvent, url: string, itemId: string) => {
  e.stopPropagation();
  const fullUrl = `${url}#${itemId}`;
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};
```

## 📊 データフロー

```
1. ZennArticleCard renders
2. useEffect triggers TOC fetch
3. API calls Zenn `/api/articles/${slug}`
4. Response: { article: { toc: [nested structure] } }
5. Flatten nested TOC structure
6. Decode URL-encoded IDs
7. Return formatted TOC array
8. ZennToc component displays TOC
9. User clicks TOC item → opens article with anchor
```

## 🔧 主要な技術的解決策

### 1. **Zodスキーマの修正**
```typescript
const ZennArticleDetailResponseSchema = z.object({
  article: z.object({
    // ... article fields
    toc: z.array(z.any()).optional(),
  }),
});
```

### 2. **階層TOCのフラット化**
- ZennのTOCは `children` 配列を持つ階層構造
- 再帰的に全ての階層を平坦化してUI表示用に変換

### 3. **URLエンコードされたIDの処理**
```typescript
const decodedId = n.id ? decodeURIComponent(n.id) : slugify(n.text);
```

### 4. **レベル別インデント表示**
```typescript
const indentPx = Math.max(0, (item.level || 2) - (item.base || 2)) * 16;
```

## 🎨 UI/UX特徴

- ✅ **常時表示**: 折りたたみ不可（ユーザー要求）
- ✅ **アンカーリンク**: TOCクリックで該当セクションへジャンプ
- ✅ **階層表示**: インデントでセクション階層を視覚化
- ✅ **項目数表示**: `({toc.length}項目)` でTOC項目数を表示
- ✅ **ローディング状態**: TOC取得中の表示
- ✅ **エラーハンドリング**: TOC取得失敗時の graceful degradation

## 📁 関連ファイル

- `/app/api/updates/articles/zenn/detail/route.ts` - API層
- `/components/sections/Blog/Updates/Articles/Zenn/ZennArticleCard.tsx` - カードコンポーネント
- `/components/sections/Blog/Updates/Articles/Zenn/Toc.tsx` - TOC表示コンポーネント
- `/components/sections/Blog/Updates/Articles/Zenn/type.ts` - 型定義

## 🧪 テスト方法

```bash
# API動作確認
curl -s "http://localhost:3000/api/updates/articles/zenn/detail?slug=c48539d2f35ecc" | jq '.toc'

# TOC項目数確認
curl -s "http://localhost:3000/api/updates/articles/zenn/detail?slug=c48539d2f35ecc" | jq '{ title: .title, tocLength: (.toc | length) }'
```

## 🔍 デバッグのポイント

1. **APIレスポンス構造の確認**
2. **Zodバリデーションエラーの詳細確認**
3. **TOCフラット化処理のログ出力**
4. **フロントエンドでの状態管理の追跡**

この実装により、Qiitaと同様にZenn記事でもTOC機能が利用可能になりました。
