import React, { useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =======================
   SAMPLE DATA
======================= */
const monthlyRevenue = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 150000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 140000 },
  { month: "May", revenue: 220000 },
  { month: "Jun", revenue: 260000 },
];

const projectRevenue = [
  { name: "Hotel Website", value: 300000 },
  { name: "CRM System", value: 220000 },
  { name: "E-commerce", value: 180000 },
  { name: "Mobile App", value: 140000 },
];

const clientRevenue = [
  { name: "Client A", value: 250000 },
  { name: "Client B", value: 190000 },
  { name: "Client C", value: 160000 },
];

const outstandingData = [
  { name: "Received", value: 720000 },
  { name: "Outstanding", value: 280000 },
];

const COLORS = ["#22c55e", "#f97316"];

const RevenueReports = () => {
  const stats = useMemo(() => {
    const totalRevenue = monthlyRevenue.reduce(
      (sum, m) => sum + m.revenue,
      0
    );
    const outstanding = outstandingData.find(
      (d) => d.name === "Outstanding"
    ).value;

    return {
      totalRevenue,
      outstanding,
      clients: clientRevenue.length,
      projects: projectRevenue.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 p-6 text-text-primary">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="border-b border-dark-600 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Revenue Reports
          </h1>
          <p className="text-text-muted text-sm">
            Financial performance overview & insights
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: `₹${stats.totalRevenue}`,
              icon: IndianRupee,
              color: "text-emerald-400",
            },
            {
              label: "Outstanding Amount",
              value: `₹${stats.outstanding}`,
              icon: AlertTriangle,
              color: "text-amber-400",
            },
            {
              label: "Active Clients",
              value: stats.clients,
              icon: Users,
              color: "text-primary",
            },
            {
              label: "Projects",
              value: stats.projects,
              icon: TrendingUp,
              color: "text-cyan-400",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-text-muted text-sm">{s.label}</p>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
          ))}
        </div>

        {/* MONTHLY REVENUE */}
        <div className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PROJECT + CLIENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">
              Project-wise Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectRevenue}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">
              Client-wise Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRevenue}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OUTSTANDING */}
        <div className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">
            Outstanding Amount
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={outstandingData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
              >
                {outstandingData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default RevenueReports;