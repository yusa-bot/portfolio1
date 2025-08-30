import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skill } from '@/api/entities';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SkillsSection() {
  const [groupedSkills, setGroupedSkills] = useState({});

  useEffect(() => {
    const loadSkills = async () => {
      const data = await Skill.list('-level');
      const grouped = data.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {});
      setGroupedSkills(grouped);
    };
    loadSkills();
  }, []);

  const getLevelColor = (level) => {
    if (level >= 4) return 'from-blue-500 to-indigo-500';
    if (level === 3) return 'from-sky-500 to-cyan-500';
    return 'from-slate-400 to-slate-500';
  };

  const levelDescriptions = ["", "基礎知識", "一部実務経験", "自走可能", "指導可能", "エキスパート"];

  return (
    <section id="skills" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto">

          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Technical Skills

          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedSkills).map(([category, skills]) =>
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">

                <h3 className="text-slate-800 mb-6 pb-3 text-xl font-thin border-b border-slate-200">
                  {category}
                </h3>
                
                <TooltipProvider>
                  <div className="space-y-5">
                    {skills.map((skill) =>
                  <div key={skill.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {skill.name}
                          </span>
                          {skill.years_experience &&
                      <span className="text-xs text-slate-500">
                              {skill.years_experience}年
                            </span>
                      }
                        </div>
                        <Tooltip>
                          <TooltipTrigger className="w-full">
                            <div className="h-2.5 w-full bg-slate-200 rounded-full">
                              <motion.div
                            className={`h-2.5 rounded-full bg-gradient-to-r ${getLevelColor(skill.level)}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level * 20}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }} />

                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>レベル {skill.level}: {levelDescriptions[skill.level]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                  )}
                  </div>
                </TooltipProvider>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}