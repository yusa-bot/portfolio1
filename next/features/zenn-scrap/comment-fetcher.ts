import { load } from 'cheerio';

export async function fetchZennScrapContent(scrapUrl: string, targetKeyword: string = '今期のアジェンダ'): Promise<string> {
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

  if (comments.length === 0) {
    throw new Error('No comments found');
  }

  // ターゲットコメントを検索
  const targetComment = comments.find(comment =>
    comment.bodyHtml?.includes(targetKeyword)
  );

  return targetComment?.bodyHtml || comments[0]?.bodyHtml || '';
}
