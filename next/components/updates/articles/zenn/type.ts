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
}

export interface ZennArticleCardProps {
  article: ZennArticle;
}
