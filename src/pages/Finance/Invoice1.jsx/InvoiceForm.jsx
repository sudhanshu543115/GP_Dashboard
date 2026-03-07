import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Plus,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
  Printer,
  GripVertical,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateInvoiceNumberQuery } from "../../../redux/api/invoicesApiSlice";
import { useDebounce } from "use-debounce";
import InvoicePreview from "./InvoicePreview";

/* ===============================
   CONSTANTS & CONFIGURATION
================================= */

const GST_RATE = 0.18;

const defaultTermsList = [
  "SECURITY IS 100% REFUNDABLE AFTER THE AGREEMENT PERIOD ENDS OR IF WORK TERMINATED BY ANY ONE.",
  "BITMAX IS AGREED TO PROVIDE ANY ADDITIONAL REQUIREMENT RAISED.",
  "BALANCE AMOUNT WILL BE PAID BEFORE INSTALLATION.",
  "MAINTENANCE AND SUPPORT WILL BE PROVIDED BY BITMAX.",
  "THE SECURITY DEPOSIT WILL BE APPLICABLE EXCLUSIVE TOWARDS TECHNICAL ASSISTANCE AND SOFTWARE SUPPORT.",
];

const itemTemplates = [
  { description: "Installation Service", price: 5000, quantity: 1 },
  { description: "Annual Maintenance Contract", price: 12000, quantity: 1 },
  { description: "Software License (Perpetual)", price: 25000, quantity: 1 },
  { description: "Hardware Setup", price: 15000, quantity: 1 },
  { description: "Training Session", price: 8000, quantity: 1 },
  { description: "Technical Support - Monthly", price: 3000, quantity: 1 },
];

const paymentTerms = ["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"];

/* ===============================
   UTILITY FUNCTIONS
================================= */

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ===============================
   SHARED INPUT CLASS
================================= */

const inputCls = (isDark, extra = "") =>
  isDark
    ? `w-full bg-slate-900 border border-slate-700 rounded-[10px] px-3 py-[9px] text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 box-border ${extra}`
    : `w-full bg-white border border-gray-300 rounded-[10px] px-3 py-[9px] text-gray-900 text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 box-border placeholder-gray-400 ${extra}`;

/* ===============================
   MAIN COMPONENT
================================= */

const InvoiceLayout = ({
  form: externalForm,
  setForm: externalSetForm,
  centers = [],
  onSubmit,
  editId,
  isLoading = false,
}) => {
  const [isDark, setIsDark] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    details: false,
    billTo: false,
    items: false,
    terms: false,
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const defaultForm = {
    invoice_no: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    description: "",
    center: "",
    center_id: "",
    billTo: { name: "", address: "", phone: "", email: "" },
    items: [{ description: "", quantity: 1, price: 0 }],
    terms: defaultTermsList.join("\n\n"),
    gstEnabled: true,
    totalPaid: 0,
    paymentTerm: "Net 30",
    notes: "",
  };

  const [internalForm, setInternalForm] = useState(defaultForm);

  const form = externalForm || internalForm;
  const setForm = externalSetForm || setInternalForm;

  // Auto-save draft
  useEffect(() => {
    if (!editId && form.invoice_no) {
      const timer = setTimeout(() => {
        localStorage.setItem("invoiceDraft", JSON.stringify(form));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [form, editId]);

  // Load draft on mount
  useEffect(() => {
    if (!editId && !form.invoice_no) {
      const draft = localStorage.getItem("invoiceDraft");
      if (draft) {
        try {
          setForm(JSON.parse(draft));
        } catch (e) {
          console.error("Failed to load draft:", e);
        }
      }
    }
  }, [editId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        addItem();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setShowPreview(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  // Auto generate invoice number
  const { data: generatedResponse, isLoading: isLoadingInvoiceNo } =
    useGenerateInvoiceNumberQuery(undefined, { skip: !!editId });

  useEffect(() => {
    const invoiceNo = generatedResponse?.data?.invoice_no;
    if (invoiceNo && !editId && !form.invoice_no) {
      setForm((prev) => ({ ...prev, invoice_no: invoiceNo }));
    }
  }, [generatedResponse, editId, form.invoice_no]);

  // Debounced items for performance
  const [debouncedItems] = useDebounce(form.items || [], 300);

  // Calculations
  const calculateTotals = useCallback((items, gstEnabled) => {
    const subtotal = items.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.price) || 0),
      0
    );
    const gst = gstEnabled ? subtotal * GST_RATE : 0;
    return { subtotal, gst, total: subtotal + gst };
  }, []);

  const { subtotal, gst, total } = useMemo(
    () => calculateTotals(debouncedItems, form.gstEnabled),
    [debouncedItems, form.gstEnabled, calculateTotals]
  );

  const balanceDue = useMemo(
    () => Math.max(total - (Number(form.totalPaid) || 0), 0),
    [total, form.totalPaid]
  );

  const paymentStatus = useMemo(() => {
    if (balanceDue <= 0) return "paid";
    if (Number(form.totalPaid) > 0) return "partial";
    return "unpaid";
  }, [balanceDue, form.totalPaid]);

  /* ---- Validation ---- */
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !value || !/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : "";
      case "phone":
        return !value || !/^[0-9+\-\s()]{10,15}$/.test(value)
          ? "Invalid phone number"
          : "";
      case "invoice_no":
        return !value ? "Invoice number is required" : "";
      case "center_id":
        return !value ? "Please select a center" : "";
      default:
        return "";
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldValue =
      field === "center_id" ? form.center_id || form.center : form[field];
    setErrors((prev) => ({ ...prev, [field]: validateField(field, fieldValue) }));
  };

  /* ---- Handlers ---- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBillToChange = (field, value) => {
    setForm((prev) => ({ ...prev, billTo: { ...prev.billTo, [field]: value } }));
  };

  const handleCenterSelect = (centerId) => {
    const selected = centers.find((c) => (c._id || c.id) === centerId);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      center: centerId,
      center_id: centerId,
      billTo: {
        name: selected.name || "",
        address:
          typeof selected.address === "object"
            ? [selected.address.street, selected.address.city]
                .filter(Boolean)
                .join(", ")
            : selected.address || "",
        phone: selected.phone || "",
        email: selected.email?.replace(/\s+/g, "") || "",
      },
    }));
  };

  const handleItemChange = (idx, field, value) => {
    const updated = [...form.items];
    updated[idx][field] = field === "description" ? value : Number(value) || 0;
    setForm((prev) => ({ ...prev, items: updated }));
  };

  const addItem = (template = null) => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        template ? { ...template } : { description: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (idx) => {
    if (form.items.length === 1) {
      handleItemChange(idx, "description", "");
      handleItemChange(idx, "quantity", 1);
      handleItemChange(idx, "price", 0);
      return;
    }
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    setSelectedItems((prev) => prev.filter((i) => i !== idx));
  };

  const duplicateItem = (idx) => {
    const items = [...form.items];
    items.splice(idx + 1, 0, { ...form.items[idx] });
    setForm((prev) => ({ ...prev, items }));
  };

  const bulkDelete = () => {
    if (!selectedItems.length) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => !selectedItems.includes(i)),
    }));
    setSelectedItems([]);
    setBulkMode(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(form.items);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setForm((prev) => ({ ...prev, items }));
  };

  const calculateItemTotal = (item) =>
    (Number(item.quantity) || 0) * (Number(item.price) || 0);

  const toggleSection = (section) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const toggleItemSelection = (idx) =>
    setSelectedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  const selectAllItems = () =>
    setSelectedItems(
      selectedItems.length === form.items.length ? [] : form.items.map((_, i) => i)
    );

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const centerId = form.center_id || form.center || "";

    const newErrors = {};
    if (!form.invoice_no) newErrors.invoice_no = "This field is required";
    if (!form.invoiceDate) newErrors.invoiceDate = "This field is required";
    if (!centerId) newErrors.center_id = "Please select a center";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ invoice_no: true, invoiceDate: true, center_id: true });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      invoice_no: form.invoice_no,
      invoice_date: form.invoiceDate,
      center: centerId,
      centers_id: centerId,
      center_name: form.billTo?.name || "",
      bill_to: form.billTo,
      items: form.items.filter((i) => i.description.trim() !== ""),
      description: form.description,
      terms: form.terms,
      notes: form.notes,
      payment_term: form.paymentTerm,
      gst_applied: form.gstEnabled,
      advance_amount: Number(form.totalPaid) || 0,
      subtotal,
      gst_amount: gst,
      total_amount: total,
      balance_due: balanceDue,
      payment_status: paymentStatus,
    };

    try {
      await onSubmit(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (!editId) localStorage.removeItem("invoiceDraft");
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     RENDER
  ================================= */
  return (
    <>
      <div className="w-full space-y-6 sm:space-y-8 pt-4 sm:pt-6 animate-fade-in text-text-primary pb-8 sm:pb-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-dark-600 pb-5 sm:pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-1">
              {editId ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-text-muted text-xs sm:text-sm">
              {editId ? "Update invoice details" : "Fill in the invoice details below"}
              {!editId && form.invoice_no && (
                <span className="text-primary"> • Draft auto-saving</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? "Light" : "Dark"}
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
              title="Preview (Ctrl+P)"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <Download className="w-4 h-4" /> PDF
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* ── Success toast ── */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Invoice {editId ? "updated" : "saved"} successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Top Grid: Details / Bill To / Payment ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* Invoice Details */}
          <SectionCard
            title="Invoice Details"
            collapsed={collapsedSections.details}
            onToggle={() => toggleSection("details")}
          >
            <div className="relative">
              <input
                value={form.invoice_no || ""}
                readOnly
                placeholder="Invoice #"
                className={inputCls(isDark, errors.invoice_no && touched.invoice_no ? "border-rose-500" : "")}
                onBlur={() => handleBlur("invoice_no")}
              />
              {isLoadingInvoiceNo && (
                <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted animate-spin" />
              )}
            </div>
            <FieldError show={errors.invoice_no && touched.invoice_no} msg={errors.invoice_no} />

            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate || ""}
              onChange={handleChange}
              className={inputCls(isDark)}
              required
            />

            <input
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description / Project Name"
              className={inputCls(isDark)}
            />

            <select
              name="paymentTerm"
              value={form.paymentTerm || "Net 30"}
              onChange={handleChange}
              className={inputCls(isDark)}
            >
              {paymentTerms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </SectionCard>

          {/* Bill To */}
          <SectionCard
            title="Bill To"
            collapsed={collapsedSections.billTo}
            onToggle={() => toggleSection("billTo")}
          >
            <select
              value={form.center_id || ""}
              onChange={(e) => handleCenterSelect(e.target.value)}
              className={inputCls(isDark, errors.center_id && touched.center_id ? "border-rose-500" : "")}
              required
              onBlur={() => handleBlur("center_id")}
            >
              <option value="">-- Select Center --</option>
              {centers.map((c) => {
                const id = c._id || c.id;
                const city = typeof c.address === "object" ? c.address?.city || "" : "";
                return (
                  <option key={id} value={id}>
                    {c.name}{city ? ` — ${city}` : ""}
                  </option>
                );
              })}
            </select>
            <FieldError show={errors.center_id && touched.center_id} msg={errors.center_id} />

            <input
              value={form.billTo?.name || ""}
              onChange={(e) => handleBillToChange("name", e.target.value)}
              placeholder="Client Name *"
              className={inputCls(isDark)}
              required
            />

            <input
              value={form.billTo?.address || ""}
              onChange={(e) => handleBillToChange("address", e.target.value)}
              placeholder="Address *"
              className={inputCls(isDark)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  value={form.billTo?.phone || ""}
                  onChange={(e) => handleBillToChange("phone", e.target.value)}
                  placeholder="Phone *"
                  className={inputCls(isDark, errors.phone && touched.phone ? "border-rose-500" : "")}
                  required
                  onBlur={() => handleBlur("phone")}
                />
                <FieldError show={errors.phone && touched.phone} msg={errors.phone} />
              </div>
              <div>
                <input
                  value={form.billTo?.email || ""}
                  onChange={(e) => handleBillToChange("email", e.target.value)}
                  placeholder="Email *"
                  type="email"
                  className={inputCls(isDark, errors.email && touched.email ? "border-rose-500" : "")}
                  required
                  onBlur={() => handleBlur("email")}
                />
                <FieldError show={errors.email && touched.email} msg={errors.email} />
              </div>
            </div>
          </SectionCard>

          {/* Payment Summary */}
          <SectionCard title="Payment Summary">
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-text-muted">Subtotal</p>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center bg-dark-900/50 rounded-xl px-4 py-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.gstEnabled || false}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, gstEnabled: e.target.checked }))
                  }
                />
                <span>GST (18%)</span>
              </label>
              <span className="font-semibold">{formatCurrency(gst)}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-dark-600">
              <span className="font-bold">Total</span>
              <h3 className="text-3xl font-black text-primary">{formatCurrency(total)}</h3>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Payment Received</p>
              <input
                type="number"
                value={form.totalPaid || 0}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, totalPaid: Number(e.target.value) }))
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputCls(isDark)}
              />
            </div>

            <div className="flex justify-between items-center bg-dark-900/50 rounded-xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-text-muted">Balance Due</p>
              <span className={`font-black text-xl ${balanceDue > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {formatCurrency(balanceDue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-text-muted">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs border ${
                  paymentStatus === "paid"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : paymentStatus === "partial"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* ── Items Section ── */}
        <div className="w-full bg-dark-800 rounded-2xl sm:rounded-3xl border border-dark-600/50 shadow-md shadow-black/10">
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold">Invoice Items</h3>
                <button
                  type="button"
                  onClick={() => toggleSection("items")}
                  className="md:hidden text-text-muted cursor-pointer p-1"
                >
                  {collapsedSections.items ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <span className="text-sm text-text-muted">({form.items?.length || 0})</span>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setBulkMode(!bulkMode)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                    bulkMode
                      ? "bg-primary border-primary/50 text-white shadow-lg shadow-primary/20"
                      : "bg-dark-800 border-dark-600 text-text-primary hover:bg-dark-700"
                  }`}
                >
                  Bulk Select
                </button>

                {bulkMode && selectedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={bulkDelete}
                    className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl px-4 py-2 text-sm font-bold hover:bg-rose-500/20 transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedItems.length})
                  </button>
                )}

                {bulkMode && (
                  <button
                    type="button"
                    onClick={selectAllItems}
                    className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
                  >
                    {selectedItems.length === form.items.length ? "Deselect All" : "Select All"}
                  </button>
                )}

                <select
                  onChange={(e) => {
                    const tmpl = itemTemplates[e.target.value];
                    if (tmpl) addItem(tmpl);
                    e.target.value = "";
                  }}
                  className={inputCls(isDark, "w-auto cursor-pointer")}
                  value=""
                >
                  <option value="" disabled>Quick add template…</option>
                  {itemTemplates.map((tmpl, i) => (
                    <option key={i} value={i}>{tmpl.description}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => addItem()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Item
                  <span className="text-[11px] opacity-50">Ctrl+I</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!collapsedSections.items && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[900px] text-xs sm:text-sm">
                      <thead className="bg-dark-900/70">
                        <tr>
                          {bulkMode && (
                            <th className="px-3 sm:px-4 py-3 text-left text-[11px] uppercase text-text-muted whitespace-nowrap"></th>
                          )}
                          <th className="px-3 sm:px-4 py-3 text-left text-[11px] uppercase text-text-muted whitespace-nowrap"></th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[11px] uppercase text-text-muted whitespace-nowrap">Description</th>
                          <th className="px-3 sm:px-4 py-3 text-right text-[11px] uppercase text-text-muted whitespace-nowrap">Qty</th>
                          <th className="px-3 sm:px-4 py-3 text-right text-[11px] uppercase text-text-muted whitespace-nowrap">Price (₹)</th>
                          <th className="px-3 sm:px-4 py-3 text-right text-[11px] uppercase text-text-muted whitespace-nowrap">Total (₹)</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[11px] uppercase text-text-muted whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {form.items?.map((item, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-dark-700/40 transition ${
                              selectedItems.includes(idx) ? "bg-primary/5" : ""
                            }`}
                          >
                            {bulkMode && (
                              <td className="px-3 sm:px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(idx)}
                                  onChange={() => toggleItemSelection(idx)}
                                />
                              </td>
                            )}
                            <td className="px-3 sm:px-4 py-3">
                              <GripVertical className="w-4 h-4 text-text-muted cursor-grab opacity-60 hover:opacity-100" />
                            </td>
                            <td className="px-3 sm:px-4 py-3">
                              <input
                                value={item.description}
                                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                                placeholder="Item description"
                                className={inputCls(isDark, "min-w-[180px]")}
                              />
                            </td>
                            <td className="px-3 sm:px-4 py-3">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                                min="0"
                                className={inputCls(isDark, "w-20")}
                              />
                            </td>
                            <td className="px-3 sm:px-4 py-3">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                                min="0"
                                step="0.01"
                                className={inputCls(isDark, "w-20")}
                              />
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-emerald-400 font-semibold text-right whitespace-nowrap">
                              {formatCurrency(calculateItemTotal(item))}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => duplicateItem(idx)}
                                  className="cursor-pointer text-text-muted hover:text-primary transition-colors"
                                  title="Duplicate"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeItem(idx)}
                                  className="cursor-pointer text-rose-400 hover:text-rose-300 transition-colors"
                                  title="Remove"
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

                  {/* Mobile card view */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {form.items?.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`bg-dark-900/50 border rounded-2xl p-4 flex flex-col gap-3 ${
                          selectedItems.includes(idx) ? "border-primary/50" : "border-dark-600/50"
                        }`}
                      >
                        {bulkMode && (
                          <div className="flex items-center gap-2 pb-2 border-b border-dark-600 text-sm text-text-muted">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(idx)}
                              onChange={() => toggleItemSelection(idx)}
                            />
                            <span>Select item</span>
                          </div>
                        )}
                        <input
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Item description"
                          className={inputCls(isDark)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs uppercase tracking-wider text-text-muted mb-1 block">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                              min="0"
                              className={inputCls(isDark)}
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-wider text-text-muted mb-1 block">Price (₹)</label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                              min="0"
                              className={inputCls(isDark)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dark-600">
                          <span className="text-xs text-text-muted">
                            Line Total: <strong className="text-emerald-400">{formatCurrency(calculateItemTotal(item))}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => duplicateItem(idx)} className="cursor-pointer text-text-muted hover:text-primary transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => removeItem(idx)} className="cursor-pointer text-rose-400 hover:text-rose-300 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4 mt-1 border-t border-dark-600 text-xs sm:text-sm">
              <span className="text-text-muted">
                {form.items?.reduce((s, i) => s + (i.description ? 1 : 0), 0)} items with description
              </span>
              <span className="text-text-muted">
                Subtotal: <strong className="text-text-primary">{formatCurrency(subtotal)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ── Terms & Notes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SectionCard
            title="Terms & Conditions"
            collapsed={collapsedSections.terms}
            onToggle={() => toggleSection("terms")}
          >
            <textarea
              value={form.terms || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, terms: e.target.value }))}
              placeholder="Enter terms and conditions"
              rows={6}
              className={`${inputCls(isDark)} resize-y min-h-[120px] font-sans`}
            />
            <div className="flex flex-wrap gap-2">
              {defaultTermsList.slice(0, 3).map((term, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      terms: prev.terms + (prev.terms ? "\n\n" : "") + term,
                    }))
                  }
                  className="bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary transition-all active:scale-95"
                >
                  + Term {i + 1}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Additional Notes">
            <textarea
              value={form.notes || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes or instructions…"
              rows={6}
              className={`${inputCls(isDark)} resize-y min-h-[120px] font-sans`}
            />
          </SectionCard>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between text-text-muted text-xs sm:text-sm border-t border-dark-600 pt-4">
          <div className="flex items-center gap-2">
            {!editId && (
              <>
                <span className="text-text-muted">Draft saved locally •</span>
                <button
                  type="button"
                  className="text-primary text-sm underline bg-transparent border-none cursor-pointer p-0"
                  onClick={() => {
                    localStorage.removeItem("invoiceDraft");
                    setForm((prev) => ({
                      ...prev,
                      items: [{ description: "", quantity: 1, price: 0 }],
                      totalPaid: 0,
                    }));
                  }}
                >
                  Clear draft
                </button>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? "Update Invoice" : "Save Invoice"}
            </button>
          </div>
        </div>

        {/* Shortcuts hint */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-text-muted pt-3 border-t border-dark-600">
          <span>⌘/Ctrl + Enter: Save</span>
          <span>⌘/Ctrl + I: Add Item</span>
          <span>⌘/Ctrl + P: Preview</span>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <InvoicePreview
            form={form}
            onClose={() => setShowPreview(false)}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            subtotal={subtotal}
            gst={gst}
            total={total}
            paymentStatus={paymentStatus}
            balanceDue={balanceDue}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Helper sub-components ── */

const SectionCard = ({ title, children, collapsed, onToggle }) => (
  <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-md shadow-black/10">
    <div className="flex justify-between items-center mb-4">
      <p className="text-xs uppercase tracking-wider text-text-muted">{title}</p>
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="md:hidden text-text-muted cursor-pointer p-1"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      )}
    </div>
    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{ overflow: "hidden" }}
          className="flex flex-col gap-3"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FieldError = ({ show, msg }) =>
  show ? (
    <p className="flex items-center gap-1 text-xs text-rose-400 mt-0.5">
      <AlertCircle className="w-3 h-3" /> {msg}
    </p>
  ) : null;

export default InvoiceLayout;