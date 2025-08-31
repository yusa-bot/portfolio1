import React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`block w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${className}`.trim()}
    {...props}
  />
);
