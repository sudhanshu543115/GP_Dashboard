import React from 'react';
import { ClipboardCheck, FileCheck } from 'lucide-react';

const QAEvaluation = () => {
    const qaData = [
        { id: 'QA-501', name: 'Alice Johnson', audits: 120, avgScoreGiven: 88, discrepancies: 2, lastAudit: '2024-02-22' },
        { id: 'QA-502', name: 'Bob Smith', audits: 145, avgScoreGiven: 85, discrepancies: 0, lastAudit: '2024-02-21' },
        { id: 'QA-503', name: 'Charlie Brown', audits: 98, avgScoreGiven: 90, discrepancies: 5, lastAudit: '2024-02-20' },
        { id: 'QA-504', name: 'Diana Prince', audits: 132, avgScoreGiven: 87, discrepancies: 1, lastAudit: '2024-02-22' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">QA Evaluation</h1>
                    <p className="text-text-muted text-sm">Quality Assurance auditor performance metrics.</p>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">QA ID</th>
                            <th className="px-6 py-4">Auditor Name</th>
                            <th className="px-6 py-4">Audits Completed</th>
                            <th className="px-6 py-4">Avg Score Given</th>
                            <th className="px-6 py-4">Discrepancies</th>
                            <th className="px-6 py-4">Last Audit Date</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/30">
                        {qaData.map((qa) => (
                            <tr key={qa.id} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-primary">{qa.id}</td>
                                <td className="px-6 py-4 font-bold">{qa.name}</td>
                                <td className="px-6 py-4">{qa.audits}</td>
                                <td className="px-6 py-4">{qa.avgScoreGiven}%</td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${qa.discrepancies > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {qa.discrepancies}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{qa.lastAudit}</td>
                                <td className="px-6 py-4">
                                    <button className="text-primary hover:text-primary-light font-medium text-xs uppercase tracking-wide flex items-center gap-1"><FileCheck className="w-3 h-3"/> Review</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QAEvaluation;