import React from 'react';

export type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'secondary' | 'outline' | string;
};

const variantClass: Record<string, string> = {
  secondary: 'bg-green-50 text-green-700 hover:bg-green-100',
  outline: 'bg-transparent border border-slate-200 text-slate-500',
};

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant, ...props }) => { const variantStyle = variant ? variantClass[variant] || '' : '';
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};
