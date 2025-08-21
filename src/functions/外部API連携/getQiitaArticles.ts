import { base44 } from '@/api/base44Client';

export interface QiitaArticle {
  id: string;
  title: string;
  body: string;
  rendered_body: string;
  url: string;
  created_at: string;
  updated_at: string;
  tags: Array<{ name: string }>;
  likes_count: number;
  stocks_count: number;
}

export const getQiitaArticles = async (): Promise<{ data: QiitaArticle[] }> => {
  return base44.functions.getQiitaArticles();
};
