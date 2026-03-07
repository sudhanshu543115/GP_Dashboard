import React from 'react';
import { Settings, Shield, Edit, Trash2 } from 'lucide-react';

const ManageAdmin = () => {
    const admins = [
        { id: 1, name: 'Admin User', email: 'admin@globalprojects.com', role: 'Super Admin', lastLogin: 'Just now', status: 'Active' },
        { id: 2, name: 'Operations Manager', email: 'ops@globalprojects.com', role: 'Manager', lastLogin: '2 hours ago', status: 'Active' },
        { id: 3, name: 'QA Lead', email: 'qa.lead@globalprojects.com', role: 'Editor', lastLogin: '1 day ago', status: 'Active' },
        { id: 4, name: 'Guest Viewer', email: 'guest@globalprojects.com', role: 'Viewer', lastLogin: '5 days ago', status: 'Inactive' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Admins</h1>
                    <p className="text-text-muted text-sm">Control access and permissions for dashboard administrators.</p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95">
                    + Add New Admin
                </button>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/30">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-primary"><Shield className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-bold text-white">{admin.name}</p>
                                            <p className="text-xs text-text-muted">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><span className="bg-dark-700 px-2 py-1 rounded text-xs font-mono border border-dark-600">{admin.role}</span></td>
                                <td className="px-6 py-4 text-text-muted">{admin.lastLogin}</td>
                                <td className="px-6 py-4"><span className={`text-xs font-bold ${admin.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{admin.status}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-text-muted hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                                    <button className="p-2 text-text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAdmin;