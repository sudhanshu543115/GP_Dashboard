import React, { useMemo, useState } from "react";
import {
  Plus,
  Wallet,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  TrendingUp,
  Eye,
  RefreshCw,
  IndianRupee,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

import {
  useGetCentersQuery,
  useAddSecurityDepositMutation,
  useUpdateSecurityDepositMutation,
  useDeleteSecurityDepositMutation,
} from "../../redux/api/centerApiSlice";
import { toast } from "../../utils/toast";

/* =========================
   STATUS COLORS & OPTIONS
========================= */
const STATUS_OPTIONS = ["HELD", "PARTIAL", "REFUNDED"];

const statusColors = {
  HELD: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  REFUNDED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PARTIAL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusIcons = {
  HELD: AlertCircle,
  REFUNDED: CheckCircle,
  PARTIAL: RefreshCw,
};

const statusLabels = {
  HELD: "Held",
  REFUNDED: "Refunded",
  PARTIAL: "Partial",
};

const SecurityDeposit = () => {
  /* =========================
     API CALLS
  ========================= */
  const {
    data: centersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetCentersQuery();

  // ✅ FIXED: correct response path
  const centers = centersData?.message?.centers || [];

  const [addDeposit, { isLoading: addingDeposit }] = useAddSecurityDepositMutation();
  const [updateDeposit, { isLoading: updatingDeposit }] = useUpdateSecurityDepositMutation();
  const [deleteDeposit, { isLoading: deletingDeposit }] = useDeleteSecurityDepositMutation();

  /* =========================
     LOCAL STATE
  ========================= */
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [amount, setAmount] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("HELD");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingDepositId, setEditingDepositId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [expandedCenter, setExpandedCenter] = useState(null);

  /* =========================
     SELECTED CENTER
  ========================= */
  const selectedCenter = useMemo(() => {
    return centers.find((c) => c._id === selectedCenterId);
  }, [selectedCenterId, centers]);

  /* =========================
     CALCULATIONS
  ========================= */
  const totalHeldDeposit = useMemo(() => {
    if (!selectedCenter?.securityDeposits?.length) return 0;

    return selectedCenter.securityDeposits.reduce((sum, d) => {
      return d.status === "HELD" || d.status === "PARTIAL"
        ? sum + d.amount
        : sum;
    }, 0);
  }, [selectedCenter]);

  const totalRefundedDeposit = useMemo(() => {
    if (!selectedCenter?.securityDeposits?.length) return 0;

    return selectedCenter.securityDeposits.reduce((sum, d) => {
      return d.status === "REFUNDED" ? sum + d.amount : sum;
    }, 0);
  }, [selectedCenter]);

  const centerStats = useMemo(() => {
    return centers.map(center => {
      const deposits = center.securityDeposits || [];
      const held = deposits.filter(d => d.status === "HELD").reduce((sum, d) => sum + d.amount, 0);
      const partial = deposits.filter(d => d.status === "PARTIAL").reduce((sum, d) => sum + d.amount, 0);
      const refunded = deposits.filter(d => d.status === "REFUNDED").reduce((sum, d) => sum + d.amount, 0);
      
      return {
        ...center,
        totalHeld: held + partial,
        totalRefunded: refunded,
        totalDeposits: held + partial + refunded,
        count: deposits.length,
      };
    });
  }, [centers]);

  const filteredCenters = useMemo(() => {
    const query = search.toLowerCase();
    return centerStats.filter(center => 
      center.name?.toLowerCase().includes(query) ||
      center.location?.toLowerCase().includes(query)
    );
  }, [centerStats, search]);

  /* =========================
     ADD/EDIT DEPOSIT
  ========================= */
  const handleOpenModal = (centerId = "", deposit = null) => {
    if (deposit) {
      // Edit mode
      setEditMode(true);
      setEditingDepositId(deposit._id);
      setAmount(deposit.amount.toString());
      setDepositDate(new Date(deposit.depositDate).toISOString().split('T')[0]);
      setSelectedStatus(deposit.status);
      setSelectedCenterId(centerId);
    } else {
      // Add mode
      setEditMode(false);
      setEditingDepositId(null);
      setAmount("");
      setDepositDate(new Date().toISOString().split('T')[0]);
      setSelectedStatus("HELD");
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!amount || !selectedCenterId || !depositDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editMode && editingDepositId) {
        // Update existing deposit
        await updateDeposit({
          centerId: selectedCenterId,
          depositId: editingDepositId,
          data: {
            amount: Number(amount),
            depositDate: new Date(depositDate),
            status: selectedStatus,
          },
        }).unwrap();
        toast.success("Deposit updated successfully");
      } else {
        // Add new deposit
        await addDeposit({
          centerId: selectedCenterId,
          data: {
            amount: Number(amount),
            depositDate: new Date(depositDate),
            status: selectedStatus,
          },
        }).unwrap();
        toast.success("Deposit added successfully");
      }

      setAmount("");
      setDepositDate("");
      setSelectedStatus("HELD");
      setEditMode(false);
      setEditingDepositId(null);
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save deposit");
    }
  };

  const handleDeleteDeposit = async (centerId, depositId) => {
    if (!window.confirm("Are you sure you want to delete this deposit?")) return;

    try {
      await deleteDeposit({ centerId, depositId }).unwrap();
      toast.success("Deposit deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete deposit");
    }
  };

  /* =========================
     RENDER
  ========================= */
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Security Deposits
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage held, partial, and refunded deposits across all centers
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors">
              <Download className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {(isLoading || isFetching) && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-slate-400">Loading centers and deposits...</p>
            </div>
          </div>
        )}

        {/* CENTERS OVERVIEW CARDS */}
        {!isLoading && centers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {centers.slice(0, 3).map((center, idx) => {
              const deposits = center.securityDeposits || [];
              const heldAmount = deposits.filter(d => d.status === "HELD" || d.status === "PARTIAL").reduce((sum, d) => sum + d.amount, 0);
              
              return (
                <motion.div
                  key={center._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedCenterId(center._id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
                  <div className={twMerge(
                    "relative bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 overflow-hidden transition-all",
                    selectedCenterId === center._id 
                      ? "border-amber-500/50 bg-amber-500/5" 
                      : "border-slate-700 hover:border-amber-500/30"
                  )}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{center.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{center.location || "Location not set"}</p>
                      </div>
                      <Building className="w-5 h-5 text-amber-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Held:</span>
                        <span className="text-amber-400 font-semibold">₹{heldAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Deposits:</span>
                        <span className="text-white">{deposits.length}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <button 
                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCenterId(center._id);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CENTER SELECT & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
            <Building className="w-4 h-4 text-slate-500" />
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none flex-1 md:w-64"
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
            >
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.name} {center.location ? `- ${center.location}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search centers..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>
            
            <button 
              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
              className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* CENTER DETAILS SECTION */}
        {selectedCenter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* CENTER HEADER */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCenter.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedCenter.location || "Location not set"}</p>
                </div>
                
                <button
                  onClick={() => handleOpenModal(selectedCenterId)}
                  className="group relative px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Add Deposit
                </button>
              </div>

              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 mt-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Wallet className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Held</p>
                      <p className="text-xl font-bold text-amber-400">₹{totalHeldDeposit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Refunded</p>
                      <p className="text-xl font-bold text-emerald-400">₹{totalRefundedDeposit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Entries</p>
                      <p className="text-xl font-bold text-white">{selectedCenter.securityDeposits?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Avg Deposit</p>
                      <p className="text-xl font-bold text-purple-400">
                        ₹{selectedCenter.securityDeposits?.length 
                          ? (selectedCenter.securityDeposits.reduce((sum, d) => sum + d.amount, 0) / selectedCenter.securityDeposits.length).toFixed(0)
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DEPOSITS TABLE */}
           {/* DEPOSITS LIST */}
{selectedCenter.securityDeposits?.length > 0 ? (
  <>
    {/* Desktop Table */}
    <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="px-4 py-4 text-left text-xs text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-4 text-left text-xs text-slate-400 uppercase">Date</th>
              <th className="px-4 py-4 text-left text-xs text-slate-400 uppercase">Status</th>
              <th className="px-4 py-4 text-left text-xs text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {selectedCenter.securityDeposits.map((deposit) => {
              const StatusIcon = statusIcons[deposit.status] || Wallet;
              return (
                <tr key={deposit._id} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-4 text-amber-400 font-semibold">
                    ₹{deposit.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {new Date(deposit.depositDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={twMerge(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border",
                      statusColors[deposit.status]
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {statusLabels[deposit.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <button
                      onClick={() => handleOpenModal(selectedCenterId, deposit)}
                      className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600"
                    >
                      <Edit className="w-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteDeposit(selectedCenterId, deposit._id)}
                      className="p-1.5 bg-slate-700 rounded-lg hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-4 text-rose-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile Cards */}
    <div className="md:hidden space-y-4">
      {selectedCenter.securityDeposits.map((deposit) => {
        const StatusIcon = statusIcons[deposit.status] || Wallet;
        return (
          <div
            key={deposit._id}
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-lg font-bold text-amber-400">
                ₹{deposit.amount.toLocaleString()}
              </span>
              <span className={twMerge(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border",
                statusColors[deposit.status]
              )}>
                <StatusIcon className="w-3 h-3" />
                {statusLabels[deposit.status]}
              </span>
            </div>

            <div className="text-sm text-slate-400">
              {new Date(deposit.depositDate).toLocaleDateString()}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => handleOpenModal(selectedCenterId, deposit)}
                className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteDeposit(selectedCenterId, deposit._id)}
                className="px-3 py-1.5 bg-rose-500/20 text-rose-400 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </>
) : (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Wallet className="w-12 h-12 text-slate-600" />
                  <p className="text-lg font-medium text-white">No deposits found</p>
                  <p className="text-sm text-slate-500">Add your first security deposit for this center</p>
                  <button
                    onClick={() => handleOpenModal(selectedCenterId)}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Deposit
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ALL CENTERS TABLE */}
        {!selectedCenter && centers.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">All Centers Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Center</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Held</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Refunded</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Deposits</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {centerStats.map((center) => (
                    <tr 
                      key={center._id} 
                      className="group hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedCenterId(center._id)}
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{center.name}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{center.location || "—"}</td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-amber-400">₹{center.totalHeld.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-emerald-400">₹{center.totalRefunded.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-slate-700 rounded-md text-xs text-white">{center.count}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCenterId(center._id);
                          }}
                          className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD/EDIT MODAL */}
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
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {editMode ? "Edit Deposit" : "Add Security Deposit"}
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={depositDate}
                      onChange={(e) => setDepositDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status] || status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={addingDeposit || updatingDeposit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingDeposit || updatingDeposit 
                      ? "Saving..." 
                      : editMode ? "Update" : "Add"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* TABLE */}
        <div className="overflow-x-auto bg-dark-800/60 border border-dark-600/50 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-dark-900/70">
              <tr>
                {[
                  "Client",
                  "Deposit Amount",
                  "Held Since",
                  "Refund Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs uppercase text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-700">
              <AnimatePresence>
                {selectedCenter?.securityDeposits?.map((d) => (
                  <motion.tr
                    key={d._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-dark-700/40 transition"
                  >
                    <td className="px-4 py-3">{selectedCenter?.name}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{d.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(d.depositDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${statusColors[d.status]}`}
                      >
                        {statusLabels[d.status]}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenModal(selectedCenterId, d)}
                          className="p-1.5 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 text-text-muted cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeposit(selectedCenterId, d._id)}
                          className="p-1.5 bg-dark-700 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 text-rose-400 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {!selectedCenter?.securityDeposits?.length && (
            <div className="py-12 text-center text-text-muted">
              No security deposits found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityDeposit;