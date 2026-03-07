import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ExternalLink, FileText, CheckCircle2, Clock, AlertCircle, Eye, MoreVertical } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useGetInvoicesQuery } from '../../../redux/api/invoicesApiSlice';

const InvoiceHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const { data, isLoading, isError } = useGetInvoicesQuery();

    const invoices = useMemo(() => {
        const rawData = data?.data || [];
        return rawData.map((inv) => {
            // Normalize status to match UI filters (e.g., "pending" -> "Pending")
            const rawStatus = inv.status || 'Pending';
            const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

            return {
                id: inv.invoice_no || inv.invoiceNumber || inv._id?.substring(0, 8).toUpperCase() || 'INV-???',
                client: inv.client?.name || inv.client || 'Unknown Client',
                date: inv.invoice_date 
                    ? new Date(inv.invoice_date).toLocaleDateString() 
                    : (inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-')),
                amount: inv.total_amount !== undefined ? inv.total_amount : (inv.totalAmount || inv.amount || 0),
                status: normalizedStatus,
                type: inv.project?.title || 'General',
            };
        });
    }, [data]);

   const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
        const matchesSearch =
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.client.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
}, [invoices, searchTerm, statusFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Overdue': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-text-muted bg-dark-700/50 border-dark-600/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'Pending': return <Clock className="w-3.5 h-3.5" />;
            case 'Overdue': return <AlertCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    // Calculate dynamic stats
    const totalOutstanding = useMemo(() => 
        invoices
            .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
            .reduce((acc, curr) => acc + curr.amount, 0)
    , [invoices]);

    const StatCard = ({ title, value, highlight }) => (
    <div className="bg-dark-850 border border-dark-600 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
            {title}
        </p>
        <h4 className={twMerge(
            "text-2xl font-bold text-text-primary",
            highlight
        )}>
            {value}
        </h4>
    </div>
);

    return (
       <div className="space-y-6">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Invoice History
            </h2>
            <p className="text-text-muted text-sm">
                Review, track, and manage all generated invoices.
            </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-text-primary rounded-xl border border-dark-600 transition-all">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
                Export
            </span>
        </button>
    </div>

    {/* FILTERS */}
    <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
                type="text"
                placeholder="Search by ID or Client..."
                className="w-full bg-dark-850 border border-dark-600 rounded-xl pl-12 pr-4 py-3 text-text-primary outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <select
            className="bg-dark-850 border border-dark-600 rounded-xl px-4 py-3 text-text-primary outline-none focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
        >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
        </select>
    </div>

    {/* MOBILE VIEW */}
    <div className="md:hidden space-y-4">
        {filteredInvoices.map((invoice) => (
            <div
                key={invoice.id}
                className="bg-dark-850 border border-dark-600 rounded-xl p-4 space-y-3"
            >
                <div className="flex justify-between">
                    <div>
                        <p className="font-semibold text-text-primary">
                            {invoice.id}
                        </p>
                        <p className="text-sm text-text-muted">
                            {invoice.client}
                        </p>
                    </div>
                    <div className={twMerge(
                        "px-2 py-1 text-xs rounded-lg border",
                        getStatusColor(invoice.status)
                    )}>
                        {invoice.status}
                    </div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">{invoice.date}</span>
                    <span className="font-bold text-text-primary">
                        ₹{invoice.amount.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-dark-700">
                    <button className="text-primary text-sm">
                        View
                    </button>
                    <button className="text-text-muted text-sm">
                        Download
                    </button>
                </div>
            </div>
        ))}
    </div>

    {/* DESKTOP TABLE */}
    <div className="hidden md:block bg-dark-850 border border-dark-600 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-dark-900 border-b border-dark-700">
                    <tr className="text-text-muted uppercase text-xs">
                        <th className="px-6 py-4 text-left">Invoice ID</th>
                        <th className="px-6 py-4 text-left">Client</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Type</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-dark-700">
                    {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-dark-800/30">
                            <td className="px-6 py-4 font-semibold text-text-primary">
                                {invoice.id}
                            </td>
                            <td className="px-6 py-4">{invoice.client}</td>
                            <td className="px-6 py-4">{invoice.date}</td>
                            <td className="px-6 py-4 font-bold">
                                ₹{invoice.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">{invoice.type}</td>
                            <td className="px-6 py-4">
                                <div className={twMerge(
                                    "inline-flex px-2 py-1 text-xs rounded-lg border",
                                    getStatusColor(invoice.status)
                                )}>
                                    {invoice.status}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-primary">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
            title="Total Outstanding"
            value={`₹${totalOutstanding.toLocaleString()}`}
        />
        <StatCard
            title="Collected (30 days)"
            value="₹45,800"
            highlight="text-emerald-400"
        />
        <StatCard
            title="Avg. Collection Time"
            value="14 Days"
        />
    </div>
</div>
    );
};

export default InvoiceHistory;