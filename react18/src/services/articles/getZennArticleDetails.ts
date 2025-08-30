import { ZennArticle } from '../../types/api';

interface GetZennArticleDetailsParams {
  slug: string;
}

// Zenn APIから記事詳細を取得する関数
export async function getZennArticleDetails(params: GetZennArticleDetailsParams): Promise<{ data: ZennArticle }> {
  try {
    console.log(`Fetching Zenn article details for slug: ${params.slug}`);

    // 実際のZenn APIを呼び出し
    const apiResponse = await fetch(`https://zenn.dev/api/articles/${params.slug}`);

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch from Zenn Article API: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // APIデータを処理して返す
    const processedData = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      published_at: data.published_at,
      body: data.body || '',
      emoji: data.emoji || '📝',
      tags: data.tags || [],
      user: {
        id: data.user?.username || 'ayusa',
        name: data.user?.name || 'ayusa',
        profile_image_url: data.user?.profile_image_url || ''
      }
    };

    console.log('Successfully fetched article details from Zenn API');
    return { data: processedData };

  } catch (error) {
    console.error('Error fetching from Zenn Article API:', error);
    throw error;
  }
}
