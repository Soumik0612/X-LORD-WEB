import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Template } from '../types';
import { X, Server, Coins, Zap, Shield, AlertTriangle, Check, Layers, Cpu } from 'lucide-react';

export const DeployModal: React.FC = () => {
  const {
    selectedTemplateForDeploy,
    openDeployModal,
    templates,
    currentUser,
    deployBot,
    openAddFundsModal,
    setActiveTab,
  } = useApp();

  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [botName, setBotName] = useState('');
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'turbo'>('pro');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTemplateForDeploy) {
      setActiveTemplate(selectedTemplateForDeploy);
      setBotName(`${selectedTemplateForDeploy.name} Worker`);
      setEnvVars({ ...selectedTemplateForDeploy.defaultEnv });
      if (selectedTemplateForDeploy.planPriceCoins === 0) setSelectedPlan('free');
      else if (selectedTemplateForDeploy.planPriceCoins > 8) setSelectedPlan('turbo');
      else setSelectedPlan('pro');
    } else if (templates.length > 0) {
      setActiveTemplate(templates[0]);
      setBotName(`${templates[0].name} Bot`);
      setEnvVars({ ...templates[0].defaultEnv });
    }
  }, [selectedTemplateForDeploy, templates]);

  if (!selectedTemplateForDeploy) return null;

  const currentTemplate = activeTemplate || selectedTemplateForDeploy;
  const cost = selectedPlan === 'free' ? 0 : selectedPlan === 'pro' ? 5 : 12;
  const userCoins = currentUser?.coins ?? 0;
  const hasEnoughCoins = userCoins >= cost;

  const handleEnvChange = (key: string, value: string) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddEnvKey = () => {
    const key = prompt('Enter new environment variable key (e.g. CUSTOM_API_KEY):');
    if (key && key.trim()) {
      setEnvVars((prev) => ({ ...prev, [key.trim().toUpperCase()]: '' }));
    }
  };

  const handleDeploy = () => {
    if (!botName.trim()) {
      setDeployError('Please enter a bot name');
      return;
    }
    if (!hasEnoughCoins) {
      setDeployError(`Insufficient balance! You need ${cost} coins but have ${userCoins}.`);
      return;
    }

    setDeployError(null);
    setIsDeploying(true);

    setTimeout(() => {
      const res = deployBot(botName.trim(), currentTemplate.id, envVars);
      setIsDeploying(false);
      if (res.success) {
        setDeploySuccess(res.message);
        setTimeout(() => {
          setDeploySuccess(null);
          openDeployModal(null);
          setActiveTab('my-bots');
        }, 1200);
      } else {
        setDeployError(res.message);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2536]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3989E8]/20 border border-[#3989E8]/30 flex items-center justify-center text-[#3989E8]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Deploy New Bot Dyno</h2>
              <p className="text-xs text-slate-400">Launch isolated container on X LORD infrastructure</p>
            </div>
          </div>
          <button
            onClick={() => openDeployModal(null)}
            className="p-1.5 rounded-lg bg-[#151A26] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {deploySuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Container Provisioned!</h3>
            <p className="text-xs text-slate-300">{deploySuccess}</p>
            <p className="text-[11px] text-[#3989E8]">Redirecting to My Bots...</p>
          </div>
        ) : (
          <div className="space-y-5 mt-5">
            {deployError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deployError}</span>
              </div>
            )}

            {/* Template Card Highlight */}
            <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-[#1E2536] flex items-center gap-3.5">
              <img
                src={currentTemplate.image}
                alt={currentTemplate.name}
                className="w-16 h-12 object-cover rounded-lg border border-[#1E2536]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{currentTemplate.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono-numbers">{currentTemplate.version}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{currentTemplate.description}</p>
                <span className="text-[10px] text-[#3989E8] font-semibold mt-1 inline-block">
                  {currentTemplate.category} · {currentTemplate.deploymentCount} Deploys
                </span>
              </div>
            </div>

            {/* Bot Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Bot Instance Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. My Arceus WhatsApp Bot"
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3989E8] transition-colors"
              />
            </div>

            {/* Hosting Dyno Plan Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Hosting Dyno Plan
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('free')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === 'free'
                      ? 'bg-[#3989E8]/15 border-[#3989E8] text-white shadow-sm'
                      : 'bg-[#0A0D15] border-[#1E2536] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">Free Dyno</span>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">0 Coins</span>
                  <span className="text-[10px] text-slate-400 block mt-1">256MB RAM · Shared CPU</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === 'pro'
                      ? 'bg-[#3989E8]/15 border-[#3989E8] text-white shadow-sm'
                      : 'bg-[#0A0D15] border-[#1E2536] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block text-white">Pro Dyno</span>
                    <span className="text-[9px] bg-[#3989E8]/30 text-[#3989E8] px-1.5 py-0.2 rounded font-bold uppercase">Popular</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold block mt-0.5 font-mono-numbers">5 Coins / mo</span>
                  <span className="text-[10px] text-slate-400 block mt-1">512MB RAM · High Speed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('turbo')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === 'turbo'
                      ? 'bg-[#3989E8]/15 border-[#3989E8] text-white shadow-sm'
                      : 'bg-[#0A0D15] border-[#1E2536] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">Turbo Dyno</span>
                  <span className="text-[11px] text-purple-400 font-bold block mt-0.5 font-mono-numbers">12 Coins / mo</span>
                  <span className="text-[10px] text-slate-400 block mt-1">1024MB RAM · Dedicated</span>
                </button>
              </div>
            </div>

            {/* Environment Variables */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Environment Variables ({Object.keys(envVars).length})
                </label>
                <button
                  type="button"
                  onClick={handleAddEnvKey}
                  className="text-[11px] text-[#3989E8] hover:underline font-semibold"
                >
                  + Add Custom Key
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 p-2.5 bg-[#0A0D15] rounded-xl border border-[#1E2536]">
                {Object.entries(envVars).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-32 shrink-0 truncate">
                      {key}:
                    </span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleEnvChange(key, e.target.value)}
                      placeholder={`Enter ${key}`}
                      className="flex-1 bg-[#101420] border border-[#1E2536] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#3989E8]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Balance & Deployment Cost bar */}
            <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Available:</span>
                <span className="font-bold text-white font-mono-numbers">{userCoins} Coins</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-slate-400">Required:</span>{' '}
                  <span className={`font-bold font-mono-numbers ${hasEnoughCoins ? 'text-emerald-400' : 'text-red-400'}`}>
                    {cost} Coins
                  </span>
                </div>
                {!hasEnoughCoins && (
                  <button
                    type="button"
                    onClick={() => openAddFundsModal(true)}
                    className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-bold hover:bg-amber-500/30"
                  >
                    Top up
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2536]">
              <button
                type="button"
                onClick={() => openDeployModal(null)}
                className="px-4 py-2 rounded-xl bg-[#151A26] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeploying || !hasEnoughCoins}
                onClick={handleDeploy}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                  hasEnoughCoins
                    ? 'bg-[#3989E8] hover:bg-[#2563EB] text-white shadow-[#3989E8]/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isDeploying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Allocating Dyno...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Deploy Container ({cost} Coins)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
