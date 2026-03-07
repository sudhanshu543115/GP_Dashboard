import React, { useState } from 'react';
import {
    Clock, Globe, Edit, Trash2, Shield
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Table from '../common/Table';

const ClientManagement = () => {
    // Column Definitions for Client Management
    const [columnDefs] = useState([
        {
            headerName: 'TITLE',
            field: 'title',
            minWidth: 200,
            flex: 1.5,
            cellRenderer: (params) => (
                <div className="flex items-center gap-3 h-full">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-text-primary text-[13px] tracking-tight">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'PROJECT CODE',
            field: 'projectCode',
            width: 150,
            cellRenderer: (params) => (
                <span className="text-text-muted font-mono text-[11px] uppercase tracking-wider">{params.value}</span>
            )
        },
        {
            headerName: 'CLIENT CODE',
            field: 'clientCode',
            width: 140,
            cellRenderer: (params) => (
                <span className="text-text-muted font-mono text-[11px]">{params.value}</span>
            )
        },
        {
            headerName: 'ACTIVITY',
            field: 'lastActivity',
            width: 130,
            cellRenderer: (params) => (
                <div className="flex flex-col text-[10px] text-text-muted leading-tight">
                    <span className="font-bold text-text-primary/70 italic">{params.value.date}</span>
                    <span className="opacity-60">{params.value.time}</span>
                </div>
            )
        },
        {
            headerName: 'TIME LEFT',
            field: 'countdown',
            minWidth: 180,
            cellRenderer: (params) => (
                <div className="flex gap-1 h-full items-center">
                    {params.value.map((item, i) => {
                        const unit = item.slice(-1);
                        const val = item.slice(0, -1);
                        return (
                            <div key={i} className="flex bg-dark-900 rounded-md overflow-hidden border border-white/5">
                                <span className="bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-black border-r border-white/5">{val}</span>
                                <span className="px-1.5 py-0.5 text-[8px] text-text-primary/30 font-black uppercase flex items-center">{unit}</span>
                            </div>
                        );
                    })}
                </div>
            )
        },
        {
            headerName: 'LOCATION',
            field: 'country',
            width: 130,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-orange-500 text-[12px] font-black uppercase tracking-tighter">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'STATUS',
            field: 'status',
            width: 120,
            cellRenderer: (params) => (
                <div className="flex items-center">
                    <span className={twMerge(
                        "text-[9px] font-black px-2.5 py-1 rounded-lg border tracking-[0.15em] uppercase",
                        params.value === 'ACTIVE'
                            ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>
                        {params.value}
                    </span>
                </div>
            )
        },
        {
            headerName: 'ACTIONS',
            width: 110,
            cellRenderer: () => (
                <div className="flex items-center gap-2 h-full">
                    <button className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-text-primary hover:border-primary hover:bg-dark-600 transition-all shadow-lg active:scale-95">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500 hover:border-red-500 hover:bg-red-500/5 transition-all shadow-lg active:scale-95">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]);

    // Mock Row Data
    const rowData = [
        {
            title: 'Telecom Chat Support',
            projectCode: 'NET/10979/26',
            clientCode: 'UTC/4562',
            lastActivity: { date: '20/02/2026', time: '14:53:11' },
            countdown: ['52d', '20h', '14m'],
            country: 'Netherland',
            status: 'ACTIVE'
        },
        {
            title: 'TLC Verification Hub',
            projectCode: 'TLC/56721/26',
            clientCode: '572788',
            lastActivity: { date: '19/02/2026', time: '23:55:07' },
            countdown: ['74d', '05h', '16m'],
            country: 'Germany',
            status: 'ACTIVE'
        },
        {
            title: 'AUS Case Filing',
            projectCode: 'AUS/54526/26',
            clientCode: '323412',
            lastActivity: { date: '18/02/2026', time: '22:42:50' },
            countdown: ['68d', '14h', '05m'],
            country: 'Australia',
            status: 'PENDING'
        }
    ];

    return (
        <div className="space-y-8 pt-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col pb-10">
            {/* Header Content */}
            <div className="flex justify-between items-end px-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary uppercase italic">Client Management</h1>
                    <p className="text-text-muted text-sm mt-2 font-medium italic opacity-80">Oversee active global outsourcing nodes and node delivery health.</p>
                </div>
                <div className="bg-dark-850/80 backdrop-blur-2xl border border-white/5 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-2xl group hover:border-primary/40 transition-all cursor-pointer">
                    <div className="relative">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary animate-ping absolute inset-0 opacity-40" />
                        <div className="w-3.5 h-3.5 rounded-full bg-primary relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
                    </div>
                    <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> LIVE OPS: SYNCED
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full px-4 min-h-0">
                <Table
                    rowData={rowData}
                    columnDefs={columnDefs}
                    paginationPageSize={12}
                />
            </div>
        </div>
    );
};

export default ClientManagement;
