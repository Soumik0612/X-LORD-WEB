import React, { useState } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Gift,
  Boxes,
  CreditCard,
  MoreHorizontal,
  X,
  Shield,
  FileText,
  Settings,
  LogOut,
  Coins,
  Server,
  ExternalLink,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout, openAddFundsModal } = useApp();
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-bots', label: 'My Bots', icon: Bot },
    { id: 'recover', label: 'Recover', icon: Wrench },
    { id: 'refer', label: 'Refer', icon: Gift },
    { id: 'templates', label: 'Templates', icon: Boxes },
    { id: 'wallet', label: 'Payments', icon: CreditCard },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0D15]/95 backdrop-blur-lg border-t border-[#1A2234] px-1 py-1 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-7 items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMoreDrawerOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
                  isActive ? 'text-[#3989E8]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-[#3989E8]/15' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium leading-none tracking-tight whitespace-nowrap mt-0.5 truncate max-w-full px-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* 7th item: More */}
          <button
            onClick={() => setIsMoreDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
              isMoreDrawerOpen || activeTab === 'admin' ? 'text-[#3989E8]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform ${isMoreDrawerOpen ? 'scale-110 bg-[#3989E8]/15' : ''}`}>
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium leading-none tracking-tight whitespace-nowrap mt-0.5">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {isMoreDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMoreDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0E121C] border-t border-[#1E2536] rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation & Tools</span>
              </div>
              <button
                onClick={() => setIsMoreDrawerOpen(false)}
                className="p-1 rounded-lg bg-[#151A26] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User quick status in drawer */}
            {currentUser && (
              <div className="mt-3 p-3 bg-[#080A10] rounded-xl border border-[#1A2234] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-400">{currentUser.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 font-mono-numbers block">{currentUser.coins} Coins</span>
                  <button
                    onClick={() => {
                      setIsMoreDrawerOpen(false);
                      openAddFundsModal(true);
                    }}
                    className="text-[10px] text-[#3989E8] font-bold hover:underline"
                  >
                    + Add Coins
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-4">
              {(currentUser?.role === 'super_admin' || currentUser?.role === 'sub_admin') && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMoreDrawerOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#151A26] border border-[#1E2536] text-left hover:border-[#3989E8]/40 transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#3989E8]" />
                  <div>
                    <span className="text-xs font-bold text-white block">Admin Portal</span>
                    <span className="text-[10px] text-slate-400 block">Manage users & bots</span>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  setActiveTab('wallet');
                  setIsMoreDrawerOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#151A26] border border-[#1E2536] text-left hover:border-[#3989E8]/40 transition-colors"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Top-up Coins</span>
                  <span className="text-[10px] text-slate-400 block">USDT, Cards, Binance</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('recover');
                  setIsMoreDrawerOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#151A26] border border-[#1E2536] text-left hover:border-[#3989E8]/40 transition-colors"
              >
                <Wrench className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Crash Doctor</span>
                  <span className="text-[10px] text-slate-400 block">Fix bot errors & sessions</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('refer');
                  setIsMoreDrawerOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#151A26] border border-[#1E2536] text-left hover:border-[#3989E8]/40 transition-colors"
              >
                <Gift className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Refer & Earn</span>
                  <span className="text-[10px] text-slate-400 block">10% Lifetime bonus</span>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#1E2536] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 py-1">
                <span>Infrastructure Nodes</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 3 Nodes Online
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsMoreDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
