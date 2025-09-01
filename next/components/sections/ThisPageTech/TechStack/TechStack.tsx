import React from 'react';
import { Globe, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TechStack: React.FC = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: Globe,
      technologies: [
        { name: 'Next.js 14', description: 'App Router + TypeScript' },
        { name: 'Tailwind CSS', description: 'スタイリング + Framer Motion' }
      ]
    },
    {
      category: 'Backend',
      icon: Cpu,
      technologies: [
        { name: 'API Routes', description: 'サーバーレス関数 + Zod検証' },
        { name: 'Supabase', description: 'PostgreSQL BaaS' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {techStack.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.category} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {category.category}
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.technologies.map((tech, techIdx) => (
                  <div key={techIdx} className="border-l-3 border-slate-200 pl-3">
                    <span className="font-medium text-slate-800">{tech.name}</span>
                    <p className="text-sm text-slate-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
