import { z } from "zod";
import { getAllSkills } from "../../../services/skillsServices";
import { SkillsTypes } from '../../../components/sections/Skills/types';

// Skillsのzodスキーマ
export const SkillsSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.array(z.string()),
  level: z.number(),
  years_experience: z.number(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export async function GET() {
  try {
    const skills: SkillsTypes[] = await getAllSkills();
    return new Response(JSON.stringify(skills), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
