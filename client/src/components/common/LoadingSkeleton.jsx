import React from 'react';

export default function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-200/70 rounded-lg w-full" />
      ))}
    </div>
  );
}
