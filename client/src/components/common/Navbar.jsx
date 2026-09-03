import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  CheckCircle,
  ExternalLink,
  Shield,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 sm:h-20 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Left: Mobile menu toggle + Institution badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-700 truncate max-w-xs">
            {user?.institutionId?.name || 'CampusFlow Multi-Tenant'}
          </span>
        </div>
      </div>

      {/* Center: Search input pill with keyboard hint */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search students, subjects, job drives, announcements..."
            className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications + User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-x-3 top-18 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {unreadCount} unread announcements & alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.isRead && markAsRead(notif._id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                        !notif.isRead ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-800">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}
