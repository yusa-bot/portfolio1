import React from 'react';



export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | string;
  size?: 'sm' | 'md' | 'lg' | string;
  className?: string;
  asChild?: boolean;
};


const variantClass: Record<string, string> = {
  primary: 'bg-green-600 text-white hover:bg-green-700',
  secondary: 'bg-green-50 text-green-700 hover:bg-green-100',
  outline: 'bg-transparent border border-slate-200 text-slate-700',
};

const sizeClass: Record<string, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}) => {
  const variantStyle = variantClass[variant] || '';
  const sizeStyle = sizeClass[size] || '';
  if (asChild) {
    // asChildがtrueの場合はchildrenをそのまま返す（ラップしない）
    return React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement, {
          className: `${variantStyle} ${sizeStyle} ${className} ${(children as any).props.className || ''}`.trim(),
          ...props,
        })
      : <>{children}</>;
  }
  return (
    <button
      className={`rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 ${variantStyle} ${sizeStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
