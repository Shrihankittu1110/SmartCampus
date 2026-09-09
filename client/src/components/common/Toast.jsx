import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, LogOut, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', title, onClose, duration = 3500 }) {
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
  const isLogout = type === 'logout';
  const isInfo = type === 'info';
  const isError = type === 'error';

  let defaultTitle = 'Notice';
  if (isSuccess) defaultTitle = 'Success';
  else if (isLogout) defaultTitle = 'Logged Out';
  else if (isInfo) defaultTitle = 'Information';
  else if (isError) defaultTitle = 'Error';

  const displayTitle = title || defaultTitle;

  return (
    <div className="fixed top-6 right-4 left-4 sm:left-auto sm:right-6 z-[99999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl shadow-blue-950/80 backdrop-blur-xl border border-white/20 transition-all duration-200 max-w-sm w-auto bg-gradient-to-r from-[#19227d]/95 via-[#141b66]/95 to-[#0e1450]/95 text-white ring-1 ring-white/10 animate-in fade-in slide-in-from-top-4">
      {isSuccess && (
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
      {isLogout && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff6b00]/25 to-[#ffa133]/25 text-[#ff8c33] border border-[#ff6b00]/40 flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/30">
          <LogOut className="w-4 h-4" />
        </div>
      )}
      {isInfo && (
        <div className="w-8 h-8 rounded-xl bg-[#ff6b00]/20 text-[#ffa133] border border-[#ff6b00]/40 flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/20">
          <Info className="w-4 h-4" />
        </div>
      )}
      {isError && (
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-500/20">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white tracking-wide">
          {displayTitle}
        </p>
        <p className="text-[12px] text-blue-100/90 truncate font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
