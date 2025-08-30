import { NoteArticle } from '../../types/api';

interface GetNoteArticlesParams {
  username: string;
}

// Note APIから記事を取得する関数
export async function getNoteArticles(params: GetNoteArticlesParams): Promise<{ data: NoteArticle[] }> {
  try {
    console.log(`Fetching Note articles for ${params.username}`);

    // 実際のNote APIを呼び出し
    const apiResponse = await fetch(`https://note.com/api/v2/creators/${params.username}/contents?kind=note&page=1`);

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch from Note API: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // APIレスポンスを検証
    if (!data.data || !Array.isArray(data.data.contents)) {
      throw new Error("Invalid data structure from Note API");
    }

    // APIデータを処理して返す
    const processedData = data.data.contents.map((article: any) => ({
      id: article.id,
      title: article.name,
      url: `https://note.com/${params.username}/n/${article.key}`,
      published_at: article.created_at,
      body: article.description || '',
      emoji: article.emoji || '📝',
      tags: article.tags || [],
      user: {
        id: params.username,
        name: params.username,
        profile_image_url: article.user?.profile_image_url || ''
      }
    }));

    console.log(`Successfully fetched ${processedData.length} articles from Note API`);
    return { data: processedData };

  } catch (error) {
    console.error('Error fetching from Note API:', error);
    throw error;
  }
}
