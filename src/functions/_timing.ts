import { base44 } from '@/api/base44Client';

export interface TimingData {
  operation: string;
  duration: number;
  metadata?: Record<string, any>;
}

export const _timing = async (data: TimingData): Promise<void> => {
  return base44.functions._timing(data);
};
