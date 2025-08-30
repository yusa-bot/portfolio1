
import React from 'react';
import { ArrowDown, Github, X, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function HeroSection() {
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible">

          <motion.div
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center shadow-lg border border-slate-200"
            variants={letterVariants}>

            <span className="text-5xl font-thin text-slate-700">A</span>
          </motion.div>
          
          <motion.h1 className="text-slate-900 mb-4 font-thin md:text-8xl tracking-tighter"

          variants={containerVariants}
          aria-label={name}>

            {name.split("").map((char, index) =>
            <motion.span key={index} variants={letterVariants} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            )}
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-slate-500 mb-12 tracking-wide"
            variants={containerVariants}>

            {title.split("").map((char, index) =>
            <motion.span key={index} variants={letterVariants} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            )}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 md:right-12 lg:right-16">

        {socialLinks.map((link) =>
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white/80 border border-slate-200/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-lg"
          aria-label={link.name}>

            <link.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors duration-300" />
          </motion.a>
        )}
        <div className="w-px h-16 bg-slate-200 my-2"></div>
        <motion.button
          onClick={scrollToNext}
          whileHover={{ scale: 1.1, y: 2 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white/80 border border-slate-200/80 backdrop-blur-sm animate-bounce transition-all duration-300 shadow-sm hover:shadow-lg">

          <ArrowDown className="w-5 h-5 text-slate-500" />
        </motion.button>
      </motion.div>
    </section>
  );
}
