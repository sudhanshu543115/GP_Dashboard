import React, { useMemo, useState } from "react";
import {
  Trophy,
  UserMinus,
  IndianRupee,
  Percent,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

/*
  Expected input:
  props.closedDeals = [
    {
      id,
      dealName,
      client,
      value,
      closeDate,
      stage: "Won" | "Lost"
    }
  ]
*/

const ManageClosedDeals = ({ closedDeals = [] }) => {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  /* =======================
     STATS CALCULATION
  ======================= */
  const stats = useMemo(() => {
    const wonDeals = closedDeals.filter((d) => d.stage === "Won");
    const lostDeals = closedDeals.filter((d) => d.stage === "Lost");

    const revenue = wonDeals.reduce(
      (sum, d) => sum + Number(d.value || 0),
      0
    );

    const winRate =
      closedDeals.length === 0
        ? 0
        : Math.round((wonDeals.length / closedDeals.length) * 100);

    const averageDealValue = wonDeals.length > 0 
      ? Math.round(revenue / wonDeals.length)
      : 0;

    return {
      won: wonDeals.length,
      lost: lostDeals.length,
      total: closedDeals.length,
      revenue,
      winRate,
      averageDealValue,
    };
  }, [closedDeals]);

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filtered = useMemo(() => {
    return closedDeals.filter((deal) => {
      const matchesSearch = 
        deal.dealName?.toLowerCase().includes(search.toLowerCase()) ||
        deal.client?.toLowerCase().includes(search.toLowerCase());
      const matchesResult = resultFilter === "ALL" || deal.stage === resultFilter;
      return matchesSearch && matchesResult;
    });
  }, [closedDeals, search, resultFilter]);

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
              Closed Deals
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Analysis of won and lost opportunities
            </p>
          </div>

          <div className="flex gap-3">
            <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors">
              <Download className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Won Deals",
              value: stats.won,
              icon: Trophy,
              color: "from-emerald-500 to-teal-500",
              textColor: "text-emerald-400",
            },
            {
              label: "Lost Deals",
              value: stats.lost,
              icon: UserMinus,
              color: "from-rose-500 to-pink-500",
              textColor: "text-rose-400",
            },
            {
              label: "Total Revenue",
              value: `₹${stats.revenue.toLocaleString()}`,
              icon: IndianRupee,
              color: "from-amber-500 to-orange-500",
              textColor: "text-amber-400",
            },
            {
              label: "Win Rate",
              value: `${stats.winRate}%`,
              icon: Percent,
              color: "from-blue-500 to-cyan-500",
              textColor: "text-blue-400",
            },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Deals</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-slate-400">Won: {stats.won}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <span className="text-xs text-slate-400">Lost: {stats.lost}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Average Deal Value</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">
              ₹{stats.averageDealValue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-4">Per won deal</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Performance</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <p className="text-lg font-semibold text-white">
                {stats.winRate >= 50 ? 'Above Average' : 'Below Average'}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Win Rate</span>
                <span className="text-white">{stats.winRate}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  style={{ width: `${stats.winRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

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
                placeholder="Search deals..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={resultFilter}
              onChange={(e) => {
                setResultFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
            >
              <option value="ALL">All Results</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
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
                    "Deal Name",
                    "Client",
                    "Value",
                    "Closed Date",
                    "Result",
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
                            ₹{Number(deal.value).toLocaleString()}
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
                          <span
                            className={twMerge(
                              "px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1",
                              deal.stage === "Won"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            )}
                          >
                            {deal.stage === "Won" ? (
                              <Trophy className="w-3 h-3" />
                            ) : (
                              <UserMinus className="w-3 h-3" />
                            )}
                            {deal.stage}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group/tooltip relative"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-slate-300" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <BarChart3 className="w-12 h-12 text-slate-600" />
                          <p className="text-lg font-medium">No closed deals found</p>
                          <p className="text-sm text-slate-500">
                            {search || resultFilter !== 'ALL' 
                              ? 'Try adjusting your search or filters'
                              : 'Deals will appear here when they are marked as won or lost'}
                          </p>
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

        {/* SUMMARY CHARTS */}
        {closedDeals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Win/Loss Distribution */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Win/Loss Distribution</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Won</span>
                    <span className="text-emerald-400">{stats.won} deals</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${(stats.won / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Lost</span>
                    <span className="text-rose-400">{stats.lost} deals</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      style={{ width: `${(stats.lost / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Monthly Performance</h2>
              <div className="flex items-center justify-center h-32">
                <p className="text-slate-400 text-sm">Monthly data will appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageClosedDeals;