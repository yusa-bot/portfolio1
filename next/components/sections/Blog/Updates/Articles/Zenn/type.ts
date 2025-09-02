export interface ZennArticle {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  author: {
    id: string;
    name: string;
    profileImageUrl: string;
  };
  emoji: string;
  bodyLettersCount: number;
  toc?: TocItem[]; // TOC情報（任意）
}

export interface ZennArticleCardProps {
  article: ZennArticle;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  base?: number;
}

export interface TocProps {
  article: ZennArticle;
}
