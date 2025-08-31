import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ZennArticleSchema = z.object({
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
});

const ZennResponseSchema = z.object({
  articles: z.array(ZennArticleSchema),
});

export async function GET(request: NextRequest) {
  try {
    const username = 'ayusa';
    const response = await fetch(
      `https://zenn.dev/api/articles?username=${username}&order=latest`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );

    if (!response.ok) {
      throw new Error(`Zenn API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = ZennResponseSchema.parse(data);

    // 最新3件に絞る
    const latestArticles = validatedData.articles.slice(0, 3);

    // データを整形
    const formattedArticles = latestArticles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      url: `https://zenn.dev${article.path}`,
      createdAt: article.published_at,
      updatedAt: article.published_at,
      likesCount: article.liked_count,
      commentsCount: article.comments_count || 0,
      tags: [article.article_type], // ZennのAPIではタグ情報が限定的
      author: {
        id: article.user.username,
        name: article.user.name,
        profileImageUrl: article.user.avatar_small_url,
      },
      emoji: article.emoji,
      bodyLettersCount: article.body_letters_count,
    }));

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching Zenn articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
