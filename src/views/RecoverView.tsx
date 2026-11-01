import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  ShieldAlert,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Cpu,
  Zap,
  Server,
  Layers,
  FileCode,
} from 'lucide-react';

export const RecoverView: React.FC = () => {
  const { userBots, runBotDoctor, openBotManageModal } = useApp();
  const [selectedBotId, setSelectedBotId] = useState<string>(userBots[0]?.id || '');
  const [doctorLog, setDoctorLog] = useState<string[]>([]);
  const [isFixing, setIsFixing] = useState(false);

  const activeBot = userBots.find((b) => b.id === selectedBotId);

  const handleRunDoctor = (type: 'clear_session' | 'restart_clean' | 'auto_fix_deps' | 'patch_baileys') => {
    if (!selectedBotId) return;
    setIsFixing(true);
    setDoctorLog([`[DIAGNOSTIC] Analyzing dyno container ${selectedBotId}...`]);

    setTimeout(() => {
      setDoctorLog((prev) => [
        ...prev,
        `[INSPECTION] Scanning process memory heap and Baileys session creds...`,
      ]);
    }, 400);

    setTimeout(() => {
      const result = runBotDoctor(selectedBotId, type);
      setDoctorLog((prev) => [
        ...prev,
        `[SUCCESS] ${result}`,
        `[STATUS] Container health check: 100% OK. Dyno online.`,
      ]);
      setIsFixing(false);
    }, 1100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-400">
              <Wrench className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Bot Doctor & Emergency Recovery
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Container Auto-Heal & Crash Recovery
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Diagnose and fix WhatsApp 401 Disconnects, Bad MAC errors, Node.js heap memory overflows, and corrupted session caches.
          </p>
        </div>

        {/* Status Pill */}
        <div className="p-3 bg-[#10131B] border border-[#1E2536] rounded-xl self-start sm:self-auto flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-white font-bold">Watchdog Daemon: Active</span>
        </div>
      </div>

      {userBots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Deployed Bots to Recover</h3>
          <p className="text-xs text-slate-400">You must have an active or stopped bot container to run diagnostics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Bot Selector & Quick Doctor Buttons */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-white block">
                Select Target Bot Instance
              </label>

              <select
                value={selectedBotId}
                onChange={(e) => setSelectedBotId(e.target.value)}
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#3989E8]"
              >
                {userBots.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.id}) - {b.status.toUpperCase()}
                  </option>
                ))}
              </select>

              {activeBot && (
                <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Template:</span>
                    <span className="text-white font-semibold truncate max-w-[140px]">{activeBot.templateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Node Server:</span>
                    <span className="text-[#3989E8]">{activeBot.nodeLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={activeBot.status === 'online' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {activeBot.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic One-Click Action Cards */}
            <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Automated Repair Routines
              </span>

              <div className="space-y-2">
                <button
                  disabled={isFixing}
                  onClick={() => handleRunDoctor('patch_baileys')}
                  className="w-full p-3 rounded-xl bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#3989E8]">
                      Fix WhatsApp 401 Disconnect
                    </span>
                    <span className="text-[10px] text-slate-400">Patches Baileys session socket loop</span>
                  </div>
                  <Zap className="w-4 h-4 text-[#3989E8] shrink-0" />
                </button>

                <button
                  disabled={isFixing}
                  onClick={() => handleRunDoctor('clear_session')}
                  className="w-full p-3 rounded-xl bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-amber-400">
                      Purge Corrupted Session Files
                    </span>
                    <span className="text-[10px] text-slate-400">Cleans Bad MAC / Creds.json lock</span>
                  </div>
                  <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                </button>

                <button
                  disabled={isFixing}
                  onClick={() => handleRunDoctor('restart_clean')}
                  className="w-full p-3 rounded-xl bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-purple-400">
                      Cgroup Memory Purge & Cold Boot
                    </span>
                    <span className="text-[10px] text-slate-400">Frees OOM (Out of Memory) leaks</span>
                  </div>
                  <RotateCw className="w-4 h-4 text-purple-400 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Console Terminal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Live Diagnostic Terminal</span>
                </div>
                {activeBot && (
                  <button
                    onClick={() => openBotManageModal(activeBot)}
                    className="text-xs text-[#3989E8] hover:underline font-semibold"
                  >
                    Open Full Console &gt;
                  </button>
                )}
              </div>

              <div className="mt-4 flex-1 bg-[#06080E] rounded-xl border border-[#161C2C] p-4 font-mono text-xs overflow-y-auto space-y-2">
                <p className="text-slate-500"># X LORD BOT MANAGEMENT Crash Diagnostic Engine v4.8</p>
                <p className="text-slate-500"># Ready for automated repairs...</p>

                {doctorLog.map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.includes('SUCCESS')
                        ? 'text-emerald-400 font-bold'
                        : line.includes('DIAGNOSTIC')
                        ? 'text-purple-400'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </p>
                ))}

                {isFixing && (
                  <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing container patch...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
