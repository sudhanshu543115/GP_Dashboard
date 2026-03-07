import React, { useMemo, useState } from 'react';
import { Download, Eye, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const initialRows = [
    { id: 1, projectCode: '88910/UNIK', projectType: 'Chat Support Process', projectDetails: 'UK inbound support', monthlyPayout: 'Rs 36000', totalRevenue: 'Rs 9,60,000', requiredDocuments: '1 MOU/Partnership Deed', paymentNo: '772988', securityDeposit: 'Rs 18000 (Non Refund)', country: 'United Kingdom', softwareRequirement: 'Dialer + CRM', closedCenter: 'No', projectStatus: 'ACTIVE', tatGoLive: '15 days', pdf: 'MOU_UK_88910.pdf' },
    { id: 2, projectCode: 'EKYC/660912', projectType: 'eKYC Chat Process', projectDetails: 'KYC pre-verification queue', monthlyPayout: 'Rs 46000', totalRevenue: 'Rs 12,40,000', requiredDocuments: 'NDA + KYC Annexure', paymentNo: 'Cheque 00914', securityDeposit: '15500/Per Seat (Refundable)', country: 'Romania', softwareRequirement: 'Ticketing + VPN', closedCenter: 'No', projectStatus: 'PENDING', tatGoLive: '21 days', pdf: 'EKYC_Contract_660912.pdf' },
    { id: 3, projectCode: '9091582', projectType: 'Chat Support Process (Japan)', projectDetails: 'Japanese bilingual support', monthlyPayout: 'Rs 46000', totalRevenue: 'Rs 14,10,000', requiredDocuments: 'SOW + SLA', paymentNo: 'NEFT 90922082', securityDeposit: 'Rs 15500 (Non Refund)', country: 'Japan', softwareRequirement: 'Softphone + QA Tool', closedCenter: 'Yes', projectStatus: 'ACTIVE', tatGoLive: '18 days', pdf: 'JP_9091582_SOW.pdf' },
    { id: 4, projectCode: '9818652/TX', projectType: 'KYC Verification Support', projectDetails: 'Document review & tagging', monthlyPayout: 'Rs 48000', totalRevenue: 'Rs 15,40,000', requiredDocuments: 'MOU + Annexure B', paymentNo: 'Forex Transfer', securityDeposit: 'Rs 16500 (Refundable)', country: 'France', softwareRequirement: 'OCR Suite', closedCenter: 'No', projectStatus: 'INACTIVE', tatGoLive: '25 days', pdf: 'FR_9818652.pdf' },
    { id: 5, projectCode: 'EUR/9982', projectType: 'Travel Blended Call Center', projectDetails: 'Voice + email blended', monthlyPayout: 'Rs 44000', totalRevenue: 'Rs 11,90,000', requiredDocuments: 'Agreement + GST', paymentNo: 'RTGS', securityDeposit: 'Rs 16000 (Refundable)', country: 'Europe', softwareRequirement: 'Dialer + CRM + WFM', closedCenter: 'No', projectStatus: 'ACTIVE', tatGoLive: '12 days', pdf: 'EUR_9982_Agreement.pdf' },
    { id: 6, projectCode: 'HNX/10987', projectType: 'Hospital Inbound Call Center', projectDetails: 'Appointment desk process', monthlyPayout: 'Rs 48000', totalRevenue: 'Rs 16,20,000', requiredDocuments: 'Clinical NDA + MSA', paymentNo: 'RTGS', securityDeposit: 'Rs 18000 (Refundable)', country: 'Australia', softwareRequirement: 'HIPAA-ready CRM', closedCenter: 'No', projectStatus: 'PENDING', tatGoLive: '30 days', pdf: 'HNX_10987_MSA.pdf' },
];

const AllProjects = () => {
    const [rows, setRows] = useState(initialRows);
    const [searchInput, setSearchInput] = useState('');
    const [searchApplied, setSearchApplied] = useState('');

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [
                r.projectCode, r.projectType, r.projectDetails, r.country, r.projectStatus,
                r.softwareRequirement, r.requiredDocuments, r.paymentNo,
            ]
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [rows, searchApplied]);

    const handleAdd = () => {
        const next = rows.length + 1;
        setRows((prev) => [
            ...prev,
            {
                id: next,
                projectCode: `NEW/${1000 + next}`,
                projectType: 'Inbound Process',
                projectDetails: 'Newly added project',
                monthlyPayout: 'Rs 42000',
                totalRevenue: 'Rs 10,00,000',
                requiredDocuments: 'MOU + NDA',
                paymentNo: `NEFT ${900000 + next}`,
                securityDeposit: 'Rs 15000 (Refundable)',
                country: 'India',
                softwareRequirement: 'CRM',
                closedCenter: 'No',
                projectStatus: 'ACTIVE',
                tatGoLive: '14 days',
                pdf: `NEW_${1000 + next}.pdf`,
            },
        ]);
    };

    const handleDelete = (id) => {
        setRows((prev) => prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, id: i + 1 })));
    };

    const handleExport = () => {
        const headers = ['#', 'Project Code', 'Project Type', 'Project Details', 'Monthly Payout (per seat)', 'Total Revenue', 'Required Documents', 'Cheque / NEFT / DD No', 'Security Deposit (per seat)', 'Country', 'Software Requirement', 'Closed Center', 'Project Status', 'TAT of Go Live', 'PDF'];
        const lines = filteredRows.map((r) =>
            [
                r.id, r.projectCode, r.projectType, r.projectDetails, r.monthlyPayout, r.totalRevenue,
                r.requiredDocuments, r.paymentNo, r.securityDeposit, r.country, r.softwareRequirement,
                r.closedCenter, r.projectStatus, r.tatGoLive, r.pdf,
            ]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(',')
        );
        const csv = [headers.join(','), ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all-projects.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="bg-dark-800/80 border border-dark-600 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <h1 className="text-4xl font-extrabold tracking-tight">All Projects</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search projects..."
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-64"
                    />
                    <button onClick={() => setSearchApplied(searchInput)} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold">Apply</button>
                    <button onClick={() => { setSearchInput(''); setSearchApplied(''); }} className="px-5 py-2.5 rounded-xl bg-dark-700 text-text-primary font-bold">Clear</button>
                    <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold flex items-center gap-2"><Plus className="w-4 h-4" />Add</button>
                    <button onClick={handleExport} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[2200px] w-full text-sm">
                        <thead className="bg-dark-800 border-b border-dark-600/60">
                            <tr className="text-primary uppercase text-xs tracking-wider">
                                {['#', 'Project Code', 'Project Type', 'Project Details', 'Monthly Payout (per seat)', 'Total Revenue', 'Required Documents', 'Cheque / NEFT / DD No', 'Security Deposit (per seat)', 'Country', 'Software Requirement', 'Closed Center', 'Project Status', 'TAT of Go Live', 'PDF', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3.5 font-bold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="border-b border-dark-600/30 hover:bg-dark-800/50">
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.id}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold">{row.projectCode}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[230px] truncate">{row.projectType}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[260px] truncate">{row.projectDetails}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.monthlyPayout}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.totalRevenue}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[260px] truncate">{row.requiredDocuments}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[220px] truncate">{row.paymentNo}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[220px] truncate">{row.securityDeposit}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.country}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[220px] truncate">{row.softwareRequirement}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.closedCenter}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span className={twMerge(
                                            'px-3 py-1 rounded-full text-xs font-bold border',
                                            row.projectStatus === 'ACTIVE' ? 'bg-green-500/15 text-green-500 border-green-500/30'
                                                : row.projectStatus === 'PENDING' ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30'
                                                    : 'bg-red-500/15 text-red-500 border-red-500/30'
                                        )}>
                                            {row.projectStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.tatGoLive}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary"><Eye className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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

export default AllProjects;
