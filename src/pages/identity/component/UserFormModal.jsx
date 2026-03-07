import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
  "OPERATIONS_MANAGER",
  "FINANCE_MANAGER",
  "HR_MANAGER",
  "CONTENT_MANAGER",
];

const UserFormModal = ({ user, onClose, onSubmit, isLoading = false }) => {
  const isEdit = Boolean(user);

  const initialRole = useMemo(() => {
    const value = String(user?.role || "").toUpperCase();
    return ROLE_OPTIONS.includes(value) ? value : "SALES_MANAGER";
  }, [user?.role]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    status:
      typeof user?.status === "boolean"
        ? (user.status ? "active" : "inactive")
        : (String(user?.status || "active").toLowerCase() === "inactive" ? "inactive" : "active"),
    password: "",
    role: initialRole,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-dark-600/30 bg-dark-900 p-4 sm:p-6 [.light_&]:border-slate-200 [.light_&]:bg-white"
      >
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white [.light_&]:text-slate-900">
            {isEdit ? "Edit User" : "Create User"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-dark-800 [.light_&]:hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300 [.light_&]:text-slate-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-dark-600/30 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary [.light_&]:border-slate-200 [.light_&]:bg-white [.light_&]:text-slate-900"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-dark-600/30 px-4 py-2 text-slate-200 hover:bg-dark-800 [.light_&]:border-slate-300 [.light_&]:text-slate-700 [.light_&]:hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-primary disabled:opacity-60"
            >
              {isLoading ? "Saving..." : isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserFormModal;
