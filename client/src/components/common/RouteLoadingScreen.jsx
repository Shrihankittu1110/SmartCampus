import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function RouteLoadingScreen({ message = 'Loading workspace...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />

        {/* Squircle Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-[#ffa133] p-[2px] shadow-xl shadow-orange-500/30 relative">
          <div className="w-full h-full bg-[#0e1450] rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-orange-400 animate-bounce" />
          </div>
        </div>

        {/* Spinner Ring */}
        <div className="absolute -inset-2 border-2 border-transparent border-t-orange-500 rounded-2xl animate-spin pointer-events-none" />
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">CampusFlow</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
