import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { currentUser, userTransactions, openAddFundsModal, settings } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'deposits' | 'charges'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const availableCoins = currentUser?.coins ?? 0;
  const totalDeposited = currentUser?.totalDeposited ?? 0;
  const totalSpent = currentUser?.totalSpent ?? 0;
  const totalTransactionsCount = userTransactions.length;

  const filteredTransactions = userTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'deposits') {
      return matchesSearch && tx.type === 'deposit';
    }
    if (activeFilter === 'charges') {
      return matchesSearch && (tx.type === 'bot_deploy' || tx.type === 'hosting_fee');
    }
    return matchesSearch;
  });

  const handleCopyTx = (txId: string) => {
    navigator.clipboard.writeText(txId);
    setCopiedTxId(txId);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching Screenshot 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Wallet & Payments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your XL Coin billing balance, view payment logs, and fund your container hosting dynos.
          </p>
        </div>

        <button
          onClick={() => openAddFundsModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#3989E8] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#3989E8]/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Funds / Top-Up</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards (Screenshot 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Available Balance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-amber-400/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {availableCoins}
            </span>
            <span className="text-xs text-amber-400 font-bold font-mono">XL Coins</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 font-mono-numbers">
            ≈ ${(availableCoins * settings.coinPriceUsd).toFixed(2)} USD
          </span>
        </div>

        {/* Total Deposited */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-emerald-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Deposited
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono-numbers">
              ${totalDeposited.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Lifetime Top-ups</span>
        </div>

        {/* Total Spent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-purple-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Spent
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-200 font-mono-numbers">
              {totalSpent}
            </span>
            <span className="text-xs text-purple-400 font-bold font-mono">Coins</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono-numbers">
            ≈ ${(totalSpent * settings.coinPriceUsd).toFixed(2)} USD (Dyno Fees)
          </span>
        </div>

        {/* Total Transactions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-[#3989E8]/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Transactions
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#3989E8]/15 border border-[#3989E8]/25 flex items-center justify-center text-[#3989E8]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {totalTransactionsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">records</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Audited Ledger</span>
        </div>
      </div>

      {/* Accepted Payment Provider Channels Banner */}
      <div className="p-4 bg-[#10131B] rounded-2xl border border-[#1E2536] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">Supported Payment Gateways</span>
          <p className="text-[11px] text-slate-400">
            Instant automatic clearance for Visa, Mastercard, Paystack, Binance Pay, and USDT Crypto.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg bg-[#0A0D15] border border-[#1E2536] text-[11px] font-bold text-slate-300">
            💳 Visa & Mastercard
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0A0D15] border border-[#1E2536] text-[11px] font-bold text-emerald-400">
            ⚡ Paystack (Africa)
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0A0D15] border border-[#1E2536] text-[11px] font-bold text-amber-400">
            🟡 Binance Pay
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0A0D15] border border-[#1E2536] text-[11px] font-bold text-[#3989E8]">
            ₮ USDT TRC-20
          </span>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Transaction History</h2>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredTransactions.length} records)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tx ID, description..."
                className="bg-[#10131B] border border-[#1E2536] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3989E8]"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center p-0.5 bg-[#10131B] border border-[#1E2536] rounded-xl text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'all' ? 'bg-[#3989E8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('deposits')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'deposits' ? 'bg-[#3989E8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveFilter('charges')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'charges' ? 'bg-[#3989E8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dyno Charges
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0D15] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E2536]">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Type & Details</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161C2C]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No transaction history found for this view.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-[#151A26] transition-colors">
                        {/* ID with copy */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                          <button
                            onClick={() => handleCopyTx(tx.id)}
                            className="flex items-center gap-1.5 hover:text-[#3989E8] transition-colors group"
                            title="Copy Transaction ID"
                          >
                            <span>{tx.id}</span>
                            <Copy className="w-3 h-3 text-slate-600 group-hover:text-[#3989E8]" />
                          </button>
                        </td>

                        {/* Description */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block truncate max-w-xs">
                            {tx.description}
                          </span>
                          {tx.txHash && (
                            <span className="font-mono text-[10px] text-slate-500 truncate block max-w-xs">
                              Hash: {tx.txHash}
                            </span>
                          )}
                        </td>

                        {/* Payment method */}
                        <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                          {tx.method}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                          {tx.date}
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-right whitespace-nowrap font-mono-numbers">
                          <span
                            className={`font-bold ${
                              isPositive ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {tx.amount} Coins
                          </span>
                          <span className="block text-[10px] text-slate-500 font-normal">
                            ${tx.amountUsd.toFixed(2)} USD
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              tx.status === 'successful'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : tx.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {tx.status === 'successful' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : tx.status === 'pending' ? (
                              <Clock className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
