"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkillsTypes } from './types';

export const SkillsSection = () => {
  const [groupedSkills, setGroupedSkills] = useState<Record<string, SkillsTypes[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('スキルデータの取得に失敗しました');
        }
        const data: SkillsTypes[] = await response.json();

        const grouped = data.reduce((acc: Record<string, SkillsTypes[]>, skill) => {
          // categoryが配列の場合、最初の要素を使用
          const category = Array.isArray(skill.category) ? skill.category[0] : skill.category;
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill);
          return acc;
        }, {});

        setGroupedSkills(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'from-blue-500 to-indigo-500';
    if (level === 3) return 'from-sky-500 to-cyan-500';
    return 'from-slate-400 to-slate-500';
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 4) return 'bg-blue-500';
    if (level === 3) return 'bg-sky-500';
    return 'bg-slate-400';
  };

  const levelDescriptions = ["", "基礎知識", "一部実務経験", "自走可能", "指導可能", "エキスパート"];

  if (loading) {
    return (
      <section id="skills" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Technical Skills</h2>
            <div className="animate-pulse">データを読み込み中...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Technical Skills</h2>
            <div className="text-red-500">エラー: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto">
          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Technical Skills</h2>

          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
              >
                <h3 className="text-2xl font-semibold text-slate-800 mb-6 capitalize">
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-slate-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:bg-white border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                            {skill.name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                  level <= skill.level
                                    ? getLevelBadgeColor(skill.level)
                                    : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-slate-600 mb-2">
                          レベル {skill.level} • {skill.years_experience}年の経験
                        </div>

                        <div className="text-xs text-slate-500 mb-2">
                          {levelDescriptions[skill.level]}
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${getLevelColor(skill.level)}`}
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">スキルレベルについて</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                {levelDescriptions.slice(1).map((desc, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= index + 1 ? 'bg-blue-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 text-center">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
