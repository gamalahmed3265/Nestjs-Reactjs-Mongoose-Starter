import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ApplicationPage: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white tracking-tight">
              AuthPortal
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-slate-700 text-sm font-medium text-slate-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Authenticated Session Active
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome to the application.
          </h1>

          {user && (
            <p className="mt-3 text-lg text-slate-300">
              Hello, <span className="font-semibold text-indigo-400">{user.name}</span>! You are securely signed in.
            </p>
          )}

          {user && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-800/80">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Account Name</p>
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

