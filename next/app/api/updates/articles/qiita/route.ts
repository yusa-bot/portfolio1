import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const QiitaArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  likes_count: z.number(),
  comments_count: z.number(),
  tags: z.array(z.object({
    name: z.string(),
    versions: z.array(z.string()).optional(),
  })),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    profile_image_url: z.string(),
  }),
});

const QiitaResponseSchema = z.array(QiitaArticleSchema);

export async function GET(request: NextRequest) {
  try {
    const userId = 'yusa_a';
    const response = await fetch(
      `https://qiita.com/api/v2/users/${userId}/items?page=1&per_page=3`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );

    if (!response.ok) {
      throw new Error(`Qiita API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = QiitaResponseSchema.parse(data);

    // データを整形
    const formattedArticles = validatedData.map(article => ({
      id: article.id,
      title: article.title,
      url: article.url,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      likesCount: article.likes_count,
      commentsCount: article.comments_count,
      tags: article.tags.map(tag => tag.name),
      author: {
        id: article.user.id,
        name: article.user.name || article.user.id,
        profileImageUrl: article.user.profile_image_url,
      },
    }));

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching Qiita articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
