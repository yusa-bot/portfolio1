"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Rocket } from 'lucide-react';

export const VisionSection = () => {
  const visionItems = [
  {
    icon: Target,
    title: "事業ビジョン",
    content: "テクノロジーを活用したサービスで、社会課題の解決と新しい価値創造に取り組みたいと考えています。特にSaaSプロダクトの開発・運営を通じて、持続可能なビジネスモデルの構築を目指しています。"
  },
  {
    icon: Lightbulb,
    title: "技術への取り組み",
    content: "AI・機械学習、クラウドコンピューティング、モバイルアプリケーション開発など、最新技術のキャッチアップと実践的な活用を継続しています。技術の進歩とビジネス価値を両立させることを重視しています。"
  },
  {
    icon: Rocket,
    title: "将来の展望",
    content: "個人事業からスタートし、将来的にはチーム組織として事業拡大を図る予定です。オープンソースへの貢献や技術コミュニティとの連携も積極的に行っていきたいと思います。"
  }];

  return (
    <section id="vision" className="py-24 bg-white">
      <div className="px-20 py-2 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-thin text-slate-800 mb-16 text-center tracking-wide">
            Vision & Goals
          </h2>

          <div className="grid gap-12 md:gap-16">
            {visionItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row gap-8 items-start ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}>

                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
