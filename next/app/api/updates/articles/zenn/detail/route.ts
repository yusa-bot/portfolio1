import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ZennArticleDetailResponseSchema = z.object({
  article: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    published_at: z.string(),
    path: z.string(),
    user: z.object({
      username: z.string(),
      name: z.string(),
      avatar_small_url: z.string(),
    }),
    article_type: z.string(),
    emoji: z.string(),
    liked_count: z.number(),
    body_letters_count: z.number(),
    comments_count: z.number().optional(),
    toc: z.array(z.any()).optional(),
  }),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // Zenn APIから記事詳細を取得
    const response = await fetch(
      `https://zenn.dev/api/articles/${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Bot/1.0)',
        },
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );

    if (!response.ok) {
      throw new Error(`Zenn API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = ZennArticleDetailResponseSchema.parse(data);
    const article = validatedData.article;

    // TOCを抽出（features/ArticlesToc/Zennのヘルパー関数を使用）
    const { flattenZennToc, formatZennArticle } = await import('@/features/ArticlesToc/Zenn');

    let toc = [];
    if (Array.isArray(article.toc) && article.toc.length > 0) {
      toc = flattenZennToc(article.toc);
    }

    const formattedArticle = formatZennArticle(article, toc);
    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error('Error fetching Zenn article detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article detail' },
      { status: 500 }
    );
  }
}
