import React from 'react';

const variantStyles = {
  indigo: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80 dot-bg-indigo-500',
  emerald: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dot-bg-emerald-500',
  teal: 'bg-teal-50/90 text-teal-700 border-teal-200/80 dot-bg-teal-500',
  amber: 'bg-amber-50/90 text-amber-700 border-amber-200/80 dot-bg-amber-500',
  rose: 'bg-rose-50/90 text-rose-700 border-rose-200/80 dot-bg-rose-500',
  blue: 'bg-sky-50/90 text-sky-700 border-sky-200/80 dot-bg-sky-500',
  purple: 'bg-purple-50/90 text-purple-700 border-purple-200/80 dot-bg-purple-500',
  slate: 'bg-slate-100 text-slate-700 border-slate-200 dot-bg-slate-400',
};

const dotColors = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-sky-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-400',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px] gap-1.5',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

export default function Badge({
  children,
  variant = 'indigo',
  size = 'md',
  showDot = true,
  className = '',
}) {
  const vStyle = variantStyles[variant] || variantStyles.indigo;
  const dColor = dotColors[variant] || dotColors.indigo;
  const sStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs tracking-wide ${vStyle} ${sStyle} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dColor} flex-shrink-0 animate-pulse`} />
      )}
      {children}
    </span>
  );
}
