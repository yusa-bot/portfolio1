import { z } from "zod";
import { getAllProjects } from "../../../service/projectServices";
import { ProjectsTypes } from '../../../components/sections/Projects/types';

// Projectのzodスキーマ
export const ProjectSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	technologies: z.array(z.string()),
	url: z.string().optional(),
	image_url: z.string().optional(),
	status: z.enum(['開発中', '完成', '運用中']).optional(),
	featured: z.boolean().optional(),
	created_at: z.string().nullable(),
	updated_at: z.string().nullable(),
});

export async function GET() {
	try {
		const projects: ProjectsTypes[] = await getAllProjects();
		return new Response(JSON.stringify(projects), {
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
