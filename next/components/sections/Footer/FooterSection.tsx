import React from 'react';
import { Github, X, Mail, ExternalLink } from 'lucide-react';

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/yusa-bot' },
    { name: 'X', icon: X, url: 'https://twitter.com/rowuprowup' },
    { name: 'Mail', icon: Mail, url: 'mailto:yusaaihara3@gmail.com' }
  ];

  const externalLinks = [
    { name: 'Qiita', url: 'https://qiita.com/yusa_a' },
    { name: 'Zenn', url: 'https://zenn.dev/ayusa' }
  ];

  return (
    <footer className="bg-slate-50/50 text-slate-600 border-t border-slate-200/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            <div className="lg:col-span-1">
              <h4 className="text-slate-900 mb-4 text-sm font-light uppercase tracking-wider">SOCIAL</h4>
              <div className="space-y-3">
                {socialLinks.map((link) =>
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-slate-600 hover:text-blue-500 transition-colors duration-200 group">

                    <link.icon className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    {link.name}
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h4 className="text-slate-900 mb-4 text-sm font-light uppercase tracking-wider">TECH BLOG</h4>
              <div className="space-y-3">
                {externalLinks.map((link) =>
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-slate-600 hover:text-blue-500 transition-colors duration-200 group">

                    <ExternalLink className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    {link.name}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
