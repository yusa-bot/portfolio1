
import { z } from "zod";
import { getAllExperiences } from "../../../service/experienceServices";
import { ExperiencesTypes } from '../../../components/sections/Experience/types';

// Experienceのzodスキーマ
export const ExperienceSchema = z.object({
	company: z.string(),
	current: z.boolean().nullable(),
	description: z.string().nullable(),
	end_date: z.string().nullable(),
	id: z.string(),
	position: z.string().nullable(),
	start_date: z.string(),
	technologies: z.array(z.string()).nullable(),
	created_at: z.string().nullable(),
	updated_at: z.string().nullable(),
});

export async function GET() {
	try {
		const experiences: ExperiencesTypes[] = await getAllExperiences();
		return new Response(JSON.stringify(experiences), {
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
