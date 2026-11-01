import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Shield, Terminal, Server, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openAuthModal } = useApp();
  const [legalModalContent, setLegalModalContent] = useState<string | null>(null);

  const openLegalModal = (title: string, content: string) => {
    setLegalModalContent(`${title}:::${content}`);
  };

  return (
    <footer className="bg-[#06080D] border-t border-[#161C2C] text-slate-400 text-xs mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3989E8] to-[#2563EB] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#080A10] rounded-[7px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#3989E8]" />
                </div>
              </div>
              <span className="text-sm font-extrabold tracking-wider text-white">
                X LORD BOT MANAGEMENT
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Professional Bot Hosting & Management Platform. High-speed container dynos with 99.9% uptime, WhatsApp Baileys pairing codes, and instant multi-device deployment.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101420] border border-[#1E2536] text-[11px] text-emerald-400 font-mono-numbers">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Node-01 Frankfurt: Operational
              </span>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">PLATFORM</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Templates Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('recover')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Documentation & Bot Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my-bots')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Cloud Container Integration
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  WhatsApp MD Engine
                </button>
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">ACCOUNT</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={openAuthModal}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={openAuthModal}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Wallet & Deposits
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my-bots')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  My Bots
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('refer')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Refer & Earn (10% Bonus)
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">LEGAL</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => openLegalModal('Privacy Policy', 'X LORD BOT MANAGEMENT values your privacy. We never store WhatsApp message contents, session passwords, or personal credentials unencrypted. All bot containers run isolated cgroups with zero external packet snooping.')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('Terms of Service', 'Users agree not to utilize X LORD BOT MANAGEMENT dynos for unlawful DDoS attacks, bulk spam harassment, or malicious credential harvesting. Containers violating community terms are immediately suspended.')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('Docs & Architecture', 'Comprehensive guidelines on connecting your GitHub repositories, setting up Baileys pairing code sessions, configuring environmental variables (PREFIX, OWNER_NUMBER, AUTO_READ), and auto-restart dyno policies.')}
                  className="hover:text-[#3989E8] transition-colors text-left"
                >
                  Docs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#161C2C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            © 2026 X LORD BOT MANAGEMENT. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Server Time: UTC+0</span>
            <span>·</span>
            <span>Dyno Version: v4.8-LXC</span>
            <span>·</span>
            <span className="text-[#3989E8] font-semibold">Engine: Wings LXC</span>
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {legalModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3">
              {legalModalContent.split(':::')[0]}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {legalModalContent.split(':::')[1]}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setLegalModalContent(null)}
                className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
