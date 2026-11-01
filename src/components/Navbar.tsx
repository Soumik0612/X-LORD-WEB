import React, { useState, useRef, useEffect } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Bot,
  Bell,
  Sun,
  Moon,
  Coins,
  ChevronDown,
  Shield,
  User as UserIcon,
  LogOut,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    switchUser,
    logout,
    openAuthModal,
    openAddFundsModal,
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: AppTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-bots', label: 'My Bots' },
    { id: 'templates', label: 'Templates' },
    { id: 'wallet', label: 'Wallet & Payments' },
    { id: 'recover', label: 'Doctor & Recover' },
    { id: 'refer', label: 'Refer & Earn' },
  ];

  if (currentUser?.role === 'super_admin' || currentUser?.role === 'sub_admin') {
    navLinks.push({ id: 'admin', label: 'Admin Portal' });
  }

  return (
    <header className="sticky top-0 z-40 bg-[#080A10]/90 backdrop-blur-md border-b border-[#1A2234]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3989E8] via-[#2563EB] to-[#60A5FA] p-0.5 shadow-lg shadow-[#3989E8]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#3989E8] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
                X LORD <span className="text-[#3989E8]">BOTS</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                HOSTING & MGMT
              </span>
            </div>
          </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#151D2E] text-[#3989E8] border border-[#3989E8]/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#101522]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Coins, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Coin Balance Badge */}
          {currentUser && (
            <div className="flex items-center bg-[#101420] border border-[#1E2536] rounded-xl px-2.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 mr-2">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold font-mono-numbers text-white">
                  {currentUser.coins} <span className="text-slate-400 font-normal text-[11px]">XL</span>
                </span>
              </div>
              <button
                onClick={() => openAddFundsModal(true)}
                title="Top-up Coins"
                className="p-1 rounded-lg bg-[#3989E8]/20 text-[#3989E8] hover:bg-[#3989E8] hover:text-white transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-xl bg-[#101420] border border-[#1E2536] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#10131B] border border-[#1E2536] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-[#1E2536] flex items-center justify-between bg-[#0A0D15]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <span className="text-[10px] bg-[#3989E8]/20 text-[#3989E8] px-1.5 py-0.5 rounded-full font-bold">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#3989E8] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#1A2234]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 transition-colors cursor-pointer hover:bg-[#151A26] ${
                          !n.read ? 'bg-[#121724]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : n.type === 'alert' || n.type === 'warning' ? (
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Info className="w-4 h-4 text-[#3989E8]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white leading-tight truncate">{n.title}</p>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.date}</span>
                          </div>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3989E8] shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#101420] border border-[#1E2536] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#3989E8]" />}
          </button>

          {/* User Profile / Auth Switcher */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl bg-[#101420] border border-[#1E2536] hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#3989E8]/20 border border-[#3989E8]/40 flex items-center justify-center text-xs font-bold text-[#3989E8] overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    {currentUser.role === 'super_admin' && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 py-0.2 rounded font-bold uppercase">
                        Super Admin
                      </span>
                    )}
                    {currentUser.role === 'sub_admin' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 py-0.2 rounded font-bold uppercase">
                        Sub Admin
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#10131B] border border-[#1E2536] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] mb-2">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-[#1E2536]">
                      <span className="text-slate-400">Available Balance:</span>
                      <span className="font-bold text-white font-mono-numbers">{currentUser.coins} Coins</span>
                    </div>
                  </div>

                  {/* Role demo quick switch */}
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Active Persona:
                  </div>
                  <div className="space-y-1 mb-2">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#3989E8]/20 text-[#3989E8] font-bold'
                            : 'text-slate-300 hover:bg-[#171D2A]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400">({u.role})</span>
                        </div>
                        {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#1E2536] pt-1">
                    {(currentUser.role === 'super_admin' || currentUser.role === 'sub_admin') && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-[#1A2234] rounded-lg transition-colors text-left"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#3989E8]" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('wallet');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-[#1A2234] rounded-lg transition-colors text-left"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Wallet & Deposits</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#3989E8] hover:bg-[#2563EB] rounded-xl transition-colors shadow-md shadow-[#3989E8]/20"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
