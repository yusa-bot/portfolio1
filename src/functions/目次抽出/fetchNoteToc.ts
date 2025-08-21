import { base44 } from '@/api/base44Client';

export interface NoteTocItem {
  title: string;
  level: number;
  id: string;
}

export interface NoteTocResponse {
  data: {
    title: string;
    toc: NoteTocItem[];
    error?: string;
  };
}

export const fetchNoteToc = async (params: { url: string }): Promise<NoteTocResponse> => {
  return base44.functions.fetchNoteToc(params);
};
