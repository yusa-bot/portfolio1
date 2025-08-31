
import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-lg border bg-white p-4 shadow ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`mb-2 text-lg font-bold ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`mb-2 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`mt-2 text-right ${className}`.trim()} {...props}>
    {children}
  </div>
);
