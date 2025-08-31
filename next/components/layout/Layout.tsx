"use client";

// footer & sidebar

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Home, FileText, Code } from 'lucide-react';
import { FooterSection } from '../sections/Footer';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

interface NavLink {
  name: string;
  page: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Top', page: 'Top', icon: Home },
    { name: 'Me', page: 'Me', icon: User },
    { name: 'Updates', page: 'Updates', icon: FileText },
    { name: '使用技術', page: 'TechStack', icon: Code },
    { name: 'Contact', page: 'Contact', icon: Mail },
  ];

  return (
    <div className="bg-white text-slate-800 font-sans antialiased selection:bg-blue-500/20">
      <div
        className="pointer-events-none fixed inset-0 z-50 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.08), transparent 80%)`
        }}
      ></div>

      <div className="flex min-h-screen">
        <div className="flex-1 mr-40">
          <main className="relative z-10">{children}</main>
          <FooterSection />
        </div>

        <aside className="fixed right-0 top-0 h-full w-40 bg-white/80 backdrop-blur-xl border-l border-slate-200/80 p-6 flex flex-col z-40">
          <nav className="mt-8 flex flex-col flex-grow">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name} className="relative">
                  <Link
                    href={`/${link.page === 'Top' ? '' : link.page.toLowerCase()}`}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group ${
                      currentPageName === link.page
                        ? 'text-blue-600'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <link.icon className={`w-5 h-5 mr-4 flex-shrink-0 transition-colors duration-200 ${currentPageName === link.page ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className="truncate font-medium text-sm">{link.name}</span>
                  </Link>
                  {currentPageName === link.page && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute right-[-24px] top-0 h-full w-1 bg-blue-500 rounded-l-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
