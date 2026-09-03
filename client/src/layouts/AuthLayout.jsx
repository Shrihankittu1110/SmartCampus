import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic ambient background glows */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Back to Home button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 mb-6 flex items-center justify-between px-4 sm:px-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm group backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-indigo-400" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-bold text-slate-500">Anurag University</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-all">
            C
          </div>
          <div className="text-left">
            <span className="text-2xl font-black text-white tracking-tight block">
              CampusFlow
            </span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block -mt-1">
              Smart College Platform
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800 text-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
