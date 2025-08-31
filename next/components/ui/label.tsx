import React from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

export const Label: React.FC<LabelProps> = ({ className = '', ...props }) => (
  <label
    className={`block text-sm font-medium text-slate-700 mb-1 ${className}`.trim()}
    {...props}
  />
);
