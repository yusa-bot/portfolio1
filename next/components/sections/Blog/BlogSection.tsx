"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BlogSection = () => {
  return (
    <section id="blog" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">
            Tech Blog & Updates
          </h2>

          <p className="text-lg text-slate-600 font-light mb-12">
            技術記事やアップデートは専用ページでご覧いただけます
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="text-slate-600 hover:text-green-600 border-slate-200"
              onClick={() => window.open('https://qiita.com/yusa_a', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Qiita でもっと見る
            </Button>
            <Button
              variant="outline"
              className="text-slate-600 hover:text-blue-600 border-slate-200"
              onClick={() => window.open('https://zenn.dev/ayusa', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Zenn でもっと見る
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
