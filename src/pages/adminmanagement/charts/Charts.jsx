import React, { PureComponent } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendingUp, Activity, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const radarData = [
    { subject: 'Math', A: 120, B: 110, fullMark: 150 },
    { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
    { subject: 'English', A: 86, B: 130, fullMark: 150 },
    { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
    { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
    { subject: 'History', A: 65, B: 85, fullMark: 150 },
];

const Charts = () => {
    return (
        <div className="space-y-8 animate-slide-in pt-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">Analytics Dashboard</h1>
                    <p className="text-text-muted mt-2 text-lg">Deep dive into project metrics and performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-dark-800 border border-dark-600 rounded-lg shadow-sm hover:bg-dark-700 hover:border-primary/50 transition-all font-medium text-sm text-text-muted hover:text-text-primary">Daily</button>
                    <button className="p-2 bg-primary text-white border border-primary rounded-lg shadow-md hover:bg-primary-dark transition-all font-medium text-sm shadow-lg shadow-primary/30">Weekly</button>
                    <button className="p-2 bg-dark-800 border border-dark-600 rounded-lg shadow-sm hover:bg-dark-700 hover:border-primary/50 transition-all font-medium text-sm text-text-muted hover:text-text-primary">Monthly</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 p-6 rounded-3xl shadow-xl border border-dark-600/50 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-yellow/20 text-primary group-hover:scale-110 transition-transform group-hover:from-primary/30 group-hover:to-yellow/30 border border-primary/30">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary">Revenue Growth</h2>
                        </div>
                        <span className="text-primary font-bold bg-gradient-to-r from-primary/10 to-yellow/10 px-3 py-1 rounded-full text-sm border border-primary/40">+12.5%</span>
                    </div>
                    <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#CFFFDC" stopOpacity={0.5} />
                                        <stop offset="30%" stopColor="#68BA7F" stopOpacity={0.4} />
                                        <stop offset="60%" stopColor="#5AA66F" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#2E6F40" stopOpacity={0.15} />
                                    </linearGradient>
                                    <linearGradient id="strokeUv" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#CFFFDC" />
                                        <stop offset="50%" stopColor="#68BA7F" />
                                        <stop offset="100%" stopColor="#2E6F40" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E6F40" strokeOpacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A8D4B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A8D4B8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#253D2C', border: '1px solid #2E6F40', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="uv" stroke="url(#strokeUv)" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Radar */}
                <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 p-6 rounded-3xl shadow-xl border border-dark-600/50 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-yellow/20 text-primary group-hover:scale-110 transition-transform group-hover:from-primary/30 group-hover:to-yellow/30 border border-primary/30">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary">Team Performance</h2>
                        </div>
                    </div>
                    <div className="h-80 w-full flex items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <defs>
                                    <linearGradient id="radarA" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#68BA7F" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#2E6F40" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="radarB" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#CFFFDC" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#68BA7F" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <PolarGrid stroke="#2E6F40" strokeOpacity={0.3} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#CFFFDC', fontSize: 12, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#68BA7F" strokeOpacity={0.5} />
                                <Radar name="Team A" dataKey="A" stroke="#68BA7F" fill="url(#radarA)" fillOpacity={0.6} />
                                <Radar name="Team B" dataKey="B" stroke="#CFFFDC" fill="url(#radarB)" fillOpacity={0.6} />
                                <Legend wrapperStyle={{ color: '#CFFFDC' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#253D2C', border: '1px solid #2E6F40', borderRadius: '12px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mixed Bar/Line */}
                <div className="lg:col-span-2 bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 p-6 rounded-3xl shadow-xl border border-dark-600/50 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-yellow/20 text-primary group-hover:scale-110 transition-transform group-hover:from-primary/30 group-hover:to-yellow/30 border border-primary/30">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary">Sales vs Target</h2>
                        </div>
                    </div>
                    <div className="h-96 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <defs>
                                    <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#68BA7F" stopOpacity={1} />
                                        <stop offset="50%" stopColor="#5AA66F" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#2E6F40" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#CFFFDC" />
                                        <stop offset="50%" stopColor="#68BA7F" />
                                        <stop offset="100%" stopColor="#2E6F40" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#2E6F40" vertical={false} strokeOpacity={0.3} />
                                <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} tick={{ fill: '#A8D4B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A8D4B8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#253D2C', border: '1px solid #2E6F40', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ color: '#CFFFDC' }} />
                                <Bar dataKey="pv" barSize={20} fill="url(#barGradient2)" radius={[10, 10, 0, 0]} />
                                <Line type="monotone" dataKey="uv" stroke="url(#lineGradient)" strokeWidth={3} dot={{ r: 4, fill: '#68BA7F' }} activeDot={{ r: 8, fill: '#CFFFDC' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;

