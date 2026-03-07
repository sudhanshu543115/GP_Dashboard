import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCcw } from "lucide-react";
import {
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../redux/api/projectApiSlice";
import { toast } from "../../utils/toast";

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "On Hold", value: "HOLD" },
  { label: "Closed", value: "CLOSED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Upcoming", value: "UPCOMING" },
];

const formatStatus = (status) =>
  String(status || "")
    .toLowerCase()
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const getCountdownEnd = (item) => {
  if (!item?.createdAt || !item?.duration?.value || !item?.duration?.unit) return null;
  const start = new Date(item.createdAt);
  const value = Number(item.duration.value);
  const unit = String(item.duration.unit).toUpperCase();
  if (Number.isNaN(start.getTime()) || Number.isNaN(value)) return null;

  const end = new Date(start);
  if (unit === "DAYS") end.setDate(end.getDate() + value);
  else if (unit === "WEEKS") end.setDate(end.getDate() + value * 7);
  else if (unit === "MONTHS") end.setMonth(end.getMonth() + value);
  else return null;
  return end;
};

const countdownText = (endDate, nowTs) => {
  if (!endDate) return "-";
  const diff = Math.max(0, endDate.getTime() - nowTs);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
};

export default function ManageProjects() {
  const [nowTs, setNowTs] = useState(Date.now());
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetProjectsQuery({
    page: 1,
    limit: 1000,
  });
  const [updateProject] = useUpdateProjectMutation();

  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const projects = useMemo(() => {
    const source = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.projects)
        ? data.data.projects
        : Array.isArray(data)
          ? data
          : [];

    return source.map((item, idx) => ({
      id: item?._id || String(idx + 1),
      projectName: item?.title || "-",
      company: item?.createdBy?.name || "Global Projects",
      projectCode: item?.projectCode || "-",
      clientCode:
        item?.clientCode ||
        item?.client?.clientCode ||
        item?.client?.code ||
        (typeof item?.client === "string" ? item.client : "") ||
        item?.client?._id ||
        "-",
      totalApplications: item?.totalApplications ?? 0,
      lastActivity: item?.lastActivity
        ? new Date(item.lastActivity).toLocaleString("en-GB")
        : "-",
      country: item?.country || "-",
      status: String(item?.status || "AVAILABLE").toUpperCase(),
      countdownEnd: getCountdownEnd(item),
    }));
  }, [data]);

  useEffect(() => {
    setSelectedStatus((prev) => {
      const next = { ...prev };
      projects.forEach((p) => {
        if (!next[p.id]) next[p.id] = p.status;
      });
      return next;
    });
  }, [projects]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, projects.length]);

  const handleStatusChange = (id, value) => {
    setSelectedStatus((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (projectId) => {
    const nextStatus = selectedStatus[projectId];
    if (!nextStatus) return;
    const currentProject = projects.find((p) => p.id === projectId);

    try {
      setUpdatingId(projectId);
      await updateProject({
        _id: projectId,
        data: {
          title: currentProject?.projectName || "",
          status: nextStatus,
        },
      }).unwrap();
      toast.success("Project status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(projects.length / entriesPerPage));
  const paginatedProjects = projects.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  return (
    <div className="min-h-screen bg-dark-900 p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Manage Projects</h1>
          <p className="text-text-muted">Project details with API-based status update</p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-dark-700/50 bg-dark-850 px-4 py-3">
          <div className="text-sm text-text-muted">
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="mx-2 rounded-lg border border-dark-700 bg-dark-900 px-2 py-1 text-text-primary outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>
          <div className="text-sm text-text-muted">
            {projects.length > 0
              ? `Showing ${(currentPage - 1) * entriesPerPage + 1} to ${Math.min(
                  currentPage * entriesPerPage,
                  projects.length,
                )} of ${projects.length}`
              : "Showing 0 to 0 of 0"}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-dark-700/50 bg-dark-850 shadow-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700/50 bg-dark-800/60">
                {[
                  "S.No",
                  "Project Name",
                  "Company",
                  "Project Code",
                  "Client Code",
                  "Applications",
                  "Last Activity",
                  "Country",
                  "Time Left",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-muted"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-text-muted">
                    Loading projects...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-rose-400">
                    {error?.data?.message || "Failed to load projects"}
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-text-muted">
                    No projects found
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-4 text-text-muted font-semibold">
                      {(currentPage - 1) * entriesPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-4 font-semibold text-text-primary">{project.projectName}</td>
                    <td className="px-4 py-4 text-blue-400">{project.company}</td>
                    <td className="px-4 py-4 text-text-muted">{project.projectCode}</td>
                    <td className="px-4 py-4 text-text-muted">{project.clientCode}</td>
                    <td className="px-4 py-4 text-emerald-400 font-semibold">{project.totalApplications}</td>
                    <td className="px-4 py-4 text-text-muted">{project.lastActivity}</td>
                    <td className="px-4 py-4 text-text-muted">{project.country}</td>
                    <td className="px-4 py-4 text-amber-400 font-medium">
                      {countdownText(project.countdownEnd, nowTs)}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={selectedStatus[project.id] || project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className="rounded-xl border border-dark-700 bg-dark-900 px-3 py-2 text-text-primary outline-none focus:border-primary"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1 text-[11px] text-text-muted">
                        Current: {formatStatus(project.status)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleUpdateStatus(project.id)}
                        disabled={updatingId === project.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                      >
                        <RefreshCcw className={`h-4 w-4 ${updatingId === project.id ? "animate-spin" : ""}`} />
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-dark-700 bg-dark-850 px-3 py-2 text-sm text-text-primary disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                currentPage === i + 1
                  ? "border-primary bg-primary text-white"
                  : "border-dark-700 bg-dark-850 text-text-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-dark-700 bg-dark-850 px-3 py-2 text-sm text-text-primary disabled:opacity-50"
          >
            Next
          </button>
        </div>

       
      </div>
    </div>
  );
}
