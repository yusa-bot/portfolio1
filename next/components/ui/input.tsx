import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`block w-full rounded border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${className}`.trim()}
    {...props}
  />
);
