import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Users,
  Receipt,
  Phone,
  UserPlus,
  IndianRupee,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  TrendingUp,
  TrendingDown,
  PhoneCall,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL =
    "https://global-project-ek8i.onrender.com/api/v1/dashboard/stats";

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      const storedData = localStorage.getItem("auth");

      if (!storedData) {
        setError("No login data found. Please login again.");
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(storedData);
      const token = parsedData?.token;

      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.message);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch dashboard data"
      );
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const map = {
      new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      overdue: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      NEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      CONTACTED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };
    return map[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getTrendIcon = (trend) => {
    return trend > 0 ? 
      <TrendingUp size={14} className="text-emerald-400" /> : 
      <TrendingDown size={14} className="text-rose-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-dark-700 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-text-muted mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-rose-500/10 p-8 rounded-2xl border border-rose-500/20 text-center max-w-md">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h3 className="text-text-primary text-lg font-semibold mb-2">Failed to Load</h3>
          <p className="text-rose-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-primary/20 text-primary rounded-xl border border-primary/30 hover:bg-primary/30 transition inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 lg:p-8 bg-dark-950 min-h-screen"
    >
      {/* Header with Stats Overview */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Dashboard
            </h1>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] md:text-xs rounded-full border border-emerald-500/20">
              Live
            </span>
          </div>
          <p className="text-text-muted text-xs md:text-sm">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-850 rounded-lg md:rounded-xl border border-dark-600/30 text-sm md:text-base">
            <BarChart3 size={14} className="text-primary flex-shrink-0" />
            <span className="text-xs md:text-sm text-text-secondary">Last 30 days</span>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="px-3 md:px-4 py-2 bg-primary/10 text-primary rounded-lg md:rounded-xl border border-primary/20 hover:bg-primary/20 transition flex items-center justify-center gap-2 text-xs md:text-sm font-medium"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <button className="p-2 bg-dark-850 rounded-lg md:rounded-xl border border-dark-600/30 hover:border-primary/30 transition">
            <Download size={16} className="text-text-muted flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid with Trends */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        <MetricCard
          title="Total Users"
          value={dashboardData?.totalUsers}
          icon={Users}
          colorClass="primary"
          trend={+12}
        />
        <MetricCard
          title="Total Clients"
          value={dashboardData?.totalClients}
          icon={Briefcase}
          colorClass="emerald"
          trend={+8}
        />
        <MetricCard
          title="Total Projects"
          value={dashboardData?.totalProjects}
          icon={FolderKanban}
          colorClass="amber"
          trend={+15}
        />
        <MetricCard
          title="Total Invoices"
          value={dashboardData?.totalInvoices}
          icon={Receipt}
          colorClass="emerald"
          trend={-5}
        />
      </div>

      {/* Financial & Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Revenue Card - Expanded */}
        <div className="md:col-span-2 bg-gradient-to-br from-dark-850 to-dark-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-dark-600/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-6 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-primary/20">
                <IndianRupee className="text-primary" size={18} />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-text-primary">Revenue Overview</h2>
                <p className="text-[10px] md:text-xs text-text-muted">Financial summary</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs">
              <span className="text-text-muted">This month</span>
              <PieChart size={14} className="text-dark-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <p className="text-text-muted text-[10px] md:text-sm">Total Revenue</p>
              <p className="text-xl md:text-3xl font-bold text-text-primary">
                {formatCurrency(dashboardData?.totalRevenue)}
              </p>
              <div className="flex items-center gap-1 text-[9px] md:text-xs">
                <TrendingUp size={10} className="text-emerald-400" />
                <span className="text-emerald-400">+2.5%</span>
                <span className="text-dark-600 ml-1">vs last month</span>
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-text-muted text-[10px] md:text-sm">Pending Amount</p>
              <p className="text-xl md:text-3xl font-bold text-amber-400">
                {formatCurrency(dashboardData?.pendingAmount)}
              </p>
              <div className="flex items-center gap-1 text-[9px] md:text-xs">
                <Clock size={10} className="text-amber-400" />
                <span className="text-amber-400">Awaiting payment</span>
              </div>
            </div>
          </div>

          {/* Mini Progress Bar */}
          <div className="mt-4 md:mt-6">
            <div className="flex justify-between text-[9px] md:text-xs text-text-muted mb-2">
              <span>Collection Rate</span>
              <span>0%</span>
            </div>
            <div className="h-1 md:h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <QuickStatCard
            title="Call Requests"
            value={dashboardData?.recentCallRequests?.length || 0}
            icon={PhoneCall}
            colorClass="primary"
            trend={+3}
          />
          <QuickStatCard
            title="Recent Leads"
            value={dashboardData?.recentLeads?.length || 0}
            icon={UserPlus}
            colorClass="emerald"
            trend={+2}
          />
          <QuickStatCard
            title="Active Invoices"
            value={dashboardData?.recentInvoices?.filter(inv => !inv.is_deleted).length || 0}
            icon={FileText}
            colorClass="amber"
            trend={-1}
          />
          <QuickStatCard
            title="Total Revenue"
            value={formatCurrency(dashboardData?.totalRevenue)}
            icon={TrendingUp}
            colorClass="emerald"
            trend={0}
            isCurrency={true}
          />
        </div>
      </div>

      {/* Recent Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Call Requests */}
        <ActivityCard
          title="Call Requests"
          icon={PhoneCall}
          colorClass="primary"
          count={dashboardData?.recentCallRequests?.length}
          viewAllLink="#"
        >
          {dashboardData?.recentCallRequests?.slice(0, 4).map((req, idx) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-dark-850 p-2 md:p-3 rounded-lg md:rounded-xl border border-dark-600/30 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-[10px] md:text-sm">
                    {req.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-text-primary text-xs md:text-sm font-medium truncate">{req.name}</p>
                    <span className={`text-[7px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[7px] md:text-xs">
                    <div className="flex items-center gap-1">
                      <Mail size={8} className="text-dark-600 flex-shrink-0" />
                      <span className="text-text-muted truncate">{req.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={8} className="text-dark-600 flex-shrink-0" />
                      <span className="text-text-muted">{req.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                <Eye size={14} className="text-primary" />
              </div>
            </motion.div>
          ))}
        </ActivityCard>

        {/* Recent Leads */}
        <ActivityCard
          title="Recent Leads"
          icon={UserPlus}
          colorClass="emerald"
          count={dashboardData?.recentLeads?.length}
          viewAllLink="#"
        >
          {dashboardData?.recentLeads?.slice(0, 4).map((lead, idx) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-dark-850 p-2 md:p-3 rounded-lg md:rounded-xl border border-dark-600/30 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-semibold text-[10px] md:text-sm">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-text-primary text-xs md:text-sm font-medium truncate">{lead.name}</p>
                    <span className={`text-[7px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[7px] md:text-xs">
                      <Mail size={8} className="text-dark-600 flex-shrink-0" />
                      <span className="text-text-muted truncate">{lead.email}</span>
                    </div>
                    {lead.interestedIn && (
                      <div className="flex items-center gap-1">
                        <span className="text-[7px] md:text-[10px] bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 rounded-full">
                          {lead.interestedIn}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </ActivityCard>

        {/* Recent Invoices */}
        <ActivityCard
          title="Recent Invoices"
          icon={Receipt}
          colorClass="amber"
          count={dashboardData?.recentInvoices?.filter(inv => !inv.is_deleted).length}
          viewAllLink="#"
        >
          {dashboardData?.recentInvoices
            ?.filter(inv => !inv.is_deleted)
            .slice(0, 4)
            .map((invoice, idx) => (
              <motion.div
                key={invoice._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              className="group relative bg-dark-850 p-2 md:p-3 rounded-lg md:rounded-xl border border-dark-600/30 hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Receipt size={12} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-text-primary text-xs md:text-sm font-medium truncate">{invoice.invoice_no}</p>
                      <span className={`text-[7px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[7px] md:text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={8} className="text-dark-600 flex-shrink-0" />
                        <span className="text-text-muted">{formatDate(invoice.invoice_date)}</span>
                      </div>
                      <span className="text-text-primary font-medium">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </ActivityCard>
      </div>

      {/* Detailed Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-850 rounded-xl md:rounded-2xl p-3 md:p-6 border border-dark-600/30"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-2 rounded-lg bg-amber-500/20">
              <Receipt className="text-amber-400" size={18} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-text-primary">Invoice History</h2>
              <p className="text-[10px] md:text-xs text-text-muted">All transactions and their status</p>
            </div>
          </div>
          <button className="text-xs md:text-sm text-primary hover:text-primary-light transition flex items-center gap-1 whitespace-nowrap">
            View All
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="px-3 md:px-0">
          <table className="w-full text-[10px] md:text-sm">
            <thead>
              <tr className="text-text-muted border-b border-dark-600/30">
                <th className="text-left py-2 md:py-3 font-medium">Invoice</th>
                <th className="text-left py-2 md:py-3 font-medium hidden sm:table-cell">Description</th>
                <th className="text-left py-2 md:py-3 font-medium hidden md:table-cell">Issue Date</th>
                <th className="text-left py-2 md:py-3 font-medium hidden lg:table-cell">Due Date</th>
                <th className="text-right py-2 md:py-3 font-medium">Amount</th>
                <th className="text-right py-2 md:py-3 font-medium hidden sm:table-cell">Balance</th>
                <th className="text-center py-2 md:py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentInvoices
                ?.filter(inv => !inv.is_deleted)
                .map((invoice, idx) => (
                  <motion.tr
                    key={invoice._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-dark-600/30 hover:bg-primary/5 transition-colors group"
                  >
                    <td className="py-2 md:py-3">
                      <span className="text-text-primary font-mono text-[9px] md:text-sm">{invoice.invoice_no}</span>
                    </td>
                    <td className="py-2 md:py-3 text-text-muted hidden sm:table-cell">{invoice.description}</td>
                    <td className="py-2 md:py-3 text-text-muted hidden md:table-cell">{formatDate(invoice.invoice_date)}</td>
                    <td className="py-2 md:py-3 text-text-muted hidden lg:table-cell">{formatDate(invoice.due_date)}</td>
                    <td className="py-2 md:py-3 text-text-primary text-right font-medium">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="py-2 md:py-3 text-right hidden sm:table-cell">
                      <span className={invoice.balance_due > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {formatCurrency(invoice.balance_due)}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 text-center">
                      <span className={`text-[7px] md:text-[10px] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border inline-flex items-center gap-0.5 md:gap-1 ${getStatusColor(invoice.status)}`}>
                        {invoice.status === 'paid' && <CheckCircle size={8} className="hidden md:inline" />}
                        {invoice.status === 'pending' && <Clock size={8} className="hidden md:inline" />}
                        {invoice.status === 'draft' && <FileText size={8} className="hidden md:inline" />}
                        <span className="whitespace-nowrap">{invoice.status}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
          </div>
        </div>

        {(!dashboardData?.recentInvoices || dashboardData.recentInvoices.length === 0) && (
          <div className="text-center py-6 md:py-8">
            <Receipt size={32} className="text-dark-700 mx-auto mb-2 md:mb-3" />
            <p className="text-text-muted text-xs md:text-sm">No invoices found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const getColorStyles = (colorClass) => {
  const colorMap = {
    primary: { bg: 'bg-primary/20', text: 'text-primary', icon: 'text-primary' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' },
  };
  return colorMap[colorClass] || colorMap.primary;
};

// Enhanced Metric Card
const MetricCard = ({ title, value, icon: Icon, colorClass, trend }) => {
  const colors = getColorStyles(colorClass);
  return (
  <motion.div
    whileHover={{ y: -2 }}
    className="relative group bg-dark-850 p-3 md:p-5 rounded-lg md:rounded-2xl border border-dark-600/30 hover:border-primary/30 transition-all"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 rounded-lg md:rounded-2xl transition"></div>
    <div className="relative">
      <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
        <div className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl ${colors.bg}`}>
          <Icon className={colors.icon} size={16} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {trend > 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-text-muted text-[8px] md:text-xs mb-1">{title}</p>
      <p className="text-lg md:text-2xl font-bold text-text-primary">{value || 0}</p>
    </div>
  </motion.div>
);
};

// Quick Stat Card
const QuickStatCard = ({ title, value, icon: Icon, colorClass, trend, isCurrency }) => {
  const colors = getColorStyles(colorClass);
  return (
  <div className="bg-dark-850 p-4 rounded-xl border border-dark-600/30">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-1.5 rounded-lg ${colors.bg}`}>
        <Icon size={14} className={colors.icon} />
      </div>
      {trend !== 0 && (
        <span className={`text-xs ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-lg font-bold text-text-primary">{value}</p>
    <p className="text-xs text-text-muted mt-1">{title}</p>
  </div>
);
};

// Enhanced Activity Card
const ActivityCard = ({ title, icon: Icon, colorClass, count, children, viewAllLink }) => {
  const colors = getColorStyles(colorClass);
  return (
  <div className="bg-dark-850 rounded-lg md:rounded-2xl p-3 md:p-5 border border-dark-600/30">
    <div className="flex items-center justify-between gap-2 md:gap-4 mb-3 md:mb-4">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 md:p-2 rounded-lg ${colors.bg}`}>
          <Icon className={colors.icon} size={16} />
        </div>
        <div className="min-w-0">
          <h2 className="text-text-primary font-semibold text-xs md:text-base truncate">{title}</h2>
          <p className="text-[8px] md:text-xs text-text-muted">Last 5 records</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[8px] md:text-xs bg-dark-700 px-1.5 md:px-2 py-1 rounded-full text-text-muted">
          {count || 0}
        </span>
        {viewAllLink && (
          <button className="p-1 hover:bg-dark-700 rounded-lg transition hidden md:block">
            <MoreVertical size={12} className="text-text-muted" />
          </button>
        )}
      </div>
    </div>
    <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
      {children}
      {(!children || React.Children.count(children) === 0) && (
        <div className="text-center py-6 md:py-8">
          <Icon size={24} className="text-dark-700 mx-auto mb-2" />
          <p className="text-text-muted text-[8px] md:text-sm">No {title.toLowerCase()}</p>
        </div>
      )}
    </div>
  </div>
);
};
export default Dashboard;