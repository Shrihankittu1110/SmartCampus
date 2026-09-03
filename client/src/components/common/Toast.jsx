import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-6 right-4 left-4 sm:left-auto sm:right-6 z-[99999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-200 max-w-sm w-auto bg-slate-900/95 border-slate-800 text-white">
      {isSuccess ? (
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-500/20">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white">
          {isSuccess ? 'Success' : 'Notice'}
        </p>
        <p className="text-[11px] text-slate-300 truncate">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
