import React from 'react';
import { UserCog, Users } from 'lucide-react';

const TLEvaluation = () => {
    const teamLeaders = [
        { id: 'TL-101', name: 'Robert Fox', teamSize: 15, campaign: 'Tech Support', teamAvgScore: 88, attendance: '98%', performance: 'High' },
        { id: 'TL-102', name: 'Jenny Wilson', teamSize: 12, campaign: 'Sales', teamAvgScore: 82, attendance: '95%', performance: 'Medium' },
        { id: 'TL-103', name: 'Guy Hawkins', teamSize: 18, campaign: 'Customer Care', teamAvgScore: 91, attendance: '99%', performance: 'High' },
        { id: 'TL-104', name: 'Kristin Watson', teamSize: 14, campaign: 'Sales', teamAvgScore: 76, attendance: '92%', performance: 'Low' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">TL Evaluation</h1>
                    <p className="text-text-muted text-sm">Team Leader performance and team metrics.</p>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">TL ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Team Size</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Team Avg Score</th>
                            <th className="px-6 py-4">Attendance</th>
                            <th className="px-6 py-4">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/30">
                        {teamLeaders.map((tl) => (
                            <tr key={tl.id} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-primary">{tl.id}</td>
                                <td className="px-6 py-4 font-bold flex items-center gap-2">
                                    <UserCog className="w-4 h-4 text-text-muted" />
                                    {tl.name}
                                </td>
                                <td className="px-6 py-4 flex items-center gap-1"><Users className="w-3 h-3" /> {tl.teamSize}</td>
                                <td className="px-6 py-4">{tl.campaign}</td>
                                <td className="px-6 py-4 font-bold text-primary">{tl.teamAvgScore}%</td>
                                <td className="px-6 py-4">{tl.attendance}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        tl.performance === 'High' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        tl.performance === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>{tl.performance}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TLEvaluation;