import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Charts = () => {
    const pieData = [
        { name: 'Excellent', value: 400, color: '#10b981' },
        { name: 'Good', value: 300, color: '#3b82f6' },
        { name: 'Average', value: 300, color: '#f59e0b' },
        { name: 'Poor', value: 200, color: '#ef4444' },
    ];

    const radarData = [
        { subject: 'Communication', A: 120, fullMark: 150 },
        { subject: 'Technical', A: 98, fullMark: 150 },
        { subject: 'Punctuality', A: 86, fullMark: 150 },
        { subject: 'Teamwork', A: 99, fullMark: 150 },
        { subject: 'Problem Solving', A: 85, fullMark: 150 },
        { subject: 'Efficiency', A: 65, fullMark: 150 },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Detailed Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600/50 shadow-xl">
                    <h3 className="text-xl font-bold mb-4">Overall Ratings Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600/50 shadow-xl">
                    <h3 className="text-xl font-bold mb-4">Skill Assessment Radar</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#4b5563" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Agent Avg" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;