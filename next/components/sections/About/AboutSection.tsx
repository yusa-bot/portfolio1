"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center">

          <h2 className="text-slate-800 mb-16 font-thin md:text-6xl tracking-wide">About

          </h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-6">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                技術で社会課題を解決するため日々思考すると共に、技術の向上・社会課題の調査に努めています。
              </p>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                自分ができること・したいことを常に考え挑戦し続けます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-light text-slate-800 mb-6">Current Focus</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center text-base md:text-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  MCPサーバー組み込みアプリの開発
                </li>
                <li className="flex items-center text-base md:text-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  AIワークフローを踏まえた実装
                </li>
                <li className="flex items-center text-base md:text-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  プロダクト戦略・事業開発
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}
