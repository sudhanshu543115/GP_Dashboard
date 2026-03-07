import React, { useMemo, useState } from "react";
import { 
    Plus, MoreVertical, Search, Filter, Download, 
    Users, CheckCircle, Shield, UserCog,
    Clock, ChevronLeft, ChevronRight, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserFormModal from "./component/UserFormModal";
import ResetPasswordModal from "./component/ResetPasswordModal";
import UserDetailsDrawer from "./component/UserDetailsDrawer";
import {
    useAddUserMutation,
    useDeleteUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "../../utils/toast";

const normalizeRole = (role) => {
    const value = String(role || "").toLowerCase();
    if (value === "super_admin") return "SUPER_ADMIN";
    if (value === "operations_manager") return "OPERATIONS_MANAGER";
    if (value === "hr_manager") return "HR_MANAGER";
    if (value === "content_manager") return "CONTENT_MANAGER";
    if (value === "sales_manager" || value === "sales") return "SALES_MANAGER";
    if (value === "project_manager" || value === "pm") return "PROJECT_MANAGER";
    if (value === "finance_manager" || value === "finance") return "FINANCE_MANAGER";
    if (value === "admin") return "ADMIN";
    if (value === "employee") return "employee";
    return (role || "employee");
};

const toApiRole = (role) => {
    const value = String(role || "");
    const normalized = value.toLowerCase();
    if (normalized === "sales") return "SALES_MANAGER";
    if (normalized === "pm") return "PROJECT_MANAGER";
    if (normalized === "finance") return "FINANCE_MANAGER";
    if (normalized === "admin") return "ADMIN";
    if (
        [
            "SUPER_ADMIN", 
            "ADMIN",
            "SALES_MANAGER",
            "OPERATIONS_MANAGER",
            "FINANCE_MANAGER",
            "HR_MANAGER",
            "CONTENT_MANAGER",
        ].includes(value)
    ) {
        return value;
    }
    return role;
};

const roleLabel = (role) => {
    if (role === "SUPER_ADMIN") return "Super Admin";
    if (role === "ADMIN") return "Admin";
    if (role === "SALES_MANAGER") return "Sales Manager";
    if (role === "PROJECT_MANAGER") return "Project Manager";
    if (role === "FINANCE_MANAGER") return "Finance Manager";
    if (role === "OPERATIONS_MANAGER") return "Operations Manager";
    if (role === "HR_MANAGER") return "HR Manager";
    if (role === "CONTENT_MANAGER") return "Content Manager";
    if (role === "employee") return "Employee";
    return role;
};

const toApiStatus = (status) => {
    if (typeof status === "boolean") return status ? "active" : "inactive";
    const value = String(status || "").toLowerCase();
    return value === "inactive" ? "inactive" : "active";
};

const relativeTime = (iso) => {
    if (!iso) return "Never";
    const timestamp = new Date(iso).getTime();
    if (Number.isNaN(timestamp)) return "Never";
    const diffMs = Date.now() - timestamp;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};

const UserManagement = () => {
    const { data, isLoading, isError, error, refetch } = useGetUsersQuery({ page: 1, limit: 100 });
    const [addUser, { isLoading: isCreating }] = useAddUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [userOverrides, setUserOverrides] = useState({});
    const [deletedUserIds, setDeletedUserIds] = useState(new Set());
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const users = useMemo(() => {
        const source = Array.isArray(data?.users)
            ? data.users.filter((u) => !u?.isDeleted && !deletedUserIds.has(u?._id))
            : [];
        return source.map((user) => {
            const base = {
                id: user._id,
                name: user.name || "-",
                email: user.email || "-",
                role: normalizeRole(user.role),
                status: String(user.status || "").toLowerCase() === "active",
                lastLogin: relativeTime(user.lastLogin || user.updatedAt || user.createdAt),
                phone: user.phone || "",
                department: user.department || "",
            };
            return { ...base, ...(userOverrides[user._id] || {}) };
        });
    }, [data, userOverrides, deletedUserIds]);

    const toggleStatus = (id) => {
        setUserOverrides((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                status: !(prev[id]?.status ?? users.find((u) => u.id === id)?.status),
            },
        }));
    };

    const handleCreateUser = async (userData) => {
        try {
            await addUser({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                role: toApiRole(userData.role),
                status: toApiStatus(userData.status),
            }).unwrap();
            setShowForm(false);
            setSelectedUser(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create user");
        }
    };

    const handleUpdateUser = async (userData) => {
        if (!selectedUser?.id) return;
        try {
            await updateUser({
                id: selectedUser.id,
                data: {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    status: toApiStatus(userData.status),
                    role: toApiRole(userData.role),
                },
            }).unwrap();

            setShowForm(false);
            setSelectedUser(null);
            await refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update user");
        }
    };

    const handleResetPassword = (newPassword) => {
        // Handle password reset logic here
        console.log(`Password reset for ${selectedUser.name}: ${newPassword}`);
        setShowReset(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async (id) => {
        if (!id) return;
        const ok = window.confirm("Are you sure you want to delete this user?");
        if (!ok) return;
        try {
            await deleteUser(id).unwrap();
            setDeletedUserIds((prev) => new Set(prev).add(id));
            setUserOverrides((prev) => {
                if (!prev[id]) return prev;
                const next = { ...prev };
                delete next[id];
                return next;
            });
            if (selectedUser?.id === id) {
                setShowDrawer(false);
                setSelectedUser(null);
            }
            await refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Stats calculation
    const stats = [
        { 
            label: 'Total Users', 
            value: users.length, 
            icon: Users, 
            color: 'from-primary to-cyan-500' 
        },
        { 
            label: 'Active Users', 
            value: users.filter(u => u.status).length, 
            icon: CheckCircle, 
            color: 'from-emerald-500 to-teal-500' 
        },
        { 
            label: 'Admins', 
            value: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length, 
            icon: Shield, 
            color: 'from-primary/80 to-pink-500' 
        },
        { 
            label: 'Sales Team', 
            value: users.filter(u => u.role === 'SALES_MANAGER').length, 
            icon: UserCog, 
            color: 'from-amber-500 to-orange-500' 
        },
    ];

    return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/10 to-slate-900 p-6 [.light_&]:bg-slate-100">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent [.light_&]:from-blue-600 [.light_&]:to-purple-600">
                            Identity & Access
                        </h1>
                        <p className="text-slate-400 mt-1 [.light_&]:text-slate-500">Manage users, roles, and permissions</p>

                    </div>

                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        <button className="p-3 bg-dark-800/50 border border-dark-600/30 rounded-xl hover:bg-slate-700/50 transition-colors [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-100">
                            <Download className="w-5 h-5 text-slate-400 [.light_&]:text-slate-500" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setShowForm(true);
                            }}
                            className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"

                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Create User
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
                            <div className="relative bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl p-6 overflow-hidden [.light_&]:bg-white/70 [.light_&]:border-slate-200">

                                <div className="flex justify-between items-start">
                                    <div>
                                         <p className="text-slate-400 text-sm [.light_&]:text-slate-500">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1 [.light_&]:text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl opacity-80`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl p-4 [.light_&]:bg-white/70 [.light_&]:border-slate-200">
                   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 w-full">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 [.light_&]:text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="w-full bg-dark-900 border border-dark-600/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-900 [.light_&]:placeholder-slate-400"

                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                                               className="bg-dark-900 border border-dark-600/30 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-900"

                            >
                                <option value="ALL">All Roles</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SALES_MANAGER">Sales Manager</option>
                                <option value="OPERATIONS_MANAGER">Operations Manager</option>
                                <option value="FINANCE_MANAGER">Finance Manager</option>
                                <option value="HR_MANAGER">HR Manager</option>
                                <option value="CONTENT_MANAGER">Content Manager</option>
                            </select>
                            
                            <button className="p-3 bg-dark-900 border border-dark-600/30 rounded-xl hover:bg-dark-800 transition-colors [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-100">
                                <Filter className="w-5 h-5 text-slate-400 [.light_&]:text-slate-500" />

                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
               {/* Users List */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl overflow-hidden shadow-2xl"
>
  {/* DESKTOP TABLE */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-dark-900/50 border-b border-dark-600/30">
          {['User','Mobile','Role','Status','Last Login','Actions'].map((header, idx) => (
            <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-700">
        {filteredUsers.map((user) => (
          <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
            <td className="px-6 py-4 font-semibold text-white">
              {user.name}
              <div className="text-xs text-slate-400">{user.email}</div>
            </td>
            <td className="px-6 py-4 text-slate-300">{user.phone || "-"}</td>
            <td className="px-6 py-4 text-slate-300">{roleLabel(user.role)}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs ${
                user.status ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}>
                {user.status ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-400">{user.lastLogin}</td>
            <td className="px-6 py-4 flex gap-2">
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="p-2 hover:bg-rose-900/30 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowDrawer(true);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* MOBILE CARDS */}
  <div className="md:hidden p-4 space-y-4">
    {filteredUsers.map((user) => (
      <div key={user.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <span className={`px-2 py-1 rounded-full text-xs ${
            user.status ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          }`}>
            {user.status ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="text-sm text-slate-400">
          📱 {user.phone || "-"}
        </div>

        <div className="text-sm text-slate-400">
          👤 {roleLabel(user.role)}
        </div>

        <div className="text-xs text-slate-500">
          Last login: {user.lastLogin}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="px-3 py-1.5 bg-rose-500/20 text-rose-400 rounded-lg text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowDrawer(true);
            }}
            className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm"
          >
            Manage
          </button>
        </div>
      </div>
    ))}
  </div>
</motion.div>

                {/* Modals */}
                <AnimatePresence>
                    {showForm && (
                        <UserFormModal
                            user={selectedUser}
                            onClose={() => {
                                setShowForm(false);
                                setSelectedUser(null);
                            }}
                            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                            isLoading={isCreating || isUpdating}
                        />
                    )}

                    {showReset && (
                        <ResetPasswordModal
                            user={selectedUser}
                            onClose={() => {
                                setShowReset(false);
                                setSelectedUser(null);
                            }}
                            onConfirm={handleResetPassword}
                        />
                    )}

                    {showDrawer && (
                        <UserDetailsDrawer
                            user={selectedUser}
                            onClose={() => {
                                setShowDrawer(false);
                                setSelectedUser(null);
                            }}
                            onDelete={() => {
                                handleDeleteUser(selectedUser?.id);
                            }}
                            onEdit={() => {
                                setShowDrawer(false);
                                setShowForm(true);
                            }}
                            onReset={() => {
                                setShowDrawer(false);
                                setShowReset(true);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserManagement;
