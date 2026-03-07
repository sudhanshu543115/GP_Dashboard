// components/invoices/InvoiceList.jsx

import React, { useMemo , lazy, Suspense } from "react";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "react-toastify";
// import InvoicePDF from "../../../pdf/InvoicePDF";
import { useDeleteInvoiceMutation } from "../../../redux/api/invoicesApiSlice";


const InvoicePDF = lazy(() => import("../../../pdf/InvoicePDF"));
const PDFDownloadLink = lazy(() =>
  import("@react-pdf/renderer").then((mod) => ({
    default: mod.PDFDownloadLink,
  }))
);

/* ===============================
   UTILITY
================================= */

/**
 * Converts address object or string to a readable display string.
 */
const toDisplayString = (value, fallback = "") => {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "object") {
    const orderedKeys = ["street", "city", "state", "zipCode", "country"];
    const parts = orderedKeys
      .map((k) => value[k])
      .filter((p) => p != null && String(p).trim() !== "")
      .map((p) => String(p).trim());
    if (parts.length > 0) return parts.join(", ");
    const generic = Object.values(value)
      .filter((p) => p != null && String(p).trim() !== "")
      .map((p) => String(p).trim());
    return generic.join(", ") || fallback;
  }
  return fallback;
};

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "paid") return "bg-emerald-600/20 text-emerald-400";
  if (s === "partial") return "bg-yellow-600/20 text-yellow-400";
  return "bg-rose-600/20 text-rose-400";
};

/* ===============================
   CALCULATIONS HELPER
================================= */

const calculateInvoice = (invoice) => {
  const itemsTotal = (invoice.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
  const gst = invoice.gst_applied ? itemsTotal * 0.18 : 0;
  const grandTotal = invoice.total_amount ?? itemsTotal + gst;

  const totalPaid =
    invoice.advance_amount ??
    invoice.total_paid ??
    (invoice.balance_due != null ? grandTotal - invoice.balance_due : 0);

  const balanceDue = invoice.balance_due ?? Math.max(grandTotal - totalPaid, 0);

  let status = "Unpaid";
  if (balanceDue <= 0) status = "Paid";
  else if (totalPaid > 0) status = "Partial";

  return { grandTotal, balanceDue, totalPaid, gst, itemsTotal, status };
};

/* ===============================
   BUILD PDF DATA
================================= */

const buildPdfData = (invoice, centers) => {
  // ✅ FIX: resolve center by matching ID — never assume center is a name
  const centerId =
    invoice.center_id ||
    (typeof invoice.center === "string" ? invoice.center : invoice.center?._id) ||
    "";

  const center =
    typeof invoice.center === "object" && invoice.center?._id
      ? invoice.center
      : centers.find((c) => (c._id || c.id) === centerId) || null;

  const { grandTotal, balanceDue, totalPaid, gst, itemsTotal } =
    calculateInvoice(invoice);

  return {
    invoiceNo: invoice.invoice_no || "",
    invoiceDate: invoice.invoice_date
      ? new Date(invoice.invoice_date).toLocaleDateString("en-IN")
      : "",
    description: invoice.description || "",
    paymentTerm: invoice.payment_term || "Net 30",
    billTo: {
      name: invoice.bill_to?.name || center?.name || "",
      address:
        toDisplayString(invoice.bill_to?.address) ||
        toDisplayString(center?.address) ||
        "",
      phone: invoice.bill_to?.phone || center?.phone || "",
      email: invoice.bill_to?.email || center?.email || "",
    },
    items:
      invoice.items?.length > 0
        ? invoice.items
        : [
            {
              description: invoice.description || "Service",
              quantity: 1,
              price: invoice.total_amount || 0,
            },
          ],
    terms: invoice.terms || "",
    notes: invoice.notes || "",
    gstEnabled: invoice.gst_applied ?? false,
    subtotal: itemsTotal,
    gst,
    total: grandTotal,
    totalPaid,
    balanceDue,
  };
};

/* ===============================
   MAIN COMPONENT
================================= */

const InvoiceList = ({
  invoices = [],
  centers = [],
  page = 1,
  setPage,
  setEditId,
  setForm,
  setOpen,
  isLoading = false,
}) => {
  const entries = 10;
  const totalPages = Math.ceil(invoices.length / entries);
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const paginated = useMemo(
    () => invoices.slice((page - 1) * entries, page * entries),
    [invoices, page]
  );

  /* ---- Edit Handler ---- */
  const handleEdit = (invoice) => {
    if (!invoice) return;

    // ✅ FIX: Always resolve centerId as an ID string, never a name
    const centerId =
      invoice.center?._id ||
      invoice.center_id ||
      invoice.centers_id ||
      (typeof invoice.center === "string" ? invoice.center : "") ||
      "";

    const center = centers.find((c) => (c._id || c.id) === centerId) || null;

    const paidAmount =
      invoice.advance_amount ??
      invoice.total_paid ??
      Math.max((invoice.total_amount || 0) - (invoice.balance_due || 0), 0);

    setEditId(invoice._id);

    setForm({
      invoice_no: invoice.invoice_no || "",
      invoiceDate: invoice.invoice_date
        ? invoice.invoice_date.split("T")[0]
        : new Date().toISOString().split("T")[0],

      description: invoice.description || "",
      paymentTerm: invoice.payment_term || "Net 30",

      // ✅ FIX: Both center and center_id must hold the ID — not name
      center: centerId,
      center_id: centerId,

      billTo: {
        name: invoice.bill_to?.name || center?.name || "",
        address:
          toDisplayString(invoice.bill_to?.address) ||
          toDisplayString(center?.address) ||
          "",
        phone:
          invoice.bill_to?.phone ||
          center?.phone ||
          center?.contact ||
          "",
        email: invoice.bill_to?.email || center?.email || "",
      },

      items:
        invoice.items?.length > 0
          ? invoice.items.map((item) => ({
              description:
                item.description ||
                item.item_description ||
                item.name ||
                item.title ||
                "",
              quantity: Number(item.quantity ?? item.qty ?? 1),
              price: Number(item.price ?? item.rate ?? item.amount ?? 0),
            }))
          : [
              {
                description: invoice.description || "Service",
                quantity: 1,
                price: Number(invoice.subtotal || invoice.total_amount || 0),
              },
            ],

      terms: invoice.terms || "",
      notes: invoice.notes || "",
      gstEnabled: invoice.gst_applied ?? false,
      totalPaid: Number(paidAmount) || 0,
    });

    setOpen(true);
  };

  /* ---- Delete Handler ---- */
  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmed) return;
    try {
      await deleteInvoice(id).unwrap();
      toast.success("Invoice deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete invoice");
    }
  };

  /* ---- Empty / Loading States ---- */
  const EmptyState = () => (
    <tr>
      <td colSpan={8} className="text-center py-16 text-gray-400">
        <FileText size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No invoices found</p>
      </td>
    </tr>
  );

  const LoadingState = () => (
    <tr>
      <td colSpan={8} className="text-center py-16 text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading invoices...
        </div>
      </td>
    </tr>
  );

  /* ===============================
     RENDER
  ================================= */
  return (
    <div className="w-full">

      {/* ── Mobile View ── */}
      <div className="md:hidden space-y-4 p-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading invoices...
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No invoices found</p>
          </div>
        ) : (
          paginated.map((invoice) => {
            const { grandTotal, balanceDue, status } = calculateInvoice(invoice);
            const pdfData = buildPdfData(invoice, centers);

            // ✅ Resolve center for display
            const centerId =
              invoice.center?._id ||
              invoice.center_id ||
              (typeof invoice.center === "string" ? invoice.center : "") ||
              "";
            const center =
              typeof invoice.center === "object" && invoice.center?.name
                ? invoice.center
                : centers.find((c) => (c._id || c.id) === centerId) || null;

            return (
              <div
                key={invoice._id}
                className="bg-dark-700 border border-dark-600 rounded-2xl p-4 space-y-3 hover:border-dark-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-base">
                      {invoice.invoice_no}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {invoice.invoice_date
                        ? new Date(invoice.invoice_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="text-sm space-y-1 text-gray-300">
                  <p>
                    <span className="text-gray-500">Client: </span>
                    <span className="font-medium text-white">
                      {invoice.bill_to?.name || center?.name || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Total: </span>
                    <span className="text-emerald-400 font-semibold">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Balance: </span>
                    <span
                      className={
                        balanceDue > 0
                          ? "text-rose-400 font-semibold"
                          : "text-emerald-400 font-semibold"
                      }
                    >
                      ₹{balanceDue.toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="flex gap-4 pt-2 border-t border-dark-600 items-center">
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  <Suspense fallback={<div className="spinner" />}>
                  <PDFDownloadLink
                    document={<InvoicePDF invoice={pdfData} />}
                    fileName={`${invoice.invoice_no || "invoice"}.pdf`}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors ml-auto"
                  >
                    {({ loading }) =>
                      loading ? (
                        <span className="text-gray-400 text-xs">Generating…</span>
                      ) : (
                        <>
                          <Download size={14} />
                          PDF
                        </>
                      )
                    }
                  </PDFDownloadLink>
                      </Suspense>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Table ── */}
      {/* <div className="hidden md:block overflow-x-auto"> */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-dark-600 overflow-hidden">
        <table className="w-full text-sm ">
          <thead className="bg-dark-700 rounded-2xl text-gray-400">
            <tr>
              {[
                "Invoice No",
                "Date",
                "Client",
                "Total",
                "Balance",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <LoadingState />
            ) : paginated.length === 0 ? (
              <EmptyState />
            ) : (
              paginated.map((invoice) => {
                const { grandTotal, balanceDue, status } =
                  calculateInvoice(invoice);
                const pdfData = buildPdfData(invoice, centers);

                // ✅ FIX: Resolve center for display using ID lookup
                const centerId =
                  invoice.center?._id ||
                  invoice.center_id ||
                  (typeof invoice.center === "string" ? invoice.center : "") ||
                  "";
                const center =
                  typeof invoice.center === "object" && invoice.center?.name
                    ? invoice.center
                    : centers.find((c) => (c._id || c.id) === centerId) || null;

                return (
                  <tr
                    key={invoice._id}
                    className="border-t border-dark-700 rounded-2xl hover:bg-dark-700/50 transition-colors"
                  >
                    {/* Invoice No */}
                   <td className="px-5 py-3 font-medium ">
                      {invoice.invoice_no || "—"}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-gray-400">
                      {invoice.invoice_date
                        ? new Date(invoice.invoice_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    {/* Client */}
                    <td className="px-5 py-3">
                      {invoice.bill_to?.name || center?.name || "Unknown"}
                    </td>


                    {/* Total */}
                    <td className="px-5 py-3 text-emerald-400 font-semibold">
                      ₹{grandTotal.toFixed(2)}
                    </td>

                    {/* Balance */}
                    <td
                      className={`px-5 py-3 font-semibold ${
                        balanceDue > 0 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      ₹{balanceDue.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit invoice"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete invoice"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Suspense fallback={<div className="spinner" />}>
                        <PDFDownloadLink
                          document={<InvoicePDF invoice={pdfData} />}
                          fileName={`${invoice.invoice_no || "invoice"}.pdf`}
                          title="Download PDF"
                          >
                          {({ loading }) =>
                            loading ? (
                              <span className="text-gray-500 text-xs">…</span>
                            ) : (
                              <Download
                              size={16}
                              className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
                              />
                            )
                          }
                        </PDFDownloadLink>
                            </Suspense>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-5 py-4 border-t border-dark-600 text-sm text-gray-400">
          <span>
            Showing {(page - 1) * entries + 1}–
            {Math.min(page * entries, invoices.length)} of {invoices.length}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-dark-600 rounded-lg disabled:opacity-40 hover:bg-dark-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex items-center px-3 text-xs">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-dark-600 rounded-lg disabled:opacity-40 hover:bg-dark-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;