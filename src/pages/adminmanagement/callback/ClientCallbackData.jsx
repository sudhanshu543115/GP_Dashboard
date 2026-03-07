import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, PhoneCall, Trash2, Pencil } from "lucide-react";
import {
  useGetRequestCallsQuery,
  useAddRequestCallMutation,
  useUpdateRequestCallMutation,
  useDeleteRequestCallMutation,
} from "../../../redux/api/clientApiSlice";
import { toast } from "../../../utils/toast";

const ClientCallbackData = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchApplied, setSearchApplied] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", email: "", phone: "" });
    const { data, isLoading, isError, error, refetch } = useGetRequestCallsQuery({
        page: 1,
        limit: 1000,
    });
    const [addRequestCall, { isLoading: isAdding }] = useAddRequestCallMutation();
    const [updateRequestCall, { isLoading: isUpdating }] = useUpdateRequestCallMutation();
    const [deleteRequestCall, { isLoading: isDeleting }] = useDeleteRequestCallMutation();
    const hasShownLoadToast = useRef(false);

    const rows = useMemo(() => {
        const source = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return source.map((item, index) => ({
            id: index + 1,
            _id: item._id,
            name: item.name || "-",
            email: item.email || "-",
            phone: item.phone || "-",
            dateOfCalling: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-GB")
                : "-",
            remarks: item.remarks || item.status || "-",
        }));
    }, [data]);

    useEffect(() => {
        if (!isLoading && !isError && data && !hasShownLoadToast.current) {
            toast.info("Callback requests loaded");
            hasShownLoadToast.current = true;
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Failed to load callback requests");
        }
    }, [isError, error]);

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.name, r.email, r.phone, r.remarks].join(' ').toLowerCase().includes(q)
        );
    }, [rows, searchApplied]);

    const handleDelete = async (id) => {
        try {
            await deleteRequestCall(id).unwrap();
            refetch();
            toast.success("Request deleted successfully");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete request");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addRequestCall(formData).unwrap();
            refetch();
            toast.success("Request created successfully");
            setFormData({ name: "", email: "", phone: "" });
            setIsAddOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create request");
        }
    };

    const handleOpenEdit = (row) => {
        setEditingId(row._id);
        setEditFormData({
            name: row.name || "",
            email: row.email || "",
            phone: row.phone || "",
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingId) return;
        try {
            await updateRequestCall({
                id: editingId,
                data: {
                    name: editFormData.name,
                    email: editFormData.email,
                    phone: editFormData.phone,
                },
            }).unwrap();
            refetch();
            toast.success("Request updated successfully");
            setIsEditOpen(false);
            setEditingId(null);
            setEditFormData({ name: "", email: "", phone: "" });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update request");
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 p-6 text-text-muted font-sans">
            <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
    Client Callback Data
  </h1>

  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto">
    <input
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search clients..."
      className="w-full sm:w-64 px-4 py-2.5 bg-dark-800 border border-dark-600 focus:ring-2 focus:ring-primary/30 rounded-xl text-sm text-text-primary outline-none"
    />

    <button
      onClick={() => setSearchApplied(searchInput)}
      className="px-4 py-2.5 rounded-xl bg-dark-900 hover:bg-dark-800 font-semibold"
    >
      Apply
    </button>

    <button
      onClick={() => {
        setSearchInput("");
        setSearchApplied("");
      }}
      className="px-4 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 font-semibold"
    >
      Clear
    </button>

    <button
      onClick={() => setIsAddOpen((p) => !p)}
      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark font-semibold"
    >
      Add Request
    </button>
  </div>
</div>

            {isAddOpen ? (
                <form onSubmit={handleAdd} className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Name"
                        className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="Email"
                        className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="Phone"
                        className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <button type="submit" disabled={isAdding} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-text-primary font-bold disabled:opacity-60 transition-colors">
                        {isAdding ? "Saving..." : "Save"}
                    </button>
                </form>
            ) : null}

            {isEditOpen ? (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-dark-850 border border-dark-700 rounded-2xl p-5 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">Edit Callback Request</h2>
                            <button
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setEditingId(null);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-dark-700 text-text-primary hover:bg-dark-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-3">
                            <input
                                value={editFormData.name}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, name: e.target.value }))
                                }
                                placeholder="Name"
                                className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, email: e.target.value }))
                                }
                                placeholder="Email"
                                className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <input
                                value={editFormData.phone}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, phone: e.target.value }))
                                }
                                placeholder="Phone"
                                className="px-4 py-2.5 bg-dark-800 border border-dark-600 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-text-primary font-bold disabled:opacity-60 transition-colors"
                            >
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}

            {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-4">
  {isLoading ? (
    <div className="text-center py-8">
      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
      Loading...
    </div>
  ) : filteredRows.length === 0 ? (
    <div className="text-center py-8 text-text-muted">
      No callback requests found
    </div>
  ) : (
    filteredRows.map((row) => (
      <div
        key={row._id}
        className="bg-dark-850 border border-dark-700/50 rounded-xl p-4 space-y-3"
      >
        <div className="flex justify-between">
          <div>
            <p className="font-semibold text-text-primary">{row.name}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
            <p className="text-xs text-text-muted">{row.phone}</p>
          </div>
          <span className="text-xs text-text-muted">
            {row.dateOfCalling}
          </span>
        </div>

        <div className="text-sm text-text-muted truncate">
          {row.remarks}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-dark-700">
          <a
            href={`tel:${row.phone}`}
            className="text-primary text-sm"
          >
            Call
          </a>

          <button
            onClick={() => handleOpenEdit(row)}
            className="text-blue-400 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="text-rose-400 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>

            {/* ================= DESKTOP TABLE ================= */}
<div className="hidden md:block bg-dark-850 border border-dark-700/50 rounded-2xl overflow-hidden shadow-xl">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-dark-800/50 border-b border-dark-700/50">
        <tr className="text-text-muted uppercase text-xs">
          <th className="px-4 py-3 text-left">#</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Date</th>
          <th className="px-4 py-3 text-left">Remarks</th>
          <th className="px-4 py-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-dark-700/50">
        {filteredRows.map((row) => (
          <tr key={row._id} className="hover:bg-dark-700/30">
            <td className="px-4 py-3">{row.id}</td>
            <td className="px-4 py-3 font-semibold text-text-primary">{row.name}</td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3">{row.phone}</td>
            <td className="px-4 py-3">{row.dateOfCalling}</td>
            <td className="px-4 py-3 max-w-xs truncate">{row.remarks}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <a
                  href={`tel:${row.phone}`}
                  className="p-2 rounded-lg bg-primary/10 text-primary"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleOpenEdit(row)}
                  className="p-2 rounded-lg bg-dark-700 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(row._id)}
                  className="p-2 rounded-lg bg-dark-700 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </div>
    );
};

export default ClientCallbackData;
