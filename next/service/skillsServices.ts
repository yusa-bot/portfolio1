import { createClient } from '@/utils/supabase/server';
import { SkillsTypes } from '@/components/sections/Skills/types';

export async function getAllSkills(): Promise<SkillsTypes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('level', { ascending: false });

  if (error) throw new Error(error.message);
  return data as SkillsTypes[];
}
