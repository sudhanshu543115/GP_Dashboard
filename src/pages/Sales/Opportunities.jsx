import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRightLeft,
  FolderKanban,
  Activity,
  Star,
  UserMinus,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

/* =======================
   STAGE COLORS
======================= */
const stageColors = {
  Prospecting: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Negotiation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Proposal Sent": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  opportunityName: "",
  client: "",
  expectedValue: "",
  probability: "",
  closeDate: "",
  stage: "Prospecting",
};

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState("ALL");

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === editId ? { ...o, ...form } : o))
      );
    } else {
      setOpportunities([{ id: Date.now(), ...form }, ...opportunities]);
    }

    setForm(emptyForm);
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (opp) => {
    setForm(opp);
    setEditId(opp.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleStageChange = (id, stage) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage } : o))
    );
  };

  const convertToProject = (opp) => {
    if (window.confirm(`Convert "${opp.opportunityName}" to project?`)) {
      setProjects((prev) => [
        {
          projectId: Date.now(),
          name: opp.opportunityName,
          client: opp.client,
          value: opp.expectedValue,
        },
        ...prev,
      ]);

      setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
    }
  };

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter(
      (o) => !["Won", "Lost"].includes(o.stage)
    ).length;
    const won = opportunities.filter((o) => o.stage === "Won").length;
    const lost = opportunities.filter((o) => o.stage === "Lost").length;
    const totalValue = opportunities.reduce((sum, o) => sum + (Number(o.expectedValue) || 0), 0);
    const converted = projects.length;

    return { total, active, won, lost, totalValue, converted };
  }, [opportunities, projects]);

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchesSearch = Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter === "ALL" || o.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [opportunities, search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / entries);
  const paginated = filtered.slice(
    (page - 1) * entries,
    page * entries
  );

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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Opportunity Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track and manage your sales pipeline
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Opportunity
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Opportunities", value: stats.total, icon: Users, color: "from-blue-500 to-cyan-500" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Converted to Projects</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.converted}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Lost Deals</p>
            <p className="text-2xl font-bold text-rose-400">{stats.lost}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 col-span-2 md:col-span-1">
            <p className="text-xs text-slate-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-blue-400">
              {stats.total ? Math.round((stats.won / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editId ? "Edit Opportunity" : "Add New Opportunity"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Opportunity Name</label>
                  <input
                    name="opportunityName"
                    value={form.opportunityName}
                    onChange={handleChange}
                    placeholder="e.g., Enterprise Deal"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Client Name</label>
                  <input
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    placeholder="e.g., Acme Corp"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Expected Value ($)</label>
                  <input
                    name="expectedValue"
                    type="number"
                    value={form.expectedValue}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Probability (%)</label>
                  <input
                    name="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={form.probability}
                    onChange={handleChange}
                    placeholder="e.g., 75"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Close Date</label>
                  <input
                    type="date"
                    name="closeDate"
                    value={form.closeDate}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Stage</label>
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  >
                    {Object.keys(stageColors).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  {editId ? "Update Opportunity" : "Save Opportunity"}
                </button>
              </div>
            </motion.form>
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
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
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
                placeholder="Search opportunities..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
            >
              <option value="ALL">All Stages</option>
              {Object.keys(stageColors).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  {[
                    "Opportunity",
                    "Client",
                    "Value",
                    "Probability",
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
                    paginated.map((opp) => (
                      <motion.tr
                        key={opp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-white whitespace-nowrap">
                            {opp.opportunityName}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-300 whitespace-nowrap">
                          {opp.client}
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-mono text-emerald-400 whitespace-nowrap">
                            ${Number(opp.expectedValue).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: `${Math.min(opp.probability, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-blue-400 whitespace-nowrap">
                              {opp.probability}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-300 whitespace-nowrap">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {new Date(opp.closeDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={opp.stage}
                            onChange={(e) => handleStageChange(opp.id, e.target.value)}
                            className={twMerge(
                              "px-3 py-1.5 text-xs rounded-full border bg-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/30",
                              stageColors[opp.stage]
                            )}
                          >
                            {Object.keys(stageColors).map((s) => (
                              <option key={s} value={s} className="bg-slate-900 text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(opp)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group/tooltip relative"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-300" />
                            </button>
                            <button
                              onClick={() => handleDelete(opp.id)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-rose-500/20 transition-colors group/tooltip relative"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
                            </button>
                            <button
                              onClick={() => convertToProject(opp)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-emerald-500/20 transition-colors group/tooltip relative"
                              title="Convert to Project"
                            >
                              <FolderKanban className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <FolderKanban className="w-12 h-12 text-slate-600" />
                          <p className="text-lg font-medium">No opportunities found</p>
                          <p className="text-sm text-slate-500">Add your first opportunity to get started</p>
                          <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                          >
                            Add Opportunity
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          {filtered.length > 0 && (
            <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                Showing {(page - 1) * entries + 1} to{" "}
                {Math.min(page * entries, filtered.length)} of {filtered.length} opportunities
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
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
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

        {/* PROJECTS CONVERTED SECTION */}
        {projects.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-400" />
              Converted Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.projectId} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h3 className="font-medium text-white">{project.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{project.client}</p>
                  <p className="text-sm text-emerald-400 mt-2">${Number(project.value).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageOpportunities;