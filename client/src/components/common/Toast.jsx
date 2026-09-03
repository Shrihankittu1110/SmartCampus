import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
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
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-lg animate-slide-up">
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
      )}
      <span className="text-sm font-medium text-slate-800">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
