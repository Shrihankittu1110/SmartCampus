import React from 'react';

const themeMap = {
  indigo: {
    topLine: 'from-indigo-500 via-indigo-400 to-indigo-600',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-200 shadow-md',
    accentText: 'text-indigo-600',
    glow: 'hover:shadow-indigo-500/10',
  },
  emerald: {
    topLine: 'from-emerald-500 via-teal-400 to-emerald-600',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200 shadow-md',
    accentText: 'text-emerald-600',
    glow: 'hover:shadow-emerald-500/10',
  },
  teal: {
    topLine: 'from-teal-500 via-cyan-400 to-teal-600',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-teal-200 shadow-md',
    accentText: 'text-teal-600',
    glow: 'hover:shadow-teal-500/10',
  },
  purple: {
    topLine: 'from-purple-500 via-fuchsia-400 to-violet-600',
    iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-200 shadow-md',
    accentText: 'text-purple-600',
    glow: 'hover:shadow-purple-500/10',
  },
  amber: {
    topLine: 'from-amber-500 via-orange-400 to-amber-600',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-200 shadow-md',
    accentText: 'text-amber-600',
    glow: 'hover:shadow-amber-500/10',
  },
  rose: {
    topLine: 'from-rose-500 via-pink-400 to-rose-600',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-200 shadow-md',
    accentText: 'text-rose-600',
    glow: 'hover:shadow-rose-500/10',
  },
  blue: {
    topLine: 'from-sky-500 via-blue-400 to-indigo-500',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-200 shadow-md',
    accentText: 'text-sky-600',
    glow: 'hover:shadow-blue-500/10',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'indigo',
  trend,
  className = '',
}) {
  const theme = themeMap[variant] || themeMap.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${theme.glow} ${className}`}
    >
      {/* Subtle top gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.topLine}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              {value}
            </span>
            {trend && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {description && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}
