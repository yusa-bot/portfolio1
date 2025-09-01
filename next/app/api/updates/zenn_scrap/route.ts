import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { z } from 'zod';

const ZennScrapSchema = z.object({
  id: z.number(),
  post_type: z.string(),
  user_id: z.number(),
  slug: z.string(),
  title: z.string(),
  closed: z.boolean(),
  closed_at: z.string().nullable(),
  archived: z.boolean(),
  liked_count: z.number(),
  can_others_post: z.boolean(),
  comments_count: z.number(),
  created_at: z.string(),
  last_comment_created_at: z.string().nullable(),
  should_noindex: z.boolean(),
  path: z.string(),
  unlisted: z.boolean(),
  topics: z.array(z.any()),
  user: z.object({
    id: z.number(),
    username: z.string(),
    name: z.string(),
    avatar_small_url: z.string(),
  }),
});

const ZennScrapResponseSchema = z.object({
  scraps: z.array(ZennScrapSchema),
  next_page: z.string().nullable(),
});

async function fetchZennScrapContent(scrapUrl: string): Promise<string> {
  try {
    const response = await fetch(scrapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scrap: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);
    const nextDataScript = $('script#__NEXT_DATA__').html();

    if (!nextDataScript) {
      throw new Error('__NEXT_DATA__ not found');
    }

    const nextData = JSON.parse(nextDataScript);
    const comments = nextData.props.pageProps.comments as Array<{ bodyHtml?: string }>;

    if (comments.length > 0) {
      // "今期のアジェンダ"を含むコメントを検索
      const targetComment = comments.find(comment =>
        comment.bodyHtml?.includes('今期のアジェンダ')
      );

      if (targetComment?.bodyHtml) {
        return targetComment.bodyHtml;
      }

      // 見つからない場合は最初のコメントを返す
      return comments[0]?.bodyHtml || '';
    }

    throw new Error('No comments found');
  } catch (error) {
    console.error('Error in fetchZennScrapContent:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const username = 'ayusa';
    const timestamp = Date.now();

    const response = await fetch(
      `https://zenn.dev/api/scraps?username=${username}&order=latest&_t=${timestamp}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Zenn Scrap API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = ZennScrapResponseSchema.parse(data);

    if (!validatedData.scraps.length) {
      return NextResponse.json({ scrap: null });
    }

    // 最新のScrapから「今期のアジェンダ」を含むコメントを取得
    const latestScrap = validatedData.scraps[0];
    const scrapUrl = `https://zenn.dev${latestScrap.path}`;
    const scrapDetails = await fetchZennScrapContent(scrapUrl);

    const formattedScrap = {
      id: latestScrap.id.toString(),
      slug: latestScrap.slug,
      title: latestScrap.title,
      url: scrapUrl,
      createdAt: latestScrap.created_at,
      lastCommentAt: latestScrap.last_comment_created_at,
      likesCount: latestScrap.liked_count,
      commentsCount: latestScrap.comments_count,
      closed: latestScrap.closed,
      archived: latestScrap.archived,
      canOthersPost: latestScrap.can_others_post,
      author: {
        id: latestScrap.user.username,
        name: latestScrap.user.name,
        profileImageUrl: latestScrap.user.avatar_small_url,
      },
      topics: latestScrap.topics,
      bodyMarkdown: scrapDetails,
    };

    return NextResponse.json({ scrap: formattedScrap }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching Zenn scrap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scrap' },
      { status: 500 }
    );
  }
}
