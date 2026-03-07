// pages/invoices/ManageInvoices.jsx

import { FileText, Activity, CheckCircle, IndianRupee, Plus } from "lucide-react";
import { toast } from "react-toastify";

import React, { lazy, Suspense, useMemo, useState } from "react";

const InvoiceForm = lazy(() => import("./Invoice1.jsx/InvoiceForm"));
const InvoiceTable = lazy(() => import("./Invoice1.jsx/InvoiceTable"));

import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from "../../redux/api/invoicesApiSlice";

import { useGetCentersQuery } from "../../redux/api/centerApiSlice";

/* ===============================
   DEFAULT DATA
================================= */

const defaultTerms = `
SECURITY IS 100% REFUNDABLE AFTER THE AGREEMENT PERIOD ENDS OR IF WORK TERMINATED BY ANY ONE.
BITMAX IS AGREED TO PROVIDE ANY ADDITIONAL REQUIREMENT RAISED.
BALANCE AMOUNT WILL BE PAID BEFORE INSTALLATION.
MAINTENANCE AND SUPPORT WILL BE PROVIDED BY BITMAX.
THE SECURITY DEPOSIT WILL BE APPLICABLE EXCLUSIVE TOWARDS TECHNICAL ASSISTANCE AND SOFTWARE SUPPORT.
`;

const emptyForm = () => ({
  invoice_no: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  description: "",
  client: "",
  center: "",
  center_id: "",
  billTo: { name: "", address: "", phone: "", email: "" },
  items: [{ description: "", quantity: 1, price: 0 }],
  terms: defaultTerms.trim(),
  gstEnabled: true,
  totalPaid: 0,
  paymentTerm: "Net 30",
  notes: "",
});

/* ===============================
   MAIN COMPONENT
================================= */

const ManageInvoices = () => {

  const [form, setForm] = useState(emptyForm());
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);

  /* ===============================
     INVOICES API
  ================================= */

  const { data: invoicesResponse, isLoading: invoicesLoading } =
    useGetInvoicesQuery();

  const invoices = invoicesResponse?.data || [];

  /* ===============================
     CENTERS API (FIXED)
  ================================= */


  const { data: centersResponse } = useGetCentersQuery({ limit: 1000 });
const centers = useMemo(() => {
  if (!centersResponse) return [];

  const data = centersResponse;

  if (Array.isArray(data?.data?.centers)) return data.data.centers;
  if (Array.isArray(data?.message?.centers)) return data.message.centers;
  if (Array.isArray(data?.centers)) return data.centers;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.message)) return data.message;
  if (Array.isArray(data)) return data;

  return [];
}, [centersResponse]);
  /* Debug */
  // useEffect(() => {
  //   console.log("Centers API Response:", centersResponse);
  //   console.log("Centers:", centers);
  // }, [centersResponse]);

  /* ===============================
     MUTATIONS
  ================================= */

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();

  /* ===============================
     SUBMIT HANDLER
  ================================= */

  const handleSubmit = async (payload) => {
    try {

      if (editId) {
        await updateInvoice({
          id: editId,
          data: payload,
        }).unwrap();
      } else {
        await createInvoice(payload).unwrap();
      }

      setForm(emptyForm());
      setEditId(null);
      setOpen(false);

      toast.success("Invoice saved successfully");

    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to save invoice"
      );
    }
  };

  /* ===============================
     STATS
  ================================= */

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.payment_status === "paid").length,
    unpaid: invoices.filter(i => i.payment_status !== "paid").length,
    totalValue: invoices.reduce((s, i) => s + (i.total_amount || 0), 0),
  }), [invoices]);

  /* ===============================
     UI
  ================================= */

  return (
    <div className="space-y-6 pt-6 pb-10 text-text-primary">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-dark-600 pb-6">

        <div>
          <h1 className="text-3xl font-extrabold">
            Invoice Management
          </h1>

          <p className="text-sm text-text-muted">
            Centralized control of all invoices & payments
          </p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus size={16} /> New Invoice
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
          { label: "Total Invoices", value: stats.total, icon: FileText },
          { label: "Paid", value: stats.paid, icon: CheckCircle },
          { label: "Unpaid", value: stats.unpaid, icon: Activity },
          {
            label: "Total Value",
            value: `₹${stats.totalValue.toLocaleString()}`,
            icon: IndianRupee,
          },
        ].map((s, i) => (

          <div
            key={i}
            className="bg-dark-800 p-6 rounded-2xl border border-dark-600"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="text-xs uppercase text-text-muted">
                  {s.label}
                </p>

                <h3 className="text-2xl font-black mt-1">
                  {s.value}
                </h3>
              </div>

              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <s.icon size={20} />
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Invoice Form */}
      {open && (
      
        <div className="bg-dark-800 rounded-2xl border border-dark-600 p-6">
         <Suspense fallback={<div>Loading form...</div>}>
          <InvoiceForm
            form={form}
            setForm={setForm}
            centers={centers}
            onSubmit={handleSubmit}
            editId={editId}
            />
            </Suspense>

        </div>

      )}

      {/* Invoice Table */}
      <div className="bg-dark-800 rounded-2xl border border-dark-600">
       <Suspense fallback={<div>Loading form...</div>}>
        <InvoiceTable
          invoices={invoices}
          centers={centers}
          page={page}
          setPage={setPage}
          setEditId={setEditId}
          setForm={setForm}
          setOpen={setOpen}
          isLoading={invoicesLoading}
          />
          </Suspense>

      </div>

    </div>
  );
};

export default ManageInvoices;