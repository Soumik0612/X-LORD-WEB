import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Users,
  Bot as BotIcon,
  Layers,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Coins,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Play,
  Square,
  RotateCw,
  Sliders,
  Send,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    bots,
    templates,
    transactions,
    settings,
    nodes,
    addCoinsToUser,
    toggleUserBlock,
    deleteUser,
    approveTransaction,
    rejectTransaction,
    createTemplate,
    deleteTemplate,
    updateSettings,
    broadcastNotification,
    startBot,
    stopBot,
    restartBot,
    deleteBot,
    openBotManageModal,
    setActiveTab,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'users' | 'bots' | 'templates' | 'transactions' | 'settings'
  >('users');

  // Coin modal state
  const [coinModalUser, setCoinModalUser] = useState<string | null>(null);
  const [coinAdjustmentAmount, setCoinAdjustmentAmount] = useState<number>(50);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New Template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'WhatsApp MD' as const,
    description: '',
    hostingPlan: 'Pro Dyno (5 Coins/mo)' as const,
    planPriceCoins: 5,
    githubUrl: '',
    version: 'v1.0.0',
    author: 'X Lord Team',
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isSubAdmin = currentUser?.role === 'sub_admin';

  if (!isSuperAdmin && !isSubAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
        <Shield className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You need Super Admin or Sub Admin credentials to access the X LORD BOT MANAGEMENT administration portal.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-[#3989E8] text-white text-xs font-bold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleApplyCoins = () => {
    if (coinModalUser && coinAdjustmentAmount) {
      addCoinsToUser(coinModalUser, coinAdjustmentAmount);
      setCoinModalUser(null);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    broadcastNotification(broadcastTitle, broadcastMsg);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSent(false), 2500);
  };

  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.description) return;
    createTemplate({
      ...newTemplate,
      deploymentCount: 0,
      isFeatured: false,
      image: '/src/assets/images/template_cyphorx_1793512705802.jpg',
      defaultEnv: {
        SESSION_ID: 'SESSION;;;creds==',
        PREFIX: '.',
        OWNER_NUMBER: '1234567890',
      },
    });
    alert(`Template "${newTemplate.name}" created and added to the marketplace!`);
    setNewTemplate({
      name: '',
      category: 'WhatsApp MD',
      description: '',
      hostingPlan: 'Pro Dyno (5 Coins/mo)',
      planPriceCoins: 5,
      githubUrl: '',
      version: 'v1.0.0',
      author: 'X Lord Team',
    });
  };

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Admin Control Center
              </h1>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {isSuperAdmin ? 'Super Admin' : 'Sub Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Server-authoritative management over all users, dyno containers, marketplace templates, and deposit clearance.
            </p>
          </div>
        </div>

        {pendingTransactions.length > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>{pendingTransactions.length} Pending Deposits Awaiting Review</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#1E2536]">
        {[
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'bots', label: `All Bots (${bots.length})`, icon: BotIcon },
          { id: 'templates', label: `Templates (${templates.length})`, icon: Layers },
          { id: 'transactions', label: `Deposits & Ledger (${pendingTransactions.length} Pending)`, icon: CreditCard },
          { id: 'settings', label: 'Nodes & Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#151D2E] text-[#3989E8] border-b-2 border-[#3989E8]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Registered Platform Users
            </span>
            <span className="text-xs text-slate-500 font-mono">{users.length} accounts</span>
          </div>

          <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0D15] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E2536]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Coins Balance</th>
                    <th className="py-3 px-4">Deposited</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161C2C]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#151A26] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400 block">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            u.role === 'super_admin'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : u.role === 'sub_admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-[#151D2E] text-slate-300'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {u.coins} Coins
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        ${u.totalDeposited.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {u.isBlocked ? (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isSuperAdmin && (
                            <button
                              onClick={() => {
                                setCoinModalUser(u.id);
                                setCoinAdjustmentAmount(50);
                              }}
                              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 rounded-lg text-[11px] font-bold transition-colors"
                              title="Add / Remove Coins"
                            >
                              ± Coins
                            </button>
                          )}

                          <button
                            onClick={() => toggleUserBlock(u.id)}
                            className={`p-1.5 rounded-lg text-[11px] transition-colors ${
                              u.isBlocked
                                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                            }`}
                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          {isSuperAdmin && u.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                if (confirm(`Permanently delete account for "${u.name}"?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL BOTS MANAGEMENT */}
      {activeAdminTab === 'bots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              All Deployed Bot Dynos (System-Wide)
            </span>
            <span className="text-xs text-slate-500 font-mono">{bots.length} total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bots.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#10131B] border border-[#1E2536] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[160px]">{b.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'online'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    <span>Owner: <strong>{b.ownerName}</strong></span>
                    <span className="block text-slate-500 font-mono text-[10px] mt-0.5">
                      {b.id} · {b.templateName}
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-[#0A0D15] rounded-lg border border-[#1E2536] text-[11px] flex justify-between font-mono-numbers">
                  <span>CPU: {b.cpu}%</span>
                  <span>RAM: {b.ramMb} MB</span>
                  <span>Port: {b.port}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1E2536]">
                  <div className="flex gap-1">
                    {b.status === 'online' ? (
                      <button
                        onClick={() => stopBot(b.id)}
                        className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400"
                        title="Force Stop"
                      >
                        <Square className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startBot(b.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400"
                        title="Force Start"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => restartBot(b.id)}
                      className="p-1.5 rounded-lg bg-[#3989E8]/15 text-[#3989E8]"
                      title="Force Restart"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Emergency delete bot ${b.id}?`)) deleteBot(b.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                      title="Emergency Terminate"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => openBotManageModal(b)}
                    className="px-2.5 py-1 bg-[#151A26] hover:bg-[#1E273A] text-slate-200 text-xs font-bold rounded-lg border border-[#1E2536]"
                  >
                    Console &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATES MANAGEMENT */}
      {activeAdminTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create new template form */}
          <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Add Marketplace Template
            </h3>
            <form onSubmit={handleCreateTemplateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CYBER-MD PRO"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white"
                >
                  <option value="WhatsApp MD">WhatsApp MD</option>
                  <option value="Moderation">Moderation</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Discord">Discord</option>
                  <option value="Multi-Device">Multi-Device</option>
                  <option value="Music & Fun">Music & Fun</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Summary of features and engine..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Plan Price (Coins)</label>
                  <input
                    type="number"
                    value={newTemplate.planPriceCoins}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, planPriceCoins: Number(e.target.value) })
                    }
                    className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Version</label>
                  <input
                    type="text"
                    value={newTemplate.version}
                    onChange={(e) => setNewTemplate({ ...newTemplate, version: e.target.value })}
                    className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GitHub URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/xlord-host/..."
                  value={newTemplate.githubUrl}
                  onChange={(e) => setNewTemplate({ ...newTemplate, githubUrl: e.target.value })}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-[#3989E8]/20 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish to Marketplace</span>
              </button>
            </form>
          </div>

          {/* List of active templates */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Current Marketplace Catalog ({templates.length})
            </h3>
            <div className="space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-[#10131B] border border-[#1E2536] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={t.image} alt={t.name} className="w-12 h-10 object-cover rounded-lg border border-[#1E2536]" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{t.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">{t.description}</p>
                      <span className="text-[10px] text-[#3989E8] font-mono">{t.hostingPlan} · {t.deploymentCount} deploys</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove template "${t.name}" from marketplace?`)) {
                        deleteTemplate(t.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEPOSITS & TRANSACTIONS APPROVAL */}
      {activeAdminTab === 'transactions' && (
        <div className="space-y-5">
          {/* Pending Approval Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Pending USDT Crypto Deposits Awaiting Clearance
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {pendingTransactions.length} Pending
              </span>
            </div>

            {pendingTransactions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-[#10131B] rounded-xl border border-[#1E2536]">
                Zero pending deposits in queue. All payments reconciled!
              </div>
            ) : (
              <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0D15] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E2536]">
                    <tr>
                      <th className="py-3 px-4">TX ID</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Blockchain Hash</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161C2C]">
                    {pendingTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#151A26]">
                        <td className="py-3 px-4 font-mono font-bold text-white">{tx.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{tx.userName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{tx.userEmail}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          +{tx.amount} Coins (${tx.amountUsd} USD)
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300 max-w-xs truncate">
                          {tx.txHash || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approveTransaction(tx.id)}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => rejectTransaction(tx.id)}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: NODES & SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Infrastructure Nodes */}
          <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#3989E8]" /> Infrastructure Nodes (Pterodactyl Wings LXC)
            </h3>
            <div className="space-y-3">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2536] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{node.flag}</span>
                      <span>{node.name}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      {node.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-mono-numbers">
                    <div>CPU: <strong className="text-white">{node.cpuLoad}%</strong></div>
                    <div>RAM: <strong className="text-white">{node.memoryUsage}%</strong></div>
                    <div>Dynos: <strong className="text-emerald-400">{node.activeDynos}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Announcement System */}
          <div className="p-5 rounded-2xl bg-[#10131B] border border-[#1E2536] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#3989E8]" /> Broadcast Notification to All Users
            </h3>
            {broadcastSent && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
                Broadcast notification sent to all active sessions!
              </div>
            )}
            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Node Maintenance"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Message Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details for all bot masters..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-1.5 text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#3989E8] hover:bg-[#2563EB] text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Coin Adjustment Modal for Admin */}
      {coinModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" /> Adjust User Coins Balance
            </h3>
            <p className="text-xs text-slate-400">
              Enter positive value to add coins, or negative to deduct.
            </p>
            <input
              type="number"
              value={coinAdjustmentAmount}
              onChange={(e) => setCoinAdjustmentAmount(Number(e.target.value))}
              className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3.5 py-2 text-sm font-mono text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCoinModalUser(null)}
                className="px-3.5 py-1.5 bg-[#151A26] text-xs font-semibold text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCoins}
                className="px-4 py-1.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Apply Coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
