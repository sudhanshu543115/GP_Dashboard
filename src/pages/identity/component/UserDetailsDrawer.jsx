import React from "react";
import { 
    X, Mail, Phone, Shield, Users, Clock, Calendar,
    CheckCircle, XCircle, Edit2, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

const UserDetailsDrawer = ({ user, onClose, onEdit, onReset }) => {
    if (!user) return null;

    const roleColors = {
        admin: "from-primary/80 to-pink-500",
        sales: "from-primary to-cyan-500",
        pm: "from-emerald-500 to-teal-500",
        finance: "from-amber-500 to-orange-500",
    };

    const statusIcons = {
        true: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        false: <XCircle className="w-4 h-4 text-rose-400" />
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-end z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30 }}
                className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-l border-dark-600/30 shadow-2xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${roleColors[user.role]} p-6`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm uppercase tracking-wider">User Profile</p>
                            <h2 className="text-2xl font-bold text-white mt-1">{user.name}</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* User Avatar */}
                <div className="flex justify-center -mt-12 mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 border-4 border-dark-600/30 flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-white">
                            {user.name.charAt(0)}
                        </span>
                    </div>
                </div>

                {/* User Details */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full">
                            {statusIcons[user.status]}
                            <span className="text-sm font-medium">
                                {user.status ? 'Active User' : 'Inactive User'}
                            </span>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Contact Information</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-white">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-white">{user.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Role & Department</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm capitalize text-white">{user.role}</span>
                                </div>
                                {user.department && (
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-white">{user.department}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Activity</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-white">Last login: {user.lastLogin}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-white">Member since: Jan 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-dark-600/30">
                        <button 
                            onClick={onEdit}
                            className="flex-1 px-4 py-3 bg-primary/20 hover:bg-primary/30 text-blue-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                        <button 
                            onClick={onReset}
                            className="flex-1 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset Password
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserDetailsDrawer;