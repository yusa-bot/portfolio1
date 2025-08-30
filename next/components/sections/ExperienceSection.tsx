import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Experience } from '@/api/entities';
import { Badge } from "@/components/ui/badge";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const data = await Experience.list('-start_date');
    setExperiences(data);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '現在';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <section id="experience" className="py-24 bg-slate-50/70 backdrop-blur-xl border-t border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto">

          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">Experience

          </h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) =>
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-12">

                  <motion.div
                  className="absolute left-4 top-2 w-3 h-3 bg-slate-200 rounded-full -translate-x-[5px] border-2 border-slate-50"
                  whileInView={{
                    backgroundColor: ["#e2e8f0", "#3b82f6", "#e2e8f0"],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} />

                  
                  <div className="bg-white/50 border border-slate-200 rounded-lg p-6 hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                      <div>
                        <h3 className="text-slate-800 mb-1 font-light">
                          {exp.company}
                        </h3>
                        {exp.position &&
                      <div className="text-blue-600 mb-2">
                            <span className="text-lg font-medium">{exp.position}</span>
                          </div>
                      }
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-500 mt-2 md:mt-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {formatDate(exp.start_date)}
                          <ArrowRight className="w-4 h-4 mx-2 inline" />
                          {formatDate(exp.end_date)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 font-light">
                      {exp.description}
                    </p>
                    
                    {exp.technologies && exp.technologies.length > 0 &&
                  <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) =>
                    <Badge key={tech} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            {tech}
                          </Badge>
                    )}
                      </div>
                  }
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}