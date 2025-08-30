import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { supabase } from "~/lib/supabase.server";

// Zodスキーマの定義
const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image_url: z.string().optional(),
  url: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['運用中', '完成', '開発中']).optional(),
  technologies: z.array(z.string()).optional(),
  created_date: z.string().optional(),
});

// プロジェクト配列のスキーマ
const ProjectsSchema = z.array(ProjectSchema);

// 型の定義（Zodスキーマから自動生成）
export type Project = z.infer<typeof ProjectSchema>;

// Loader関数（Remixのデータ取得）
export async function loader() {
  try {
    // Supabaseからプロジェクトデータを取得
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Supabaseからデータ取得エラー:', error);
      throw new Response("データベースエラー", { status: 500 });
    }

    // Zodスキーマでバリデーション
    const validatedProjects = ProjectsSchema.parse(projects || []);

    return json({
      projects: validatedProjects,
      success: true
    }, {
      headers: {
        "Cache-Control": "private, max-age=300" // 5分間キャッシュ
      }
    });

  } catch (error) {
    console.error('プロジェクトデータの処理に失敗しました:', error);

    // エラーが発生した場合は空の配列を返す
    return json({
      projects: [],
      success: false,
      error: "データの取得に失敗しました"
    }, { status: 500 });
  }
}

export default function ProjectsSection() {
  const { projects, success, error } = useLoaderData<typeof loader>() as {
    projects: Project[];
    success: boolean;
    error?: string;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // エラー状態の表示
  if (!success) {
    return (
      <section id="projects" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-thin text-slate-800 mb-16 tracking-wide">
              Projects
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 text-lg">{error || "データの取得に失敗しました"}</p>
              <p className="text-red-500 text-sm mt-2">しばらく時間をおいて再度お試しください</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // プロジェクトがない場合の表示
  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-thin text-slate-800 mb-16 tracking-wide">
              Projects
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-600 text-lg">プロジェクトが見つかりませんでした</p>
              <p className="text-slate-500 text-sm mt-2">新しいプロジェクトが追加されるまでお待ちください</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-thin text-slate-800 mb-16 text-center tracking-wide">
            Projects
          </h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative h-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-slate-300 shadow-sm hover:shadow-xl">
                  {project.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-light text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200/50">
                          注目
                        </Badge>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {project.status && (
                        <Badge
                          variant="secondary"
                          className={`text-xs capitalize ${
                            project.status === '運用中' ? 'bg-green-100 text-green-800 border-green-200/50' :
                            project.status === '完成' ? 'bg-blue-100 text-blue-800 border-blue-200/50' :
                            'bg-orange-100 text-orange-800 border-orange-200/50'
                          }`}
                        >
                          {project.status}
                        </Badge>
                      )}
                    </div>

                    {project.url && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-300"
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
