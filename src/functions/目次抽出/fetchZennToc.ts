import { base44 } from '@/api/base44Client';

export interface ZennTocItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
}

export interface ZennTocResponse {
  data: {
    items: ZennTocItem[];
  };
}

export const fetchZennToc = async (params: { username: string; count: number }): Promise<ZennTocResponse> => {
  return base44.functions.fetchZennToc(params);
};
