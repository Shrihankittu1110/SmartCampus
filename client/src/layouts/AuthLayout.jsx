import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-space-cobalt flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-white selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dynamic ambient background glows */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Back to Home button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 mb-6 flex items-center justify-between px-4 sm:px-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-blue-100 hover:text-white transition-all shadow-sm group backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-orange-400" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-bold text-blue-200/80">Anurag University</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-[#ffa133] p-[2px] shadow-xl shadow-orange-500/35 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#0e1450] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="text-left">
            <span className="text-2xl font-black text-white tracking-tight block">
              CampusFlow
            </span>
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block -mt-1">
              Smart College Platform
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-blue-950/80 rounded-3xl sm:px-10 border border-white/15 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
