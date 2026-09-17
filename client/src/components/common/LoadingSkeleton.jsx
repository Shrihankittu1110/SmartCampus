import React from 'react';

export default function LoadingSkeleton({
  rows = 3,
  message = 'Loading',
  className = '',
}) {
  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${className}`}>
      {/* Loading Name & Animated Dots */}
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/70 text-xs font-semibold text-slate-600 shadow-2xs">
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffa133] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#19227d] animate-bounce" />
        </div>
        <span>
          {message}
          <span className="inline-block animate-pulse ml-0.5 tracking-widest font-bold text-orange-600">...</span>
        </span>
      </div>

      {/* Structured Card Frames for the Content */}
      <div className="space-y-3.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3 animate-pulse"
          >
            {/* Header frame: code badge + title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                <div className="h-4 w-48 bg-slate-200/70 rounded-md" />
              </div>
              <div className="h-5 w-20 bg-slate-100 rounded-full" />
            </div>

            {/* Description lines frame */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 bg-slate-100 rounded w-5/6" />
              <div className="h-3.5 bg-slate-100 rounded w-2/3" />
            </div>

            {/* Footer meta row frame */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 w-36 bg-slate-100 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
