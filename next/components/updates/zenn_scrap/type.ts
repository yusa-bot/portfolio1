export interface ZennScrap {
  id: string;
  slug: string;
  title: string;
  url: string;
  createdAt: string;
  lastCommentAt: string | null;
  likesCount: number;
  commentsCount: number;
  closed: boolean;
  archived: boolean;
  canOthersPost: boolean;
  author: {
    id: string;
    name: string;
    profileImageUrl: string;
  };
  topics: any[];
  bodyMarkdown: string | null;
}

export interface ZennScrapCardProps {
  scrap: ZennScrap;
}
