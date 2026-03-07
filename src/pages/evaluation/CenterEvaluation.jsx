import React from 'react';
import { Building2, Globe } from 'lucide-react';

const CenterEvaluation = () => {
    const centers = [
        { id: 'CTR-001', name: 'Mumbai Hub Alpha', location: 'Mumbai, India', activeAgents: 450, totalCalls: '1.2M', revenue: '$250k', compliance: '99.9%' },
        { id: 'CTR-002', name: 'Bangalore Ops', location: 'Bangalore, India', activeAgents: 320, totalCalls: '850k', revenue: '$180k', compliance: '98.5%' },
        { id: 'CTR-003', name: 'Delhi Support', location: 'Delhi, India', activeAgents: 180, totalCalls: '400k', revenue: '$95k', compliance: '97.2%' },
        { id: 'CTR-004', name: 'Pune Tech', location: 'Pune, India', activeAgents: 380, totalCalls: '920k', revenue: '$210k', compliance: '99.5%' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Center Evaluation</h1>
                    <p className="text-text-muted text-sm">Operational metrics across different centers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {centers.map((center) => (
                    <div key={center.id} className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex flex-col lg:flex-row items-center justify-between hover:bg-dark-700/50 transition-all">
                        <div className="flex items-center gap-6 w-full lg:w-auto">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{center.name}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {center.location}</span>
                                    <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                                    <span className="font-mono text-xs">{center.id}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6 lg:mt-0 w-full lg:w-auto text-center lg:text-left">
                            <div>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Active Agents</p>
                                <p className="text-lg font-bold text-white">{center.activeAgents}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Total Calls</p>
                                <p className="text-lg font-bold text-white">{center.totalCalls}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Revenue</p>
                                <p className="text-lg font-bold text-green-400">{center.revenue}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Compliance</p>
                                <p className="text-lg font-bold text-primary">{center.compliance}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CenterEvaluation;