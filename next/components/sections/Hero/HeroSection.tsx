"use client";

import React from 'react';
import { ArrowDown, Github, X, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('experience');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/yusa-bot' },
    { name: 'X', icon: X, url: 'https://twitter.com/rowuprowup' },
    { name: 'Mail', icon: Mail, url: 'mailto:yusaaihara3@gmail.com' }
  ];

  const name = "Yusa Aihara";
  const title = "Software Engineer";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -40, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />

      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-700">Y</span>
            </div>
          </div>
        </motion.div>

        {/* Name with animated letters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-4"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-gray-900">
            {name.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl md:text-2xl font-light text-gray-600 tracking-wide">
            {title}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            フルスタック開発者として、モダンなWebアプリケーションの構築に情熱を注いでいます。
            ユーザー体験を重視し、美しく機能的なソリューションを提供します。
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12"
        >
          <div className="flex justify-center space-x-6">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                    <Icon size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-16"
        >
          <Button
            onClick={scrollToNext}
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View My Work
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
