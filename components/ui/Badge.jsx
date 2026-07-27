import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantStyles = {
    primary: 'bg-sky-100 text-sky-800 border-sky-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
  }[variant] || 'bg-sky-100 text-sky-800 border-sky-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
