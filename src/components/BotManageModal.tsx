import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, LogEntry } from '../types';
import {
  X,
  Play,
  Square,
  RotateCw,
  Trash2,
  Terminal,
  Settings2,
  Smartphone,
  Cpu,
  FolderGit2,
  Send,
  Plus,
  Save,
  Check,
  AlertCircle,
  Copy,
  Server,
  Activity,
  Layers,
} from 'lucide-react';

export const BotManageModal: React.FC = () => {
  const {
    selectedBotForManage,
    openBotManageModal,
    startBot,
    stopBot,
    restartBot,
    deleteBot,
    updateBotEnv,
    requestBotPairingCode,
    addBotConsoleCommand,
    runBotDoctor,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'console' | 'env' | 'pairing' | 'resources' | 'files'>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [localEnv, setLocalEnv] = useState<Record<string, string>>({});
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvVal, setNewEnvVal] = useState('');
  const [envSaved, setEnvSaved] = useState(false);
  const [pairPhone, setPairPhone] = useState('');
  const [generatedPairCode, setGeneratedPairCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBotForManage) {
      setLocalEnv({ ...selectedBotForManage.envVars });
      setPairPhone(selectedBotForManage.phoneNumber || '+91 98765 43210');
      if (selectedBotForManage.pairingCode) {
        setGeneratedPairCode(selectedBotForManage.pairingCode);
      }
    }
  }, [selectedBotForManage]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedBotForManage?.logs, autoScroll]);

  if (!selectedBotForManage) return null;

  const bot = selectedBotForManage;
  const isOnline = bot.status === 'online';
  const isRestarting = bot.status === 'restarting';

  const formatUptime = (seconds: number) => {
    if (seconds <= 0) return 'Offline';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    addBotConsoleCommand(bot.id, consoleInput.trim());
    setConsoleInput('');
  };

  const handleSaveEnv = () => {
    updateBotEnv(bot.id, localEnv);
    setEnvSaved(true);
    setTimeout(() => setEnvSaved(false), 2000);
  };

  const handleAddEnvPair = () => {
    if (!newEnvKey.trim()) return;
    const key = newEnvKey.trim().toUpperCase();
    setLocalEnv((prev) => ({ ...prev, [key]: newEnvVal }));
    setNewEnvKey('');
    setNewEnvVal('');
  };

  const handleRemoveEnv = (key: string) => {
    setLocalEnv((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleGeneratePairing = () => {
    const code = requestBotPairingCode(bot.id, pairPhone);
    setGeneratedPairCode(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E2536] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A2234] border border-[#252F46] flex items-center justify-center text-[#3989E8] shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">{bot.name}</h2>
                <span className="text-[10px] font-mono text-slate-400 bg-[#161C2C] px-2 py-0.5 rounded-md">
                  {bot.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
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
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{bot.templateName}</span>
                <span>·</span>
                <span>{bot.nodeLocation}</span>
                <span>·</span>
                <span className="font-mono-numbers text-slate-300">Uptime: {formatUptime(bot.uptimeSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Restart, Stop/Start, Delete, Close) */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {isOnline ? (
              <button
                onClick={() => stopBot(bot.id)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Stop Bot Process"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => startBot(bot.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Start Bot Process"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start</span>
              </button>
            )}

            <button
              onClick={() => restartBot(bot.id)}
              disabled={isRestarting}
              className="px-3 py-1.5 rounded-lg bg-[#3989E8]/15 text-[#3989E8] border border-[#3989E8]/30 hover:bg-[#3989E8]/25 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Restart Dyno"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
              <span>Restart</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Are you sure you want to permanently delete "${bot.name}"?`)) {
                  deleteBot(bot.id);
                }
              }}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              title="Delete Bot"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openBotManageModal(null)}
              className="p-2 rounded-lg bg-[#151A26] text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 border-b border-[#1E2536] pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Terminal Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'env'
                ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Environment Variables</span>
          </button>

          <button
            onClick={() => setActiveTab('pairing')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pairing'
                ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp Pairing</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Dyno Resources</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'files'
                ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Git & Storage</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[320px]">
          {/* TAB 1: LIVE CONSOLE LOGS */}
          {activeTab === 'console' && (
            <div className="flex flex-col h-full space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono font-semibold">tty1: Node.js Baileys Worker</span>
                  <span className="text-[10px] text-slate-500">Port {bot.port}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="rounded accent-[#3989E8]"
                    />
                    <span>Auto-scroll</span>
                  </label>
                  <button
                    onClick={() => {
                      // clear simulated logs
                      bot.logs = [
                        { timestamp: new Date().toLocaleTimeString(), text: '[CONSOLE] Cleared display buffer.', type: 'info' },
                      ];
                    }}
                    className="text-[11px] text-[#3989E8] hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Screen */}
              <div className="flex-1 bg-[#06080E] border border-[#161C2C] rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-[340px] space-y-1.5 shadow-inner">
                {bot.logs.map((log, idx) => {
                  let colorClass = 'text-slate-300';
                  if (log.type === 'success') colorClass = 'text-emerald-400';
                  else if (log.type === 'warn') colorClass = 'text-amber-400';
                  else if (log.type === 'error') colorClass = 'text-red-400';
                  return (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed break-all">
                      <span className="text-slate-600 text-[11px] shrink-0 select-none">
                        [{log.timestamp}]
                      </span>
                      <span className={colorClass}>{log.text}</span>
                    </div>
                  );
                })}
                <div ref={logsEndRef} />
              </div>

              {/* Console Command Input */}
              <form onSubmit={handleSendCommand} className="flex gap-2 pt-1">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-[#3989E8] font-mono text-xs font-bold">$</span>
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    placeholder="Enter command (e.g. status, git pull, ping, help)"
                    className="w-full bg-[#080A10] border border-[#1E2536] rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-[#3989E8]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ENVIRONMENT VARIABLES */}
          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Configured Environment Secrets
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Values are securely injected into container runtime process.env
                  </p>
                </div>
                <button
                  onClick={handleSaveEnv}
                  className="px-3.5 py-1.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-[#3989E8]/20"
                >
                  {envSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{envSaved ? 'Saved & Hot-Reloaded!' : 'Save Changes'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(localEnv).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 bg-[#0A0D15] rounded-xl border border-[#1E2536]"
                  >
                    <span className="font-mono text-xs font-bold text-slate-300 w-44 shrink-0 truncate">
                      {key}
                    </span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setLocalEnv((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 bg-[#101420] border border-[#1E2536] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#3989E8]"
                    />
                    <button
                      onClick={() => handleRemoveEnv(key)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Key */}
              <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="NEW_ENV_KEY (e.g. GEMINI_API_KEY)"
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  className="w-full sm:w-48 bg-[#101420] border border-[#1E2536] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
                <input
                  type="text"
                  placeholder="Secret Value"
                  value={newEnvVal}
                  onChange={(e) => setNewEnvVal(e.target.value)}
                  className="flex-1 bg-[#101420] border border-[#1E2536] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
                <button
                  onClick={handleAddEnvPair}
                  className="px-3 py-1.5 bg-[#151A26] hover:bg-[#1F273A] text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Key</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP PAIRING */}
          {activeTab === 'pairing' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-white">Multi-Device Pairing Link</h3>
                <p className="text-xs text-slate-400">
                  Connect your WhatsApp account directly to this bot container using 8-digit code
                </p>
              </div>

              <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    WhatsApp Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pairPhone}
                      onChange={(e) => setPairPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 bg-[#101420] border border-[#1E2536] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3989E8]"
                    />
                    <button
                      onClick={handleGeneratePairing}
                      className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      Request Code
                    </button>
                  </div>
                </div>

                {generatedPairCode && (
                  <div className="p-4 bg-[#121927] border border-[#3989E8]/30 rounded-xl text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Active Pairing Code:
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl font-mono font-extrabold text-emerald-400 tracking-widest">
                        {generatedPairCode}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPairCode.replace('-', ''));
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="p-1.5 rounded-lg bg-[#1E2536] hover:bg-[#3989E8] text-white transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Open WhatsApp &gt; Linked Devices &gt; Link with phone number
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DYNO RESOURCES & CRASH DOCTOR */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CPU Card */}
                <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#3989E8]" /> CPU Usage
                    </span>
                    <span className="text-xs font-bold font-mono-numbers text-white">{bot.cpu}%</span>
                  </div>
                  <div className="w-full bg-[#151A26] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        bot.cpu > 70 ? 'bg-red-500' : bot.cpu > 40 ? 'bg-amber-400' : 'bg-[#3989E8]'
                      }`}
                      style={{ width: `${Math.min(100, bot.cpu)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Container cgroup quota: 1 vCPU @ 3.4GHz</p>
                </div>

                {/* RAM Card */}
                <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-400" /> Memory (RAM)
                    </span>
                    <span className="text-xs font-bold font-mono-numbers text-white">
                      {bot.ramMb} MB / {bot.ramMaxMb} MB
                    </span>
                  </div>
                  <div className="w-full bg-[#151A26] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${(bot.ramMb / bot.ramMaxMb) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Heap usage: {Math.round((bot.ramMb / bot.ramMaxMb) * 100)}% of limit
                  </p>
                </div>
              </div>

              {/* Bot Doctor Quick Actions */}
              <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#3989E8]" />
                  Crash Recovery & Auto-Heal Actions
                </h4>
                <p className="text-[11px] text-slate-400">
                  Instant recovery routines for session expiry, rate limit backoff, or memory leaks.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => {
                      const msg = runBotDoctor(bot.id, 'clear_session');
                      alert(msg);
                    }}
                    className="p-2 rounded-lg bg-[#151A26] hover:bg-[#1A2234] text-[11px] font-semibold text-slate-200 border border-[#1E2536]"
                  >
                    Clear Session Cache
                  </button>
                  <button
                    onClick={() => {
                      const msg = runBotDoctor(bot.id, 'restart_clean');
                      alert(msg);
                    }}
                    className="p-2 rounded-lg bg-[#151A26] hover:bg-[#1A2234] text-[11px] font-semibold text-slate-200 border border-[#1E2536]"
                  >
                    Cold Reboot Dyno
                  </button>
                  <button
                    onClick={() => {
                      const msg = runBotDoctor(bot.id, 'auto_fix_deps');
                      alert(msg);
                    }}
                    className="p-2 rounded-lg bg-[#151A26] hover:bg-[#1A2234] text-[11px] font-semibold text-slate-200 border border-[#1E2536]"
                  >
                    Fix npm Dependencies
                  </button>
                  <button
                    onClick={() => {
                      const msg = runBotDoctor(bot.id, 'patch_baileys');
                      alert(msg);
                    }}
                    className="p-2 rounded-lg bg-[#151A26] hover:bg-[#1A2234] text-[11px] font-semibold text-[#3989E8] border border-[#3989E8]/30"
                  >
                    Patch 401 Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GIT & STORAGE */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#3989E8]" /> Connected Repository
                </h4>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex items-center justify-between py-1 border-b border-[#1E2536]">
                    <span className="text-slate-400">Git Source:</span>
                    <span className="font-mono text-[#3989E8] truncate max-w-xs">
                      https://github.com/xlord-host/{bot.templateId.replace('tmpl_', '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#1E2536]">
                    <span className="text-slate-400">Branch:</span>
                    <span className="font-mono text-emerald-400">main (synced)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#1E2536]">
                    <span className="text-slate-400">Persistent Disk Storage:</span>
                    <span className="font-mono text-white">48.2 MB / 5.0 GB used</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => addBotConsoleCommand(bot.id, 'git pull origin main')}
                    className="px-3 py-1.5 rounded-lg bg-[#151A26] hover:bg-[#1A2234] text-xs font-bold text-white border border-[#1E2536] flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Pull Latest Git Commit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#1E2536] flex items-center justify-between text-xs text-slate-400">
          <span>Container Node: {bot.nodeLocation}</span>
          <button
            onClick={() => openBotManageModal(null)}
            className="px-4 py-2 bg-[#151A26] hover:bg-[#1A2234] text-white font-bold rounded-xl transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
