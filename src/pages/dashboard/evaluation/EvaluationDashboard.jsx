import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Award, TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const EvaluationDashboard = () => {
    const performanceData = [
        { name: 'Week 1', score: 85, qa: 90 },
        { name: 'Week 2', score: 88, qa: 88 },
        { name: 'Week 3', score: 92, qa: 94 },
        { name: 'Week 4', score: 89, qa: 91 },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end pb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evaluation Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1">Monitor agent performance and QA metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Agent Score', value: '88.5%', icon: Award, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'QA Pass Rate', value: '94.2%', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Active Agents', value: '124', icon: Users, color: 'text-blue-400', bg: 'bg-primary/10' },
                    { label: 'Critical Errors', value: '3', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +2.4%</span>
                        </div>
                        <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 h-80">
                    <h3 className="font-bold mb-6">Performance Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="qa" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 h-80">
                    <h3 className="font-bold mb-6">Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EvaluationDashboard;