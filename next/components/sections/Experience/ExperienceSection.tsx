
"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ExperiencesTypes } from './types';

export const ExperienceSection = () => {

  const [experiences, setExperiences] = useState<ExperiencesTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/experience');
        if (!res.ok) throw new Error('データ取得に失敗しました');
        const data = await res.json();
        setExperiences(data);
      } catch (err: any) {
        setError(err.message || '不明なエラー');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return '現在';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <section id="experience" className="py-24 bg-slate-50/70 backdrop-blur-xl border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Experience</h2>

          {loading && <div className="text-center text-slate-500 py-8">読み込み中...</div>}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}

          {!loading && !error && (
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200"></div>
              <div className="space-y-12">
                {experiences.map((exp) =>
                  <div key={exp.id} className="relative pl-12">
                    <div className="absolute left-4 top-2 w-3 h-3 bg-slate-200 rounded-full -translate-x-[5px] border-2 border-slate-50" />
                    <div className="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <span className="text-lg font-semibold text-slate-800">{exp.company}</span>
                          {exp.current && (
                            <span className="text-xs text-white bg-blue-500 rounded px-2 py-0.5 ml-2">在籍中</span>
                          )}
                        </div>
                        <div className="flex items-center text-slate-500 text-sm gap-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(exp.start_date)}〜{exp.end_date ? formatDate(exp.end_date) : '現在'}</span>
                        </div>
                      </div>
                      <div className="mb-2 text-slate-700 font-medium text-base">{exp.position}</div>
                      {exp.description && (
                        <div className="mb-3 text-slate-600 text-sm whitespace-pre-line">{exp.description}</div>
                      )}
                      {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-700 bg-blue-50">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

