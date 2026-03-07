import React, { useMemo } from 'react';
import { MapPin, Server } from 'lucide-react';
import Table from '../../components/common/Table';

const Overview = () => {
    const centers = [
        { id: 'CTR-001', name: 'Mumbai Hub Alpha', location: 'Mumbai, India', capacity: 500, status: 'Online', uptime: '99.9%' },
        { id: 'CTR-002', name: 'Bangalore Ops', location: 'Bangalore, India', capacity: 350, status: 'Online', uptime: '99.5%' },
        { id: 'CTR-003', name: 'Delhi Support', location: 'Delhi, India', capacity: 200, status: 'Maintenance', uptime: '98.2%' },
        { id: 'CTR-004', name: 'Pune Tech', location: 'Pune, India', capacity: 400, status: 'Online', uptime: '99.8%' },
    ];

    const columnDefs = useMemo(() => [
        {
            headerName: 'Center Name',
            field: 'name',
            flex: 1.5,
            cellRenderer: (params) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${params.data.status === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        <Server className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-bold text-text-primary block leading-tight">{params.value}</span>
                        <span className="text-[10px] text-text-muted font-mono">ID: {params.data.id}</span>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Location',
            field: 'location',
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2 text-text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Capacity',
            field: 'capacity',
            width: 120,
            cellRenderer: (params) => <span className="font-bold text-text-primary">{params.value} Seats</span>
        },
        {
            headerName: 'Uptime',
            field: 'uptime',
            width: 120,
            cellRenderer: (params) => <span className="font-mono text-primary font-bold">{params.value}</span>
        },
        {
            headerName: 'Status',
            field: 'status',
            width: 140,
            cellRenderer: (params) => (
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${params.value === 'Online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                    {params.value}
                </span>
            )
        }
    ], []);

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Center Overview</h1>
                    <p className="text-text-muted text-sm">Real-time status of global operational centers.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Table rowData={centers} columnDefs={columnDefs} />
            </div>
        </div>
    );
};

export default Overview;