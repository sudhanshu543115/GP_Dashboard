import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, Plus, Filter, LayoutGrid, List, TrendingUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Table from '../../../components/common/Table';

const Projects = () => {
    const [viewMode, setViewMode] = useState('grid');

    // Crypto/Web3 Project Data Mock
    const projects = [
        { id: 1, title: 'NFT Marketplace V2', client: 'OpenSea', status: 'In Progress', progress: 65, team: ['JD', 'AL', 'ZK'], deadline: 'Oct 24', budget: '12 ETH', type: 'DApp' },
        { id: 2, title: 'Token Smart Contract', client: 'DeFi Protocol', status: 'Auditing', progress: 95, team: ['ZK', 'JD'], deadline: 'Sep 12', budget: '5.5 ETH', type: 'Smart Contract' },
        { id: 3, title: 'Wallet Integration', client: 'Metamask', status: 'Pending', progress: 15, team: ['AL'], deadline: 'Nov 01', budget: '8 ETH', type: 'Backend' },
        { id: 4, title: 'DAO Governance Portal', client: 'Uniswap', status: 'In Progress', progress: 45, team: ['JD', 'AL', 'ZK'], deadline: 'Oct 30', budget: '15 ETH', type: 'Frontend' },
        { id: 5, title: 'Cross-Chain Bridge', client: 'Polygon', status: 'Testing', progress: 90, team: ['JD'], deadline: 'Oct 15', budget: '20 ETH', type: 'Infrastructure' },
        { id: 6, title: 'Staking Dashboard', client: 'Liquid Stake', status: 'In Progress', progress: 30, team: ['AL', 'ZK'], deadline: 'Nov 12', budget: '4.2 ETH', type: 'UI/UX' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'In Progress': return 'bg-primary/10 text-primary border-primary/20';
            case 'Pending': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'Auditing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Testing': return 'bg-primary/80/10 text-primary/80 border-primary/80/20';
            default: return 'bg-dark-700 text-gray-400';
        }
    };

    const columnDefs = useMemo(() => ([
        {
            headerName: 'PROJECT',
            field: 'title',
            minWidth: 220,
            flex: 1.5,
            cellRenderer: (params) => (
                <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{params.value}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-widest mt-1">NODE: {params.data.client}</span>
                </div>
            )
        },
        {
            headerName: 'TYPE',
            field: 'type',
            width: 150,
            cellRenderer: (params) => (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                    {params.value}
                </span>
            )
        },
        {
            headerName: 'STATUS',
            field: 'status',
            width: 150,
            cellRenderer: (params) => (
                <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border", getStatusColor(params.value))}>
                    {params.value}
                </span>
            )
        },
        {
            headerName: 'DEADLINE',
            field: 'deadline',
            width: 130,
            cellRenderer: (params) => <span className="font-bold text-orange-500">{params.value}</span>
        },
        {
            headerName: 'BUDGET',
            field: 'budget',
            width: 120,
            cellRenderer: (params) => <span className="font-black text-yellow">{params.value}</span>
        },
        {
            headerName: 'PROGRESS',
            field: 'progress',
            width: 140,
            cellRenderer: (params) => <span className="font-black text-primary">{params.value}%</span>
        },
    ]), []);

    return (
        <div className="space-y-8 animate-fade-in text-text-primary pt-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Active Projects: <span className="text-text-primary font-bold">12</span></span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>Total Value: <span className="text-text-primary font-bold">245 ETH</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search project..."
                            className="pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-full md:w-64 transition-all"
                        />
                    </div>

                    <button className="p-2.5 bg-dark-800 border border-dark-600 rounded-xl hover:bg-dark-700 text-gray-400 hover:text-text-primary transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>

                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </div>
            </div>

            {/* View Toggle (Mock) */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 bg-dark-800 p-1 rounded-lg border border-dark-600">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={twMerge(
                            "p-1.5 rounded transition-colors",
                            viewMode === 'grid' ? "bg-dark-600 text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                        )}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={twMerge(
                            "p-1.5 rounded transition-colors",
                            viewMode === 'table' ? "bg-dark-600 text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                        )}
                        aria-label="Table view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>

                <button className="text-xs font-bold text-gray-500 hover:text-text-primary flex items-center gap-1">
                    Sort by: Deadline <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            {viewMode === 'grid' ? (
                /* Project Grid */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="group relative bg-dark-900 rounded-xl overflow-hidden border border-dark-600/50 flex h-64 hover:border-primary/50 transition-all duration-500 shadow-2xl">

                        {/* 30% Image Section */}
                        <div className="w-[30%] relative overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-${1600000000000 + project.id}?auto=format&fit=crop&q=80&w=800`}
                                alt="Project Art"
                                className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-dark-900/70 backdrop-blur-md text-[10px] font-black text-text-primary px-3 py-1.5 rounded-full border border-dark-600/50 tracking-widest uppercase">
                                    {project.type}
                                </span>
                            </div>
                        </div>

                        {/* 70% Data Section */}
                        <div className="w-[70%] p-8 flex flex-col relative bg-gradient-to-br from-dark-900 to-dark-800/50">

                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-text-primary italic tracking-tighter group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
                                        NODE: {project.client}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>+12.5%</span>
                                    </div>
                                    <span className={twMerge("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border block mt-1", getStatusColor(project.status))}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Middle Row: Stats */}
                            <div className="flex flex-1 gap-8 items-center">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Allocation</p>
                                    <p className="text-xl font-black text-yellow-400 tracking-tighter">{project.budget}</p>
                                </div>
                                <div className="w-px h-10 bg-dark-600/40" />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Temporal Unit</p>
                                    <p className="text-xl font-black text-orange-500 tracking-tighter">{project.deadline}</p>
                                </div>
                                <div className="ml-auto w-24 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                                    {/* Mock Graph Visual */}
                                    <svg viewBox="0 0 100 40" className="w-full h-full text-primary">
                                        <path
                                            d="M0 35 Q 25 35, 40 20 T 70 25 T 100 5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Footer Row: Progress & Team */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="w-48 space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-text-muted italic">Sync Rate</span>
                                        <span className="text-primary">{project.progress}%</span>
                                    </div>
                                    <div className="h-1 bg-dark-600/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    {project.team.map((m, i) => (
                                        <div key={i} className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-600/60 flex items-center justify-center text-[9px] font-black text-primary uppercase shadow-xl transition-transform group-hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Aesthetic Add Button */}
                <div className="border-2 border-dashed border-dark-600/50 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-64 bg-dark-900">
                    <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-all border border-primary/20 group-hover:border-primary/40">
                        <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Initialize New Node</span>
                </div>
                </div>
            ) : (
                <div className="h-[calc(100vh-16rem)]">
                    <Table
                        rowData={projects}
                        columnDefs={columnDefs}
                        paginationPageSize={10}
                    />
                </div>
            )}
        </div>
    );
};

export default Projects;
