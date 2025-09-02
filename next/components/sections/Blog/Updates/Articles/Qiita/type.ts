export interface QiitaArticle {
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
  body?: string; // 目次生成用のマークダウン本文
}

export interface ArticleCardProps {
  article: QiitaArticle;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  base?: number;
}

export interface TocProps {
  article: QiitaArticle;
}
