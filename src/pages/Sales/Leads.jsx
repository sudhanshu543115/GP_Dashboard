import React, { useMemo, useState } from "react";

import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRightLeft,
  Globe,
  Users,
  Activity,
  Star,
  UserMinus,
  MessageCircle,
  Instagram,
  Linkedin,
  Facebook,
  Calendar,
  Mail,
  Phone,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {
  useAddLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
} from "../../redux/api/leadsApiSlice";
import { toast } from "../../utils/toast";

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const SOURCE_OPTIONS = ["Website", "Whatsapp", "Facebook", "Instagram", "LinkedIn", "Google Ads"];

const statusColors = {
  "New": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Contacted": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Qualified": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Converted": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Lost": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const sourceIcons = {
  "Website": Globe,
  "Whatsapp": MessageCircle,
  "Facebook": Facebook,
  "Instagram": Instagram,
  "LinkedIn": Linkedin,
  "Google Ads": Search,
};

const sourceColors = {
  "Website": "text-blue-400",
  "Whatsapp": "text-green-400",
  "Facebook": "text-indigo-400",
  "Instagram": "text-pink-400",
  "LinkedIn": "text-sky-400",
  "Google Ads": "text-yellow-400",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  interestedIn: "",
  date: "",
};

const toApiStatus = (status) => String(status || "new").toLowerCase();
const toApiSource = (source) => String(source || "website").toLowerCase();

const toUiStatus = (status) => {
  const value = String(status || "new").toLowerCase();
  if (value === "contacted") return "Contacted";
  if (value === "qualified") return "Qualified";
  if (value === "converted") return "Converted";
  if (value === "lost") return "Lost";
  return "New";
};

const toUiSource = (source) => {
  const value = String(source || "").toLowerCase();
  if (value === "whatsapp") return "Whatsapp";
  if (value === "facebook") return "Facebook";
  if (value === "instagram") return "Instagram";
  if (value === "linkedin") return "LinkedIn";
  if (value === "google ads") return "Google Ads";
  return "Website";
};

const ManageLeads = () => {
  const { data: rawLeads = [], isLoading, isError, error, refetch } = useGetLeadsQuery();
  const [addLead, { isLoading: isAdding }] = useAddLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [updateLeadStatus, { isLoading: isUpdatingStatus }] = useUpdateLeadStatusMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [form, setForm] = useState(emptyForm);
  const [isDarkMode] = useState(true);

  const leads = useMemo(
    () =>
      (Array.isArray(rawLeads) ? rawLeads : []).map((lead) => ({
        id: lead._id,
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        source: toUiSource(lead.source),
        status: toUiStatus(lead.status),
        interestedIn: lead.interestedIn || "",
        date: lead.createdAt || lead.updatedAt || new Date().toISOString(),
      })),
    [rawLeads]
  );

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.interestedIn.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "ALL" || lead.status.toLowerCase() === selectedStatus.toLowerCase();
      
      const matchesSource =
        selectedSource === "ALL" || lead.source === selectedSource;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, selectedStatus, selectedSource]);

  const paginatedLeads = useMemo(
    () => filteredLeads.slice((page - 1) * entries, page * entries),
    [filteredLeads, page, entries]
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (lead) => {
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      interestedIn: lead.interestedIn,
      date: lead.date ? new Date(lead.date).toISOString().slice(0, 10) : "",
    });
    setEditId(lead.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this lead?");
    if (!ok) return;
    try {
      await deleteLead(id).unwrap();
      toast.success("Lead deleted successfully");
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete lead");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: toApiStatus(form.status),
      source: toApiSource(form.source),
      interestedIn: form.interestedIn,
    };

    try {
      if (editId) {
        await updateLead({ id: editId, data: payload }).unwrap();
        toast.success("Lead updated successfully");
      } else {
        await addLead(payload).unwrap();
        toast.success("Lead added successfully");
      }
      setIsFormOpen(false);
      setEditId(null);
      setForm(emptyForm);
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save lead");
    }
  };

  const handleCopy = (lead) => {
    const text = `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nSource: ${lead.source}\nStatus: ${lead.status}\nInterested: ${lead.interestedIn}`;
    navigator.clipboard.writeText(text);
    toast.success("Lead copied to clipboard");
  };

  const handleConvertToClient = async (lead) => {
    try {
      await updateLeadStatus({ id: lead.id, status: "converted" }).unwrap();
      toast.success("Lead converted to client");
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to convert lead");
    }
  };

  const handleStatusChange = async (lead, value) => {
    try {
      await updateLeadStatus({ id: lead.id, status: toApiStatus(value) }).unwrap();
      toast.success(`Status updated to ${value}`);
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const getSourceIcon = (source) => {
    const Icon = sourceIcons[source] || Globe;
    return <Icon className={twMerge("w-4", sourceColors[source] || "text-gray-400")} />;
  };

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((l) => l.status === "New").length,
      contacted: leads.filter((l) => l.status === "Contacted").length,
      qualified: leads.filter((l) => l.status === "Qualified").length,
      converted: leads.filter((l) => l.status === "Converted").length,
      lost: leads.filter((l) => l.status === "Lost").length,
    }),
    [leads]
  );

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / entries));

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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track and manage your sales leads
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setEditId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New Lead
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "from-blue-500 to-cyan-500" },
            { label: "New", value: stats.new, icon: Activity, color: "from-blue-500 to-indigo-500" },
            { label: "Contacted", value: stats.contacted, icon: MessageCircle, color: "from-purple-500 to-pink-500" },
            { label: "Qualified", value: stats.qualified, icon: CheckCircle, color: "from-amber-500 to-orange-500" },
            { label: "Converted", value: stats.converted, icon: Star, color: "from-emerald-500 to-teal-500" },
            { label: "Lost", value: stats.lost, icon: XCircle, color: "from-rose-500 to-pink-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs">{stat.label}</p>
                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg opacity-80`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FORM MODAL */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {editId ? "Edit Lead" : "Add New Lead"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g., John Doe"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Project Interested</label>
                      <input
                        name="interestedIn"
                        value={form.interestedIn}
                        onChange={handleChange}
                        placeholder="e.g., Web Development"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Source</label>
                      <select
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      >
                        {SOURCE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding || isUpdating}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding || isUpdating ? "Saving..." : editId ? "Update Lead" : "Save Lead"}
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
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">entries</span>
          </div>

          <div className="flex gap-2 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search leads..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
            >
              <option value="ALL">All Status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
            >
              <option value="ALL">All Sources</option>
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  {[
                    "Name",
                    "Contact",
                    "Source",
                    "Interest",
                    "Status",
                    "Date",
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
                  {!isLoading && !isError && paginatedLeads.length > 0 ? (
                    paginatedLeads.map((lead) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-white whitespace-nowrap">
                            {lead.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{lead.email}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-300 whitespace-nowrap">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {lead.phone || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {getSourceIcon(lead.source)}
                            <span className="text-xs text-slate-300">{lead.source}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-300 whitespace-nowrap">
                          {lead.interestedIn || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead, e.target.value)}
                            disabled={isUpdatingStatus}
                            className={twMerge(
                              "px-3 py-1.5 text-xs rounded-full border bg-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50",
                              statusColors[lead.status]
                            )}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate-900 text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-300 whitespace-nowrap">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {lead.date ? new Date(lead.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(lead)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group/tooltip relative"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-300" />
                            </button>

                            <button
                              onClick={() => handleCopy(lead)}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group/tooltip relative"
                              title="Copy"
                            >
                              <Copy className="w-4 h-4 text-slate-300" />
                            </button>

                            <button
                              onClick={() => handleConvertToClient(lead)}
                              className="p-1.5 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30 transition-colors group/tooltip relative"
                              title="Convert to Client"
                            >
                              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                            </button>

                            <button
                              onClick={() => handleDelete(lead.id)}
                              disabled={isDeleting}
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-rose-500/20 transition-colors group/tooltip relative disabled:opacity-50"
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
                      <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-lg font-medium">Loading leads...</p>
                          </div>
                        ) : isError ? (
                          <div className="flex flex-col items-center gap-3">
                            <XCircle className="w-12 h-12 text-rose-400" />
                            <p className="text-lg font-medium text-rose-400">Error loading leads</p>
                            <p className="text-sm text-slate-500">{error?.data?.message || "Failed to fetch leads"}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-12 h-12 text-slate-600" />
                            <p className="text-lg font-medium">No leads found</p>
                            <p className="text-sm text-slate-500">
                              {search || selectedStatus !== 'ALL' || selectedSource !== 'ALL'
                                ? 'Try adjusting your search or filters'
                                : 'Add your first lead to get started'}
                            </p>
                            {!search && selectedStatus === 'ALL' && selectedSource === 'ALL' && (
                              <button
                                onClick={() => {
                                  setForm(emptyForm);
                                  setEditId(null);
                                  setIsFormOpen(true);
                                }}
                                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                              >
                                Add Lead
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!isLoading && !isError && filteredLeads.length > 0 && (
            <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                Showing {(page - 1) * entries + 1} to{" "}
                {Math.min(page * entries, filteredLeads.length)} of {filteredLeads.length} leads
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
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
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

        {/* SOURCE DISTRIBUTION */}
        {leads.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Lead Sources</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SOURCE_OPTIONS.map((source) => {
                const count = leads.filter(l => l.source === source).length;
                const percentage = leads.length ? Math.round((count / leads.length) * 100) : 0;
                
                return (
                  <div key={source} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      {getSourceIcon(source)}
                      <span className="text-xs text-slate-400">{source}</span>
                    </div>
                    <p className="text-lg font-bold text-white">{count}</p>
                    <p className="text-xs text-slate-500">{percentage}%</p>
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

export default ManageLeads;