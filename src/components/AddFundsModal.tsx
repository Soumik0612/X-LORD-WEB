import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  X,
  CreditCard,
  Coins,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const AddFundsModal: React.FC = () => {
  const { isAddFundsModalOpen, openAddFundsModal, addDeposit, settings, currentUser } = useApp();

  const [selectedBundleCoins, setSelectedBundleCoins] = useState<number>(100);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Card Payment');
  const [usdtNetwork, setUsdtNetwork] = useState<'TRC20' | 'BEP20'>('TRC20');
  const [txHashInput, setTxHashInput] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: currentUser?.name || 'Soumya Dey',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '789',
  });

  if (!isAddFundsModalOpen) return null;

  const bundles = [
    { coins: 50, usd: 5.00, label: 'Starter' },
    { coins: 100, usd: 10.00, label: 'Standard', popular: true },
    { coins: 250, usd: 25.00, label: 'Pro Pack' },
    { coins: 500, usd: 50.00, label: 'Whale Saver' },
  ];

  const currentUsd = (selectedBundleCoins * settings.coinPriceUsd).toFixed(2);
  const usdtAddress =
    usdtNetwork === 'TRC20' ? settings.usdtTrc20Address : settings.usdtBep20Address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(usdtAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      addDeposit(selectedBundleCoins, selectedMethod, txHashInput.trim() || undefined);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2536]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Top-Up XL Coin Balance</h2>
              <p className="text-xs text-slate-400">
                10 XL Coins = $1.00 USD · Instant dyno provisioning
              </p>
            </div>
          </div>
          <button
            onClick={() => openAddFundsModal(false)}
            className="p-1.5 rounded-lg bg-[#151A26] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmitDeposit} className="space-y-5 mt-5">
          {/* Bundle selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Coin Package
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {bundles.map((bundle) => {
                const isSelected = selectedBundleCoins === bundle.coins;
                return (
                  <button
                    key={bundle.coins}
                    type="button"
                    onClick={() => setSelectedBundleCoins(bundle.coins)}
                    className={`p-3 rounded-xl border text-center relative transition-all ${
                      isSelected
                        ? 'bg-[#3989E8]/15 border-[#3989E8] text-white shadow-sm'
                        : 'bg-[#0A0D15] border-[#1E2536] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {bundle.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#3989E8] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                    <span className="text-sm font-bold text-white block font-mono-numbers">
                      {bundle.coins} <span className="text-[11px] font-normal text-slate-400">Coins</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5 font-mono-numbers">
                      ${bundle.usd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">{bundle.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'Card Payment', label: 'Credit Card (Visa/MC)', icon: CreditCard },
                { id: 'Paystack', label: 'Paystack (NGN/USD)', icon: ShieldCheck },
                { id: 'Binance Pay', label: 'Binance Pay', icon: QrCode },
                { id: 'USDT', label: 'USDT Crypto (TRC20/BEP20)', icon: Coins },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-[#3989E8]/15 border-[#3989E8] text-white'
                        : 'bg-[#0A0D15] border-[#1E2536] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#3989E8] shrink-0" />
                    <span className="text-xs font-semibold truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD PAYMENT DETAILS */}
          {selectedMethod === 'Card Payment' && (
            <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-[#1E2536]">
                <span>Cardholder: <strong>{cardDetails.name}</strong></span>
                <span className="text-slate-400">256-bit SSL Encrypted</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="w-full bg-[#101420] border border-[#1E2536] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#3989E8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full bg-[#101420] border border-[#1E2536] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#3989E8]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    className="w-full bg-[#101420] border border-[#1E2536] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#3989E8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PAYSTACK */}
          {selectedMethod === 'Paystack' && (
            <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2 text-xs">
              <span className="font-bold text-white block">Paystack Gateway Integration</span>
              <p className="text-slate-400 text-[11px]">
                Accepts cards, bank transfers, USSD, and Mobile Money in NGN, GHS, ZAR, KES, and USD.
              </p>
              <div className="p-2.5 bg-[#101420] rounded-lg border border-[#1E2536] text-emerald-400 font-mono-numbers">
                Charge Total: ${(Number(currentUsd)).toFixed(2)} USD (≈ ₦{(Number(currentUsd) * 1600).toLocaleString()} NGN)
              </div>
            </div>
          )}

          {/* BINANCE PAY */}
          {selectedMethod === 'Binance Pay' && (
            <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Binance Pay Merchant ID</span>
                <span className="text-amber-400 font-mono font-bold">{settings.binancePayId}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Open the Binance App &gt; Pay &gt; Send &gt; enter Merchant ID or scan QR code.
              </p>
              <input
                type="text"
                placeholder="Enter Binance Order ID / Payer ID"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                className="w-full bg-[#101420] border border-[#1E2536] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3989E8]"
              />
            </div>
          )}

          {/* USDT CRYPTO */}
          {selectedMethod === 'USDT' && (
            <div className="p-4 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Select Network</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUsdtNetwork('TRC20')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      usdtNetwork === 'TRC20' ? 'bg-[#3989E8] text-white' : 'bg-[#151A26] text-slate-400'
                    }`}
                  >
                    TRC20 (Tron)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsdtNetwork('BEP20')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      usdtNetwork === 'BEP20' ? 'bg-[#3989E8] text-white' : 'bg-[#151A26] text-slate-400'
                    }`}
                  >
                    BEP20 (BSC)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Official Deposit Address ({usdtNetwork})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={usdtAddress}
                    className="flex-1 bg-[#101420] border border-[#1E2536] rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="px-3 py-1.5 bg-[#1E2536] hover:bg-[#3989E8] text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Transaction Hash / TXID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste 0x... or Tron transaction hash for verification"
                  value={txHashInput}
                  onChange={(e) => setTxHashInput(e.target.value)}
                  className="w-full bg-[#101420] border border-[#1E2536] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#3989E8]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Crypto deposits are reviewed by administrator to prevent simulation abuse.
                </p>
              </div>
            </div>
          )}

          {/* Total summary */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Charged:</span>
            <span className="text-base font-bold text-white font-mono-numbers">
              ${currentUsd} USD{' '}
              <span className="text-xs text-amber-400 font-normal">
                ({selectedBundleCoins} XL Coins)
              </span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E2536]">
            <button
              type="button"
              onClick={() => openAddFundsModal(false)}
              className="px-4 py-2 bg-[#151A26] hover:bg-[#1A2234] text-xs font-semibold text-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#3989E8]/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ${currentUsd}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
