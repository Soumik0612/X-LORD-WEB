import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Template } from '../types';
import {
  Search,
  Zap,
  Github,
  Key,
  Flame,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const TemplatesView: React.FC = () => {
  const { templates, openDeployModal, openPairCodeModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'All',
    'Moderation',
    'WhatsApp MD',
    'Telegram',
    'Discord',
    'Multi-Device',
    'Music & Fun',
  ];

  const filteredTemplates = templates.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || tmpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner matching Screenshot 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#161C2C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#3989E8]/20 text-[#3989E8]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3989E8]">
              Verified Cloud Repositories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Bot Templates Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            One-click deploy pre-configured Node.js, WhatsApp Baileys MD, Telegram, and Discord bots with automatic environment variable setups.
          </p>
        </div>

        {/* Global Deploy count */}
        <div className="flex items-center gap-2 p-3 bg-[#10131B] border border-[#1E2536] rounded-xl self-start md:self-auto">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-white block">24,000+ Deploys</span>
            <span className="text-[10px] text-slate-400 block">Tested on Node 22 LXC</span>
          </div>
        </div>
      </div>

      {/* Filter and Category Strip */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search templates (e.g. ARCEUS, WOLFBOT, KETH)..."
            className="w-full bg-[#10131B] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3989E8] transition-colors"
          />
        </div>

        {/* Category Pills/Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#3989E8] text-white shadow-md shadow-[#3989E8]/20'
                  : 'bg-[#10131B] border border-[#1E2536] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      {paginatedTemplates.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#10131B] border border-[#1E2536] text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Templates Found</h3>
          <p className="text-xs text-slate-400">Try selecting "All" or clearing search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl bg-[#10131B] border border-[#1E2536] hover:border-[#3989E8]/40 transition-all flex flex-col justify-between overflow-hidden shadow-sm group"
            >
              <div>
                {/* Banner Image with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0A0D15]">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10131B] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    {template.isFeatured ? (
                      <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Flame className="w-3 h-3 fill-black" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-[10px] bg-black/60 backdrop-blur-md text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-white/10">
                        {template.category}
                      </span>
                    )}

                    <span className="text-[10px] bg-[#0A0D15]/80 backdrop-blur-md text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {template.hostingPlan}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono text-[10px] text-slate-400">{template.version}</span>
                    <span className="font-mono-numbers text-white font-semibold">
                      {template.deploymentCount.toLocaleString()} deploys
                    </span>
                  </div>
                </div>

                {/* Template Content */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#3989E8] transition-colors">
                      {template.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">by {template.author}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Featured on X LORD BOT MANAGEMENT badge */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#3989E8] bg-[#3989E8]/10 px-2 py-0.5 rounded-md border border-[#3989E8]/20">
                      <ShieldCheck className="w-3 h-3" />
                      Featured on X LORD BOT MANAGEMENT
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Deploy, GitHub, Pair matching Screenshot 3 */}
              <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                {/* Deploy Button */}
                <button
                  onClick={() => openDeployModal(template)}
                  className="py-2 px-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#3989E8]/20 transition-all active:scale-95"
                  title="Deploy this bot instance"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Deploy</span>
                </button>

                {/* GitHub Button */}
                <a
                  href={template.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-2 bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  title="View GitHub repository"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                {/* Pair Code Button */}
                <button
                  onClick={() => openPairCodeModal(template)}
                  className="py-2 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  title="Generate 8-digit WhatsApp pairing code"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Pair</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl bg-[#10131B] border border-[#1E2536] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-300 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl bg-[#10131B] border border-[#1E2536] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
