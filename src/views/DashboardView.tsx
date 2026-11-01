import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Zap,
  Activity,
  AlertTriangle,
  Bot as BotIcon,
  Coins,
  ArrowUpRight,
  Plus,
  Play,
  Square,
  RotateCw,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    userBots,
    setActiveTab,
    openDeployModal,
    openBotManageModal,
    openAddFundsModal,
    startBot,
    stopBot,
    restartBot,
    templates,
    nodes,
    settings,
  } = useApp();

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalBots = userBots.length;
  const dynosUp = userBots.filter((b) => b.status === 'online').length;
  const offlineBots = userBots.filter((b) => b.status === 'offline').length;
  const errorBots = userBots.filter((b) => b.status === 'error').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Announcement Banner if active */}
      {settings.showAnnouncement && settings.announcement && (
        <div className="p-3 bg-gradient-to-r from-[#10192A] via-[#15233D] to-[#10192A] border border-[#3989E8]/30 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1 rounded-md bg-[#3989E8]/20 text-[#3989E8] shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <p className="text-slate-200 truncate">{settings.announcement}</p>
          </div>
          <button
            onClick={() => setActiveTab('templates')}
            className="text-[11px] font-bold text-[#3989E8] hover:underline shrink-0"
          >
            Explore &gt;
          </button>
        </div>
      )}

      {/* Hero Greeting Section (First Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#161C2C]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{getGreeting()},</span>
            <span className="text-white font-bold">{currentUser?.name || 'Commander'}</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#3989E8] font-semibold">Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            X LORD <span className="text-[#3989E8]">DASHBOARD</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Manage 24/7 high-performance container dynos, Baileys multi-device sessions, and server bot infrastructure.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('templates')}
            className="px-4 py-2.5 rounded-xl bg-[#101420] border border-[#1E2536] hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Browse Templates
          </button>
          <button
            onClick={() => openDeployModal(templates[0] || null)}
            className="px-4 py-2.5 rounded-xl bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#3989E8]/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy New Bot</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards (Recreating First Screenshot Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Bots */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-[#3989E8]/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bots</span>
            <div className="w-8 h-8 rounded-xl bg-[#3989E8]/15 border border-[#3989E8]/25 flex items-center justify-center text-[#3989E8]">
              <BotIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
              {totalBots}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">containers</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>{dynosUp} running</span>
            <span>·</span>
            <span>{offlineBots} stopped</span>
          </div>
        </div>

        {/* Dynos Up */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-emerald-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynos Up</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-numbers">
              {dynosUp}
            </span>
            <span className="text-[11px] text-emerald-500/80 font-medium">active 24/7</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.9% Uptime Guarantee</span>
          </div>
        </div>

        {/* Offline Bots */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-slate-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offline Bots</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono-numbers">
              {offlineBots}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">halted</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Zero CPU consumption</div>
        </div>

        {/* Errors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-red-500/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Errors</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
              {errorBots}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">crashes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('recover')}
              className="text-[#3989E8] hover:underline font-semibold"
            >
              Open Bot Doctor &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Middle Grid: Coin Balance Card & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coin Balance Card */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#10131B] via-[#0E121D] to-[#121927] border border-[#1E2536] relative overflow-hidden shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  User Coin Balance
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Instant Credit
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-numbers">
                  {currentUser?.coins || 0}{' '}
                  <span className="text-base font-normal text-amber-400">XL Coins</span>
                </span>
                <span className="text-xs text-slate-400 font-mono-numbers">
                  ≈ ${(((currentUser?.coins || 0) * settings.coinPriceUsd)).toFixed(2)} USD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Used to provision container dynos, increase RAM allocations, and maintain 24/7 uptime.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => openAddFundsModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
                <span>Add Funds / Top-Up</span>
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className="px-4 py-2 bg-[#151A26] hover:bg-[#1E273A] text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-[#1E2536] transition-colors text-center"
              >
                Payment History
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1A2234] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Total Deposited</span>
              <span className="text-white font-bold font-mono-numbers">
                ${currentUser?.totalDeposited.toFixed(2) || '0.00'} USD
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Daily Burn Rate</span>
              <span className="text-[#3989E8] font-bold font-mono-numbers">
                ~{(dynosUp * 0.16).toFixed(2)} Coins/day
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Active Node Location</span>
              <span className="text-emerald-400 font-bold">Frankfurt (Node-01)</span>
            </div>
          </div>
        </div>

        {/* Quick Hub Shortcuts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#10131B] border border-[#1E2536] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Quick Shortcuts
            </span>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('templates')}
                className="w-full p-2.5 rounded-xl bg-[#0A0D15] hover:bg-[#151A26] border border-[#1E2536] flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#3989E8]/15 text-[#3989E8]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#3989E8] transition-colors">
                      Browse Templates
                    </span>
                    <span className="text-[10px] text-slate-400">Arceus XD, CyphorX, Wolfbot</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className="w-full p-2.5 rounded-xl bg-[#0A0D15] hover:bg-[#151A26] border border-[#1E2536] flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                      Wallet & Payments
                    </span>
                    <span className="text-[10px] text-slate-400">Cards, USDT, Paystack, Binance</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('recover')}
                className="w-full p-2.5 rounded-xl bg-[#0A0D15] hover:bg-[#151A26] border border-[#1E2536] flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-purple-400 transition-colors">
                      Crash Doctor & Recover
                    </span>
                    <span className="text-[10px] text-slate-400">Fix WhatsApp 401 & crashes</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Core Version: v4.8</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All Nodes Online
            </span>
          </div>
        </div>
      </div>

      {/* "Your Bots" Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Your Bots</h2>
            <span className="text-xs text-slate-400">({userBots.length} Deployed)</span>
          </div>
          <button
            onClick={() => setActiveTab('my-bots')}
            className="text-xs text-[#3989E8] font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Bots</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userBots.length === 0 ? (
          /* High quality Empty State matching First Screenshot specification */
          <div className="p-8 sm:p-12 rounded-2xl bg-[#10131B] border border-[#1E2536] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#151D2E] border border-[#252F46] flex items-center justify-center text-[#3989E8] mx-auto">
              <BotIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Bots Deployed Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                You haven't launched any bot dynos yet. Select from our pre-configured Baileys WhatsApp MD, Telegram, and Discord templates to get started in seconds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('templates')}
                className="px-4 py-2 bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => openDeployModal(templates[0] || null)}
                className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md shadow-[#3989E8]/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Deploy First Bot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {userBots.slice(0, 4).map((bot) => {
              const isOnline = bot.status === 'online';
              const isRestarting = bot.status === 'restarting';
              return (
                <div
                  key={bot.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-[#3989E8]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#151D2E] border border-[#252F46] flex items-center justify-center text-[#3989E8] shrink-0">
                        <BotIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{bot.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-500">{bot.id}</span>
                          <span>·</span>
                          <span className="truncate">{bot.templateName}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shrink-0 ${
                        isOnline
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isRestarting
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOnline ? 'bg-emerald-400 animate-pulse' : isRestarting ? 'bg-amber-400 animate-spin' : 'bg-red-400'
                        }`}
                      />
                      {bot.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Resource Gauges */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#0A0D15] p-2.5 rounded-xl border border-[#1E2536]">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>CPU</span>
                        <span className="font-mono-numbers text-white font-semibold">{bot.cpu}%</span>
                      </div>
                      <div className="w-full bg-[#151A26] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#3989E8] transition-all duration-300"
                          style={{ width: `${Math.min(100, bot.cpu)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>RAM</span>
                        <span className="font-mono-numbers text-white font-semibold">
                          {bot.ramMb} MB
                        </span>
                      </div>
                      <div className="w-full bg-[#151A26] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${(bot.ramMb / bot.ramMaxMb) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Port: {bot.port}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isOnline ? (
                        <button
                          onClick={() => stopBot(bot.id)}
                          className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                          title="Stop"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startBot(bot.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                          title="Start"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => restartBot(bot.id)}
                        disabled={isRestarting}
                        className="p-1.5 rounded-lg bg-[#3989E8]/15 text-[#3989E8] hover:bg-[#3989E8]/25 transition-colors disabled:opacity-50"
                        title="Restart"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => openBotManageModal(bot)}
                        className="px-3 py-1.5 rounded-lg bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Node Health Footer Strip */}
      <div className="p-4 bg-[#0A0D15] rounded-2xl border border-[#161C2C] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Server className="w-4 h-4 text-[#3989E8]" />
          <span className="font-bold text-white">X LORD Global Node Cluster</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">3 Dedicated Bare-Metal Host Regions</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          {nodes.map((node) => (
            <div key={node.id} className="flex items-center gap-1.5">
              <span>{node.flag}</span>
              <span className="text-slate-300">{node.name.replace('Node-', '')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
