import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, QrCode, Key, Copy, Check, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

export const PairCodeModal: React.FC = () => {
  const { isPairCodeModalOpen, openPairCodeModal, activePairTemplate } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [pairingMethod, setPairingMethod] = useState<'code' | 'qr'>('code');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stepLogs, setStepLogs] = useState<string[]>([]);

  if (!isPairCodeModalOpen) return null;

  const handleGeneratePairCode = () => {
    if (!phoneNumber.trim()) return;
    setIsGenerating(true);
    setGeneratedCode(null);
    setStepLogs([
      'Initiating Baileys Multi-Device socket gateway handshake...',
      `Binding target phone number: ${phoneNumber}...`,
    ]);

    setTimeout(() => {
      setStepLogs((prev) => [...prev, 'Encrypted session tokens provisioned on auth server.']);
    }, 500);

    setTimeout(() => {
      setStepLogs((prev) => [...prev, 'Requesting WhatsApp 8-digit pairing code stream...']);
    }, 900);

    setTimeout(() => {
      const codePart1 = Math.floor(1000 + Math.random() * 9000);
      const codePart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const finalCode = `${codePart1}-${codePart2}`;
      setGeneratedCode(finalCode);
      setIsGenerating(false);
      setStepLogs((prev) => [
        ...prev,
        `[SUCCESS] Active 8-digit code generated: ${finalCode} (Valid for 60 seconds)`,
      ]);
    }, 1400);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.replace('-', ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2536]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {activePairTemplate ? `${activePairTemplate.name} Multi-Device Pairing` : 'WhatsApp Bot Pairing'}
              </h2>
              <p className="text-xs text-slate-400">Link your WhatsApp without scanning QR or logout</p>
            </div>
          </div>
          <button
            onClick={() => {
              openPairCodeModal(null);
              setGeneratedCode(null);
            }}
            className="p-1.5 rounded-lg bg-[#151A26] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pairing Mode Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#0A0D15] rounded-xl border border-[#1E2536] mt-5">
          <button
            onClick={() => setPairingMethod('code')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              pairingMethod === 'code' ? 'bg-[#3989E8] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>8-Digit Pairing Code</span>
          </button>
          <button
            onClick={() => setPairingMethod('qr')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              pairingMethod === 'qr' ? 'bg-[#3989E8] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code Scanner</span>
          </button>
        </div>

        {pairingMethod === 'code' ? (
          <div className="space-y-4 mt-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target WhatsApp Phone Number (with country code)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or 2348012345678"
                  className="flex-1 bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3989E8]"
                />
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGeneratePairCode}
                  className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] disabled:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-[#3989E8]/20"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Get Code</span>
                </button>
              </div>
            </div>

            {/* Generated Code Display Box */}
            {generatedCode ? (
              <div className="p-4 bg-gradient-to-b from-[#121927] to-[#0A0D15] rounded-xl border border-[#3989E8]/40 text-center space-y-2 animate-in zoom-in-95 duration-150">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Your WhatsApp 8-Digit Pairing Code:
                </span>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-400 select-all">
                    {generatedCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-[#1E2536] hover:bg-[#3989E8] text-white transition-colors"
                    title="Copy Pairing Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Code expires in <span className="text-amber-400 font-bold font-mono">59s</span> · Auto-refreshes on link
                </p>
              </div>
            ) : null}

            {/* Live Terminal Progress */}
            {stepLogs.length > 0 && (
              <div className="p-3 bg-[#07090F] rounded-xl border border-[#161C2C] font-mono text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 pb-1 border-b border-[#161C2C]">
                  <Terminal className="w-3 h-3 text-[#3989E8]" />
                  <span>Baileys Multi-Device Pairing Stream</span>
                </div>
                {stepLogs.map((log, idx) => (
                  <p key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {log}
                  </p>
                ))}
              </div>
            )}

            {/* Steps Instructions */}
            <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2 text-xs">
              <span className="font-bold text-white block">How to Link with Pairing Code:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Open <strong className="text-slate-200">WhatsApp</strong> on your phone</li>
                <li>Tap <strong className="text-slate-200">Settings</strong> (or 3 dots) &gt; <strong className="text-slate-200">Linked Devices</strong></li>
                <li>Tap <strong className="text-slate-200">Link a Device</strong></li>
                <li>Tap <strong className="text-[#3989E8]">"Link with phone number instead"</strong></li>
                <li>Enter the 8-digit code shown above</li>
              </ol>
            </div>
          </div>
        ) : (
          /* QR Code Tab */
          <div className="py-6 text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto shadow-xl flex items-center justify-center relative">
              {/* Simulated QR Pattern */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[2px] ${
                      (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                        ? 'bg-black'
                        : i % 4 === 0
                        ? 'bg-black'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2 bg-white rounded-lg shadow-md border border-slate-200">
                  <Smartphone className="w-6 h-6 text-[#3989E8]" />
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <p className="text-white font-semibold">Scan with WhatsApp Web Scanner</p>
              <p className="text-[11px] mt-0.5">WhatsApp &gt; Linked Devices &gt; Scan QR code</p>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-[#1E2536] flex justify-end">
          <button
            onClick={() => {
              openPairCodeModal(null);
              setGeneratedCode(null);
            }}
            className="px-4 py-2 bg-[#151A26] hover:bg-[#1A2234] text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
