import { createClient } from '@/utils/supabase/server';
import { ExperiencesTypes } from '@/components/sections/Experience/types';

export async function getAllExperiences(): Promise<ExperiencesTypes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data as ExperiencesTypes[];
}
