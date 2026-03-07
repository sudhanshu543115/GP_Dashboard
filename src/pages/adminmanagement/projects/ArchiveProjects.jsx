import React, { useMemo, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Archive,
  CheckCircle,
  Users,
  Eye,
} from "lucide-react";
import { useGetArchivedProjectsQuery } from "../../../redux/api/projectArchiveApiSlice";

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data, isLoading, isError, error } = useGetArchivedProjectsQuery();

  const projects = useMemo(() => {
    const source = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.projects)
        ? data.data.projects
        : Array.isArray(data)
          ? data
          : [];
    return source;
  }, [data]);

  const statuses = useMemo(() => {
    const set = new Set(
      projects.map((p) => String(p.status || "UNKNOWN").toUpperCase()),
    );
    return ["ALL", ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === "ALL") return projects;
    return projects.filter(
      (p) => String(p.status || "UNKNOWN").toUpperCase() === statusFilter,
    );
  }, [projects, statusFilter]);

  const stats = useMemo(() => {
    const totalArchived = filteredProjects.length;
    const completed = filteredProjects.filter(
      (p) => String(p.status || "").toUpperCase() === "COMPLETED",
    ).length;
    const withPdf = filteredProjects.filter((p) => Boolean(p?.pdf?.url)).length;
    const withImage = filteredProjects.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0,
    ).length;
    const featured = filteredProjects.filter((p) => Boolean(p.isFeatured)).length;
    const totalApplications = filteredProjects.reduce(
      (sum, p) => sum + Number(p.totalApplications || 0),
      0,
    );
    const totalViews = filteredProjects.reduce((sum, p) => sum + Number(p.totalViews || 0), 0);
    return {
      totalArchived,
      completed,
      withPdf,
      withImage,
      featured,
      totalApplications,
      totalViews,
    };
  }, [filteredProjects]);

  const statCards = [
    { label: "Total Archived", value: stats.totalArchived, icon: Archive, colorClass: { bg: 'bg-blue-500/10', text: 'text-blue-400' } },
    { label: "Completed", value: stats.completed, icon: CheckCircle, colorClass: { bg: 'bg-green-500/10', text: 'text-green-400' } },
    { label: "Applications", value: stats.totalApplications, icon: Users, colorClass: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' } },
    { label: "Views", value: stats.totalViews, icon: Eye, colorClass: { bg: 'bg-purple-500/10', text: 'text-purple-400' } },
  ];

  return (
    <div className="space-y-6 pt-6 text-text-muted font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Archived Projects Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">UI based on archive project API response</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dark-700/50 bg-dark-850 p-8 text-text-muted">
          Loading archived projects...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-rose-400">
          {error?.data?.message || "Failed to load archived projects"}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <StatCard key={index} label={stat.label} value={stat.value} icon={stat.icon} colorClass={stat.colorClass} />
            ))}
          </div>

          <div className="rounded-2xl border border-dark-700/50 bg-dark-850 p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Filter</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
    w-full sm:w-auto
    bg-dark-800
    border border-dark-600
    rounded-lg
    px-3 py-2
    text-xs text-black
    focus:ring-2 focus:ring-primary/30
    outline-none
  "
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:block rounded-2xl border border-dark-700/50 bg-dark-850 overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-700/50 text-sm text-text-muted">
              Total Archived Projects:{" "}
              <span className="font-semibold text-text-primary">{filteredProjects.length}</span>
            </div>
            <div className="overflow-x-auto">
              {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-4">
  {filteredProjects.length === 0 ? (
    <div className="p-6 text-center text-text-muted">
      No archived projects found
    </div>
  ) : (
    filteredProjects.map((p) => (
      <div
        key={p._id}
        className="bg-dark-850 border border-dark-700/50 rounded-xl p-4 space-y-3"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-text-primary">
              {p.title || "-"}
            </h3>
            <p className="text-xs text-text-muted">
              {p.projectCode || "-"}
            </p>
          </div>
          <span className="text-xs bg-dark-800 px-2 py-1 rounded-md text-text-muted">
            {p.status || "-"}
          </span>
        </div>

        <div className="text-sm text-text-muted space-y-1">
          <p><strong>Client:</strong> {p.client?.name || "-"}</p>
          <p><strong>Country:</strong> {p.country || "-"}</p>
          <p><strong>Applications:</strong> {p.totalApplications ?? 0}</p>
          <p><strong>Views:</strong> {p.totalViews ?? 0}</p>
          <p><strong>Visibility:</strong> {p.visibility || "-"}</p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-dark-700">
          <div className="flex gap-3">
            {p?.pdf?.url && (
              <a
                href={p.pdf.url}
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                PDF
              </a>
            )}

            {Array.isArray(p.images) && p.images[0]?.url && (
              <a
                href={p.images[0].url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 flex items-center gap-1"
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </a>
            )}
          </div>

          <span className="text-xs text-text-muted">
            {p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-GB")
              : "-"}
          </span>
        </div>
      </div>
    ))
  )}
</div>
              <table className="w-full text-sm">
                <thead className="bg-dark-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-muted">Title</th>
                    <th className="px-4 py-3 text-left text-text-muted">Slug</th>
                    <th className="px-4 py-3 text-left text-text-muted">Project Code</th>
                    <th className="px-4 py-3 text-left text-text-muted">Client</th>
                    <th className="px-4 py-3 text-left text-text-muted">Country</th>
                    <th className="px-4 py-3 text-left text-text-muted">Status</th>
                    <th className="px-4 py-3 text-left text-text-muted">Visibility</th>
                    <th className="px-4 py-3 text-left text-text-muted">Applications</th>
                    <th className="px-4 py-3 text-left text-text-muted">Views</th>
                    <th className="px-4 py-3 text-left text-text-muted">Featured</th>
                    <th className="px-4 py-3 text-left text-text-muted">Last Activity</th>
                    <th className="px-4 py-3 text-left text-text-muted">Created At</th>
                    <th className="px-4 py-3 text-left text-text-muted">Updated At</th>
                    <th className="px-4 py-3 text-left text-text-muted">PDF</th>
                    <th className="px-4 py-3 text-left text-text-muted">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50">
                  {filteredProjects.map((p) => (
                    <tr key={p._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-4 py-3 text-text-primary">{p.title || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{p.slug || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{p.projectCode || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {p.client?.name || "-"}
                        <div className="text-xs text-text-muted">{p.client?.email || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{p.country || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{p.status || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{p.visibility || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{p.totalApplications ?? 0}</td>
                      <td className="px-4 py-3 text-text-muted">{p.totalViews ?? 0}</td>
                      <td className="px-4 py-3 text-text-muted">{p.isFeatured ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {p.lastActivity ? new Date(p.lastActivity).toLocaleString("en-GB") : "-"}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {p.createdAt ? new Date(p.createdAt).toLocaleString("en-GB") : "-"}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {p.updatedAt ? new Date(p.updatedAt).toLocaleString("en-GB") : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {p?.pdf?.url ? (
                          <a
                            href={p.pdf.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-rose-400 hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            Open
                          </a>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {Array.isArray(p.images) && p.images[0]?.url ? (
                          <a
                            href={p.images[0].url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Open
                          </a>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="p-8 text-center text-text-muted">No archived projects found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="rounded-2xl border border-dark-700/50 bg-dark-850 p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{label}</p>
      <div className={`p-2 rounded-lg ${colorClass.bg}`}>
        <Icon className={`w-5 h-5 ${colorClass.text}`} />
      </div>
    </div>
    <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
  </div>
);

export default Dashboard;
