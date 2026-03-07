import React, { useMemo, useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  FileText,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import Table from '../../components/common/Table';

const AgentEvaluation = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const agents = [
    {
      id: 'AGT-001',
      name: 'Sarah Miller',
      evalDate: '2026-02-07',
      overall: 92,
      created: '2026-02-07 10:33:25',
      status: 'Excellent'
    },
    {
      id: 'AGT-002',
      name: 'John Doe',
      evalDate: '2026-02-07',
      overall: 78,
      created: '2026-02-07 10:25:48',
      status: 'Average'
    },
    {
      id: 'AGT-003',
      name: 'Emily Davis',
      evalDate: '2026-02-07',
      overall: 95,
      created: '2026-02-07 09:21:21',
      status: 'Excellent'
    }
  ];

  // 🔍 FILTER
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        !statusFilter || agent.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, agents]);

  // 📊 ANALYTICS
  const avgScore = Math.round(
    agents.reduce((sum, a) => sum + a.overall, 0) / agents.length
  );

  const excellentCount = agents.filter(
    (a) => a.status === 'Excellent'
  ).length;

  const statusColors = {
    Excellent: 'bg-green-500/10 text-green-400 border-green-500/30',
    Good: 'bg-primary/10 text-blue-400 border-primary/30',
    Average: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Poor: 'bg-red-500/10 text-red-400 border-red-500/30'
  };

  // 📋 TABLE COLUMNS
  const columnDefs = useMemo(() => [
    {
      headerName: 'Agent ID',
      field: 'id',
      width: 120,
      cellRenderer: (p) => (
        <span className="font-mono text-primary">{p.value}</span>
      )
    },
    {
      headerName: 'Agent',
      field: 'name',
      flex: 1.5,
      cellRenderer: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
            {p.value.charAt(0)}
          </div>
          <span className="font-semibold">{p.value}</span>
        </div>
      )
    },
    { headerName: 'Eval Date', field: 'evalDate', width: 140 },
    {
      headerName: 'Overall',
      field: 'overall',
      width: 120,
      cellRenderer: (p) => (
        <span className="font-black text-lg text-primary">
          {p.value}%
        </span>
      )
    },
    { headerName: 'Created', field: 'created', width: 180 },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      cellRenderer: (p) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[p.value]}`}
        >
          {p.value}
        </span>
      )
    },

    // ✅ ACTIONS
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      cellRenderer: (p) => {
        const row = p.data;

        return (
          <div className="flex gap-2">
            <IconBtn
              icon={<FileText size={16} />}
              color="blue"
              tooltip="Download PDF"
              onClick={() => alert(`PDF for ${row.name}`)}
            />

            <IconBtn
              icon={<Eye size={16} />}
              color="gray"
              tooltip="View Details"
              onClick={() => alert(`View ${row.name}`)}
            />

            <IconBtn
              icon={<Trash2 size={16} />}
              color="red"
              tooltip="Delete Agent"
              onClick={() => alert(`Delete ${row.name}`)}
            />
          </div>
        );
      }
    }
  ], []);

  return (
    <div className="space-y-6 p-6 text-text-primary h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center bg-dark-700/40 backdrop-blur-xl border border-dark-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
            <UserCheck className="text-primary" size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Agent Evaluation</h1>
            <p className="text-text-muted text-sm">
              Performance metrics and quality scores for agents.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Total Agents" value={agents.length} />
        <StatCard title="Average Score" value={`${avgScore}%`} />
        <StatCard title="Excellent Performers" value={excellentCount} />
      </div>

      {/* 🔍 FILTER BAR — UPDATED */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-700/40 backdrop-blur-xl border border-dark-600 rounded-2xl p-4 shadow">

        {/* LEFT */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-600 focus:ring-2 focus:ring-primary text-sm outline-none"
            />
          </div>

          <div className="relative">
            <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-600 focus:ring-2 focus:ring-primary text-sm outline-none"
            >
              <option value="">All Status</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => alert('Create New Agent')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow hover:scale-105 active:scale-95 transition"
          >
            <Plus size={16} />
            Create New
          </button>

          <button
            onClick={() => alert('Download All PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow hover:scale-105 active:scale-95 transition"
          >
            <FileText size={16} />
            Download All PDF
          </button>
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="flex-1 min-h-0 bg-dark-700/30 border border-dark-600 rounded-2xl p-3 shadow-inner">
        <Table rowData={filteredAgents} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-gradient-to-br from-dark-700/60 to-dark-800/60 border border-dark-600 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition">
    <p className="text-text-muted text-xs uppercase tracking-wider">
      {title}
    </p>
    <h3 className="text-3xl font-bold text-primary mt-2">{value}</h3>
  </div>
);

const IconBtn = ({ icon, color, onClick, tooltip }) => {
  const colors = {
    blue: 'bg-primary/15 hover:bg-primary text-blue-400 hover:text-white border-primary/30',
    gray: 'bg-gray-500/15 hover:bg-gray-500 text-gray-300 hover:text-white border-gray-500/30',
    red: 'bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30'
  };

  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95 ${colors[color]}`}
    >
      {icon}
    </button>
  );
};

export default AgentEvaluation;