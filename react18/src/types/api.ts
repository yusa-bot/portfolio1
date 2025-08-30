// APIレスポンスの基本型
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Qiita記事の型
export interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  rendered_body: string;
  body: string;
  likes_count: number;
  comments_count: number;
  stocks_count: number;
  tags: Array<{ name: string }>;
  user: {
    id: string;
    name: string;
    profile_image_url: string;
  };
  private: boolean;
}

// Note記事の型
export interface NoteArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  body: string;
  emoji: string;
  tags: string[];
  user: {
    id: string;
    name: string;
    profile_image_url: string;
  };
}

// Zenn記事の型
export interface ZennArticle {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  body: string;
  emoji: string;
  tags: string[];
  user: {
    id: string;
    name: string;
    profile_image_url: string;
  };
}

// X投稿の型
export interface XPost {
  id: string;
  content: string;
  created_at: string;
  url: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

// TOCアイテムの型
export interface TocItem {
  id: string;
  title: string;
  level: number;
  url?: string;
  slug?: string;
}
