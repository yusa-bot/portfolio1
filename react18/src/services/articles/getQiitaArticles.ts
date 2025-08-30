import { QiitaArticle } from '../../types/api';

// Qiita APIから記事を取得する関数
export async function getQiitaArticles(): Promise<{ data: QiitaArticle[] }> {
  try {
    console.log('Fetching Qiita articles for yubot');

    // 実際のQiita APIを呼び出し
    const apiResponse = await fetch('https://qiita.com/api/v2/users/yubot/items?page=1&per_page=5');

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch from Qiita API: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // APIレスポンスを検証
    if (!Array.isArray(data)) {
      throw new Error("Invalid data structure from Qiita API: not an array");
    }

    // APIデータを処理して返す
    const processedData = data.map(article => ({
      id: article.id,
      title: article.title,
      url: article.url,
      created_at: article.created_at,
      updated_at: article.updated_at,
      rendered_body: article.rendered_body || '',
      body: article.body || '',
      likes_count: article.likes_count || 0,
      comments_count: article.comments_count || 0,
      stocks_count: article.stocks_count || 0,
      tags: article.tags || [],
      user: article.user || {},
      private: article.private || false
    }));

    console.log(`Successfully fetched ${processedData.length} articles from Qiita API`);
    return { data: processedData };

  } catch (error) {
    console.error('Error fetching from Qiita API:', error);
    throw error;
  }
}
