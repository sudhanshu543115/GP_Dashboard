import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Activity,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCentersQuery,
  useAddCenterMutation,
  useUpdateCenterMutation,
  useDeleteCenterMutation,
} from "../../redux/api/centerApiSlice";
import { toast } from "../../utils/toast";

const statusColors = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  type: "",
  capacity: "",
  status: "ACTIVE",
};

const ManageContracts = () => {
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const entries = 10;

  const { data, isLoading, isError, error, refetch } = useGetCentersQuery({
    page,
    limit: entries,
  });
  const [addCenter, { isLoading: isAdding }] = useAddCenterMutation();
  const [updateCenter, { isLoading: isUpdating }] = useUpdateCenterMutation();
  const [deleteCenter, { isLoading: isDeleting }] = useDeleteCenterMutation();

  const centers = useMemo(() => {
    if (Array.isArray(data?.data?.centers)) return data.data.centers;
    if (Array.isArray(data?.message?.centers)) return data.message.centers;
    if (Array.isArray(data?.centers)) return data.centers;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.message)) return data.message;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const pagination = useMemo(() => {
    const fromApi = data?.data?.pagination || data?.message?.pagination || data?.pagination;
    if (fromApi) return fromApi;
    return {
      page,
      limit: entries,
      total: centers.length,
      pages: Math.max(1, Math.ceil(centers.length / entries)),
    };
  }, [data, page, entries, centers.length]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      code: form.code,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      type: form.type,
      capacity: Number(form.capacity || 0),
      status: String(form.status || "ACTIVE").toUpperCase(),
    };

    try {
      if (editingId) {
        await updateCenter({ id: editingId, data: payload }).unwrap();
        toast.success("Center updated successfully");
      } else {
        await addCenter(payload).unwrap();
        toast.success("Center created successfully");
        setPage(1);
      }
      await refetch();
      setForm(emptyForm);
      setEditingId(null);
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save center");
    }
  };

  const handleEdit = (center) => {
    setEditingId(center._id);
    setForm({
      name: center.name || "",
      code: center.code || "",
      email: center.email || "",
      phone: center.phone || "",
      address: center.address || "",
      city: center.city || "",
      state: center.state || "",
      pincode: center.pincode || "",
      type: center.type || "",
      capacity: String(center.capacity ?? ""),
      status: String(center.status || (center.isActive ? "ACTIVE" : "INACTIVE")).toUpperCase(),
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this center?")) return;
    try {
      await deleteCenter(id).unwrap();
      toast.success("Center deleted successfully");
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete center");
    }
  };

  const stats = useMemo(() => {
    const active = centers.filter(
      (c) => String(c.status || (c.isActive ? "ACTIVE" : "INACTIVE")).toUpperCase() === "ACTIVE",
    ).length;
    const inactive = centers.filter(
      (c) => String(c.status || (c.isActive ? "ACTIVE" : "INACTIVE")).toUpperCase() !== "ACTIVE",
    ).length;
    const totalCapacity = centers.reduce((sum, c) => sum + Number(c.capacity || 0), 0);
    return {
      total: pagination.total || 0,
      active,
      inactive,
      totalCapacity,
    };
  }, [centers, pagination.total]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pt-4 sm:pt-6 animate-fade-in text-text-primary pb-8 sm:pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-dark-600 pb-5 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-1">
            Center Management
          </h1>
          <p className="text-text-muted text-xs sm:text-sm">Centralized control of all centers</p>
        </div>

        <button
          onClick={() => {
            if (open) {
              setOpen(false);
              setEditingId(null);
              setForm(emptyForm);
            } else {
              setOpen(true);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> {editingId ? "Edit Center" : "New Center"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Total Centers", value: stats.total, icon: Activity },
          { label: "Active", value: stats.active, icon: CheckCircle },
          { label: "Inactive", value: stats.inactive, icon: Activity },
          { label: "Total Capacity", value: stats.totalCapacity, icon: Activity },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-md shadow-black/10"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">{s.label}</p>
                <h3 className="text-3xl font-black mt-1">{s.value}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 grid md:grid-cols-3 gap-4"
          >
            {[
              ["name", "Center Name"],
              ["code", "Center Code"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
              ["type", "Type"],
              ["capacity", "Capacity"],
            ].map(([name, label]) => (
              <input
                key={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                className="bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl px-4 py-3 text-text-primary placeholder-text-muted"
              />
            ))}

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl px-4 py-3 text-text-primary"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              disabled={isAdding || isUpdating}
              className="md:col-span-3 bg-primary py-3 rounded-xl text-white font-bold disabled:opacity-60"
            >
              {isAdding || isUpdating ? "Saving..." : editingId ? "Update Center" : "Save Center"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>


      <div className="w-full bg-dark-800 rounded-2xl sm:rounded-3xl border border-dark-600/50 shadow-md shadow-black/10">
        <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1120px] text-xs sm:text-sm">
          <thead className="bg-dark-900/70">
            <tr>
              {[
                "S.No",
                "Name",
                "Code",
                "Address",
                "Email",
                "Phone",
                "Capacity",
                "Status",
                "Created At",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-3 sm:px-4 py-3 text-left text-[11px] uppercase text-text-muted whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-700">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading centers...
                  </span>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-rose-400">
                  {error?.data?.message || "Failed to load centers"}
                </td>
              </tr>
            ) : centers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-14 text-center text-text-muted">
                  No centers found
                </td>
              </tr>
            ) : (
              centers.map((c, idx) => {
                const normalizedStatus = String(
                  c.status || (c.isActive ? "ACTIVE" : "INACTIVE"),
                ).toUpperCase();
                return (
                  <tr key={c._id} className="hover:bg-dark-700/40 transition">
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">{(page - 1) * entries + idx + 1}</td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">{c.name || "-"}</td>
                    <td className="px-3 sm:px-4 py-3 text-text-muted whitespace-nowrap">{c.code || "-"}</td>
                    <td className="px-3 sm:px-4 py-3 text-text-muted whitespace-nowrap">{c.address || "-"}</td>
                    <td className="px-3 sm:px-4 py-3 text-text-muted whitespace-nowrap">{c.email || "-"}</td>
                    <td className="px-3 sm:px-4 py-3 text-text-muted whitespace-nowrap">{c.phone || "-"}</td>
                    <td className="px-3 sm:px-4 py-3 text-emerald-400 font-semibold whitespace-nowrap">{c.capacity ?? 0}</td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          statusColors[normalizedStatus] || statusColors.active
                        }`}
                      >
                        {normalizedStatus}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-text-muted whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(c)} className="cursor-pointer">
                          <Edit className="w-4 text-text-muted hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="cursor-pointer"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between text-text-muted text-xs sm:text-sm">
        <span>
          Showing {centers.length ? (page - 1) * entries + 1 : 0} to{" "}
          {Math.min(page * entries, pagination.total || 0)} of {pagination.total || 0}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1 rounded border border-dark-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages || 1, p + 1))}
            disabled={page >= (pagination.pages || 1)}
            className="p-1 rounded border border-dark-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageContracts;