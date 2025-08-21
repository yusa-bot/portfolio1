import { base44 } from '@/api/base44Client';

export interface ZennArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  published_at: string;
  path: string;
  comments_count: number;
}

export const getZennArticles = async (): Promise<{ data: ZennArticle[] }> => {
  return base44.functions.getZennArticles();
};
