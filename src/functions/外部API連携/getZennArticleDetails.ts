import { base44 } from '@/api/base44Client';

export interface ZennArticleDetails {
  id: string;
  title: string;
  body: string;
  published_at: string;
  path: string;
}

export const getZennArticleDetails = async (params: { slug: string }): Promise<{ data: ZennArticleDetails }> => {
  return base44.functions.getZennArticleDetails(params);
};
