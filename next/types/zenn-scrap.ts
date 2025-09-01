// Zenn Scrap関連の型定義

export interface StructuredElement {
  type: string;
  content: string;
  level?: number;
}

export interface ProcessedContent {
  raw: string;
  cleaned: string;
  structured: StructuredElement[];
  type: string;
}

export interface ZennScrapAuthor {
  id: string;
  name: string;
  profileImageUrl: string;
}

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
  author: ZennScrapAuthor;
  topics: any[];
  bodyMarkdown: string | null;
  bodyHtml?: string;
  content?: ProcessedContent;
}

// HTML処理関連の型定義（ProcessedHtmlをProcessedContentに統合）
export interface ProcessedHtml {
  raw: string;
  cleaned: string;
  structured: StructuredElement[];
}
