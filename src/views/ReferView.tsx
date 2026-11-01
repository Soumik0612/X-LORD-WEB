import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Copy,
  Check,
  Users,
  Coins,
  Zap,
  ArrowRight,
  Share2,
  Sparkles,
  Award,
} from 'lucide-react';

export const ReferView: React.FC = () => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = currentUser?.referralCode || 'XL-CHIEF-01';
  const referralUrl = `https://xlord.host/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Gift className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Partnership & Affiliate Program
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Refer Friends & Earn 10% XL Coins
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Share your unique referral link. Whenever your referrals deploy bot containers or deposit coins, you earn an instant 10% lifetime commission.
          </p>
        </div>

        <div className="p-3 bg-[#10131B] border border-[#1E2536] rounded-xl self-start sm:self-auto flex items-center gap-2 text-xs">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs font-bold text-white block">Tier 1 Affiliate</span>
            <span className="text-[10px] text-emerald-400 font-semibold block">10% Instant Cashout</span>
          </div>
        </div>
      </div>

      {/* Referral Link Copy Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#10131B] via-[#0E1524] to-[#10192A] border border-[#3989E8]/30 space-y-3 shadow-lg">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Your Unique Referral Link
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 bg-[#070A12] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs font-mono text-[#3989E8] select-all focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-5 py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#3989E8]/20 transition-all shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
          <span>Referral Code: <strong className="text-white font-mono">{referralCode}</strong></span>
          <span>·</span>
          <span>Your friends receive <strong className="text-emerald-400">+25 Free Coins</strong> on signup</span>
        </div>
      </div>

      {/* Referral Stats 3-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Invited</span>
            <div className="w-8 h-8 rounded-xl bg-[#3989E8]/15 border border-[#3989E8]/25 flex items-center justify-center text-[#3989E8]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono-numbers">14</span>
            <span className="text-xs text-slate-400">users</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Registered with your code</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Dynos</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono-numbers">8</span>
            <span className="text-xs text-slate-400">running bots</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Generating recurring coins</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coins Earned</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono-numbers">65</span>
            <span className="text-xs text-amber-300 font-mono">XL Coins</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Credited directly to wallet</span>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="p-6 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          How the Affiliate Reward System Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#3989E8]/20 text-[#3989E8] font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Share Your Link</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Send your referral link to bot owners, group admins, and WhatsApp/Telegram bot developers on WhatsApp, Telegram, or Discord.
            </p>
          </div>

          <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-white">They Sign Up & Deploy</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your referred user receives 25 bonus coins upon registration and deploys their bots on our high-speed container dynos.
            </p>
          </div>

          <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Earn 10% For Life</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every time they top up their wallet via USDT, Card, or Binance Pay, 10% in XL Coins is instantly deposited to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
