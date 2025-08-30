import { ZennArticle } from '../../types/api';

// Zenn APIから記事を取得する関数
export async function getZennArticles(): Promise<{ data: ZennArticle[] }> {
  try {
    console.log('Fetching Zenn articles for ayusa');

    // 実際のZenn APIを呼び出し
    const apiResponse = await fetch('https://zenn.dev/api/articles?username=ayusa');

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch from Zenn API: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // APIレスポンスを検証
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid data structure from Zenn API");
    }

    // APIデータを処理して返す
    const processedData = data.articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      published_at: article.published_at,
      body: article.body || '',
      emoji: article.emoji || '📝',
      tags: article.tags || [],
      user: {
        id: article.user?.username || 'ayusa',
        name: article.user?.name || 'ayusa',
        profile_image_url: article.user?.profile_image_url || ''
      }
    }));

    console.log(`Successfully fetched ${processedData.length} articles from Zenn API`);
    return { data: processedData };

  } catch (error) {
    console.error('Error fetching from Zenn API:', error);
    throw error;
  }
}
