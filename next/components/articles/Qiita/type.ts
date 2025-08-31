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
}

export interface ArticleCardProps {
  article: QiitaArticle;
}
