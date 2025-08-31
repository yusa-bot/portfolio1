import { createClient } from '@/utils/supabase/server';
import { ProjectsTypes } from '@/components/sections/Projects/types';

export async function getAllProjects(): Promise<ProjectsTypes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as ProjectsTypes[];
}
