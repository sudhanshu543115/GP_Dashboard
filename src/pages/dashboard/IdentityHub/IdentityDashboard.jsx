import React from 'react';
import { Shield, Lock, Globe, Server } from 'lucide-react';

const IdentityDashboard = () => {
    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Identity Hub</h1>
                    <p className="text-indigo-200 max-w-xl">Centralized management for center identities, access controls, and security protocols.</p>
                </div>
                <Shield className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 text-indigo-500/10 rotate-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 hover:border-indigo-500/50 transition-all group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Active Centers</h3>
                    <p className="text-3xl font-black text-white">24</p>
                    <p className="text-xs text-text-muted mt-2">Across 8 countries</p>
                </div>
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 hover:border-primary/80/50 transition-all group">
                    <div className="w-12 h-12 bg-primary/80/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Security Alerts</h3>
                    <p className="text-3xl font-black text-white">0</p>
                    <p className="text-xs text-text-muted mt-2">System secure</p>
                </div>
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Server className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Data Nodes</h3>
                    <p className="text-3xl font-black text-white">156</p>
                    <p className="text-xs text-text-muted mt-2">99.9% Uptime</p>
                </div>
            </div>
        </div>
    );
};

export default IdentityDashboard;