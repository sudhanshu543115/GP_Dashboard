import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  X,
  MoreVertical,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  useGetFormsQuery,
  useLazyGetFormByFormIdQuery,
  useUpdateFormStatusMutation,
  useAssignFormMutation,
  useDeleteFormMutation,
} from "../../../redux/api/clientApiSlice";

const ClientQueries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('[data-actions-menu="true"]')) return;
      setOpenActionId(null);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const { data, isLoading, isError, error } = useGetFormsQuery({
    page: 1,
    limit: 1000,
    search: searchTerm,
    status: statusFilter === "ALL" ? "" : statusFilter,
  });

  const [getFormByFormId, { data: selectedForm, isFetching: isDetailLoading }] =
    useLazyGetFormByFormIdQuery();

  const [updateFormStatus] = useUpdateFormStatusMutation();
  const [assignForm] = useAssignFormMutation();
  const [deleteForm] = useDeleteFormMutation();

  const forms = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const stats = useMemo(() => {
    return {
      pending: forms.filter((f) => f.status === "NEW").length,
      inProgress: forms.filter((f) => f.status === "IN_PROGRESS").length,
      resolved: forms.filter((f) => f.status === "RESOLVED").length,
    };
  }, [forms]);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "IN_PROGRESS":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "NEW":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateFormStatus({ id, status });
  };

  const handleDelete = async (id) => {
    await deleteForm(id);
    if (selectedFormId) setSelectedFormId(null);
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6 text-text-muted space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 border-b border-dark-700/50 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Client Queries
          </h1>
          <p className="text-sm text-text-muted">
            Manage and track client support tickets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Form ID..."
              className="w-full pl-10 pr-4 py-2 bg-dark-850 border border-dark-700/50 rounded-xl text-sm text-text-primary focus:border-primary outline-none"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 bg-dark-850 border border-dark-700/50 rounded-xl text-sm text-text-primary focus:border-primary outline-none"
            >
              <option value="ALL">All</option>
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={AlertCircle} color="red" value={stats.pending} label="New" />
        <StatCard icon={Clock} color="yellow" value={stats.inProgress} label="In Progress" />
        <StatCard icon={CheckCircle} color="green" value={stats.resolved} label="Resolved" />
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-dark-850 border border-dark-700/50 rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-mono text-primary text-sm">{form.formId}</p>
                <p className="text-text-primary font-medium">
                  {[form.firstName, form.lastName].filter(Boolean).join(" ") || "-"}
                </p>
                <p className="text-xs text-text-muted">{form.email}</p>
              </div>
              <span
                className={twMerge(
                  "px-2 py-1 text-xs rounded-lg border",
                  getStatusColor(form.status)
                )}
              >
                {form.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-dark-850 border border-dark-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-800/50 text-text-muted uppercase text-xs border-b border-dark-700/50">
              <tr>
                <th className="px-6 py-4 text-left">Form ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-700/50">
              {forms.map((form) => (
                <tr key={form._id} className="hover:bg-dark-700/30">
                  <td className="px-6 py-4 font-mono text-primary">
                    {form.formId}
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {[form.firstName, form.lastName].join(" ")}
                  </td>
                  <td className="px-6 py-4">{form.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={twMerge(
                        "px-2 py-1 rounded-lg text-xs border",
                        getStatusColor(form.status)
                      )}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(form._id)}
                      className="text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS */}
      {selectedFormId && (
        <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-5">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-bold text-text-primary">
              Form Details
            </h2>
            <button onClick={() => setSelectedFormId(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, color, value, label }) => (
  <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 flex items-center gap-3">
    <div className={`p-3 bg-${color}-500/10 rounded-xl text-${color}-500`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  </div>
);

export default ClientQueries;