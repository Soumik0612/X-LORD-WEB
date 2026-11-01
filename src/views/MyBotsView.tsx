import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, BotStatus } from '../types';
import {
  Bot as BotIcon,
  Search,
  Plus,
  Play,
  Square,
  RotateCw,
  Trash2,
  Sliders,
  Cpu,
  Activity,
  Layers,
  Filter,
  Server,
  Key,
} from 'lucide-react';

export const MyBotsView: React.FC = () => {
  const {
    userBots,
    templates,
    openDeployModal,
    openBotManageModal,
    openPairCodeModal,
    startBot,
    stopBot,
    restartBot,
    deleteBot,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'error'>('all');

  const filteredBots = userBots.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && bot.status === statusFilter;
  });

  const formatUptime = (seconds: number) => {
    if (seconds <= 0) return 'Offline';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">My Bots</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#151D2E] text-[#3989E8] border border-[#3989E8]/30 text-xs font-bold font-mono-numbers">
              {userBots.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor, manage, and configure your deployed WhatsApp, Telegram, and Discord cloud containers.
          </p>
        </div>

        <button
          onClick={() => openDeployModal(templates[0] || null)}
          className="px-4 py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#3989E8]/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Bot</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bots by name, ID, or template..."
            className="w-full bg-[#10131B] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3989E8] transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#10131B] rounded-xl border border-[#1E2536] shrink-0 self-start sm:self-auto">
          {(['all', 'online', 'offline', 'error'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-[#3989E8] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bots Grid / Empty State */}
      {filteredBots.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#10131B] border border-[#1E2536] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#151D2E] border border-[#252F46] flex items-center justify-center text-[#3989E8] mx-auto">
            <BotIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Matching Bots Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No bot instances match "${searchQuery}". Try a different search query.`
                : 'You have not deployed any bots yet. Pick a ready-to-run template from our marketplace!'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openDeployModal(templates[0] || null)}
              className="px-5 py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy First Bot Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot) => {
            const isOnline = bot.status === 'online';
            const isRestarting = bot.status === 'restarting';
            return (
              <div
                key={bot.id}
                className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-[#3989E8]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
              >
                {/* Bot Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#151D2E] border border-[#252F46] flex items-center justify-center text-[#3989E8] shrink-0 group-hover:border-[#3989E8]/40 transition-colors">
                      <BotIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{bot.name}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-500 font-semibold">{bot.id}</span>
                        <span>·</span>
                        <span className="text-[#3989E8] font-medium truncate">{bot.templateName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 shrink-0 ${
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

                {/* Resource Metrics & Gauges */}
                <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2 text-xs">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-[#3989E8]" /> CPU Usage
                      </span>
                      <span className="font-mono-numbers text-white font-semibold">{bot.cpu}%</span>
                    </div>
                    <div className="w-full bg-[#151A26] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          bot.cpu > 70 ? 'bg-red-500' : 'bg-[#3989E8]'
                        }`}
                        style={{ width: `${Math.min(100, bot.cpu)}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM Usage */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-purple-400" /> RAM Usage
                      </span>
                      <span className="font-mono-numbers text-white font-semibold">
                        {bot.ramMb} MB / {bot.ramMaxMb} MB
                      </span>
                    </div>
                    <div className="w-full bg-[#151A26] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${(bot.ramMb / bot.ramMaxMb) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Uptime: <strong className="text-slate-200">{formatUptime(bot.uptimeSeconds)}</strong></span>
                    <span>Port: <strong className="text-slate-200 font-mono">{bot.port}</strong></span>
                  </div>
                </div>

                {/* Bot Card Actions Bar matching Reference */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-[#1E2536]">
                  {/* Left Action Buttons: Start/Stop & Restart */}
                  <div className="flex items-center gap-1">
                    {isOnline ? (
                      <button
                        onClick={() => stopBot(bot.id)}
                        className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                        title="Stop Bot"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startBot(bot.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                        title="Start Bot"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => restartBot(bot.id)}
                      disabled={isRestarting}
                      className="p-1.5 rounded-lg bg-[#3989E8]/15 text-[#3989E8] border border-[#3989E8]/30 hover:bg-[#3989E8]/25 transition-colors disabled:opacity-50"
                      title="Restart Dyno"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete "${bot.name}"?`)) {
                          deleteBot(bot.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      title="Delete Bot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Manage Button */}
                  <button
                    onClick={() => openBotManageModal(bot)}
                    className="px-3.5 py-1.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md shadow-[#3989E8]/20 flex items-center gap-1.5 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
