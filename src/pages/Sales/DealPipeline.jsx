import React, { useMemo, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  FolderKanban,
  Activity,
  Star,
  UserMinus,
  Users,
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

/* =======================
   PIPELINE STAGES
======================= */
const stages = [
  "New",
  "Proposal Sent",
  "Negotiation",
  "Final Discussion",
  "Won",
  "Lost",
];

const stageColors = {
  "New": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Proposal Sent": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Negotiation": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Final Discussion": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Won": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Lost": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  dealName: "",
  client: "",
  value: "",
  closeDate: "",
  stage: "New",
};

const ManageDealPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = deals.length;
    const active = deals.filter(
      (d) => !["Won", "Lost"].includes(d.stage)
    ).length;
    const won = deals.filter((d) => d.stage === "Won").length;
    const lost = deals.filter((d) => d.stage === "Lost").length;
    const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

    return { total, active, won, lost, totalValue };
  }, [deals]);

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch = 
        deal.dealName?.toLowerCase().includes(search.toLowerCase()) ||
        deal.client?.toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter === "ALL" || deal.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [deals, search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / entries);
  const paginated = filtered.slice(
    (page - 1) * entries,
    page * entries
  );

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setDeals((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
      );
    } else {
      setDeals([{ id: Date.now(), ...form }, ...deals]);
    }

    setForm(emptyForm);
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (deal) => {
    setForm(deal);
    setEditId(deal.id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleStageChange = (id, stage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage } : d))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Deal Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track and manage your sales pipeline
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setEditId(null);
              setOpen(!open);
            }}
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Deal
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Deals", value: stats.total, icon: Users, color: "from-blue-500 to-cyan-500" },
            { label: "Active Deals", value: stats.active, icon: Activity, color: "from-emerald-500 to-teal-500" },
            { label: "Won Deals", value: stats.won, icon: Star, color: "from-amber-500 to-orange-500" },
            { label: "Pipeline Value", value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: "from-purple-500 to-pink-500" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${s.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">{s.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${s.color} rounded-xl opacity-80`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ADDITIONAL STATS ROW */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Won Deals</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.won}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Lost Deals</p>
            <p className="text-2xl font-bold text-rose-400">{stats.lost}</p>
          </div>
        </div>

        {/* FORM MODAL */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {editId ? "Edit Deal" : "Add New Deal"}
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Deal Name *</label>
                      <input
                        name="dealName"
                        value={form.dealName}
                        onChange={handleChange}
                        placeholder="e.g., Enterprise Deal"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Client Name *</label>
                      <input
                        name="client"
                        value={form.client}
                        onChange={handleChange}
                        placeholder="e.g., Acme Corp"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Deal Value ($) *</label>
                      <input
                        name="value"
                        type="number"
                        value={form.value}
                        onChange={handleChange}
                        placeholder="e.g., 50000"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Close Date *</label>
                      <input
                        type="date"
                        name="closeDate"
                        value={form.closeDate}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Stage</label>
                      <select
                        name="stage"
                        value={form.stage}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      >
                        {stages.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      {editId ? "Update Deal" : "Save Deal"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-sm">Show</span>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(+e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">entries</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search deals..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
            >
              <option value="ALL">All Stages</option>
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* DEALS TABLE */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  {[
                    "Deal Name",
                    "Client",
                    "Value",
                    "Close Date",
                    "Stage",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                <AnimatePresence>
                  {paginated.length > 0 ? (
                    paginated.map((deal) => (
                      <motion.tr
                        key={deal.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-white whitespace-nowrap">
                            {deal.dealName}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-300 whitespace-nowrap">
                          {deal.client}
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-mono text-emerald-400 whitespace-nowrap">
                            ${Number(deal.value).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-300 whitespace-nowrap">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {new Date(deal.closeDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleStageChange(deal.id, e.target.value)}
                            className={twMerge(
                              "px-3 py-1.5 text-xs rounded-full border bg-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-purple-500/30",
                              stageColors[deal.stage]
                            )}
                          >
                            {stages.map((s) => (
                              <option key={s} value={s} className="bg-slate-900 text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(deal)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group/tooltip relative"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-300" />
                            </button>

                            <button
                              onClick={() => handleStageChange(deal.id, "Won")}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-emerald-500/20 transition-colors group/tooltip relative"
                              title="Mark as Won"
                            >
                              <Star className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
                            </button>

                            <button
                              onClick={() => handleStageChange(deal.id, "Lost")}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-rose-500/20 transition-colors group/tooltip relative"
                              title="Mark as Lost"
                            >
                              <UserMinus className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
                            </button>

                            <button
                              onClick={() => handleDelete(deal.id)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-rose-500/20 transition-colors group/tooltip relative"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <FolderKanban className="w-12 h-12 text-slate-600" />
                          <p className="text-lg font-medium">No deals found</p>
                          <p className="text-sm text-slate-500">Add your first deal to get started</p>
                          <button
                            onClick={() => {
                              setForm(emptyForm);
                              setEditId(null);
                              setOpen(true);
                            }}
                            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                          >
                            Add Deal
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filtered.length > 0 && (
            <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                Showing {(page - 1) * entries + 1} to{" "}
                {Math.min(page * entries, filtered.length)} of {filtered.length} deals
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={twMerge(
                    "p-2 rounded-lg border transition-colors",
                    page === 1 
                      ? "border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed" 
                      : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={twMerge(
                      "px-3 py-1 rounded-lg text-sm transition-colors",
                      page === i + 1
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={twMerge(
                    "p-2 rounded-lg border transition-colors",
                    page === totalPages 
                      ? "border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed" 
                      : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PIPELINE SUMMARY */}
        {deals.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Pipeline Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stages.map((stage) => {
                const stageDeals = deals.filter(d => d.stage === stage);
                const stageValue = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
                
                return (
                  <div key={stage} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <p className="text-xs text-slate-400 mb-1">{stage}</p>
                    <p className="text-lg font-bold text-white">{stageDeals.length}</p>
                    <p className="text-xs text-slate-500 mt-1">${stageValue.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageDealPipeline;