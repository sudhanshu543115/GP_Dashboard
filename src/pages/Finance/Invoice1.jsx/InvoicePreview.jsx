// components/invoices/InvoicePreview.jsx

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

// Import your actual assets (you'll need to provide paths)
// For preview, we'll use placeholders or you can import the actual images
import logo from "../../../assets/logo.png";
import stamp from "../../../assets/stamp.png";

const toDisplayString = (value, fallback = '') => {
  if (value == null) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const orderedKeys = ['street', 'city', 'state', 'zipCode', 'country'];
    const orderedParts = orderedKeys
      .map((key) => value?.[key])
      .filter((part) => part != null && String(part).trim() !== '')
      .map((part) => String(part).trim());
    if (orderedParts.length > 0) return orderedParts.join(', ');

    const genericParts = Object.values(value)
      .filter((part) => part != null && String(part).trim() !== '')
      .map((part) => String(part).trim());
    if (genericParts.length > 0) return genericParts.join(', ');
  }
  return fallback;
};

const InvoicePreview = ({ 
  form: propForm, 
  onClose, 
  formatCurrency, 
  formatDate,
  subtotal: propSubtotal,
  gst: propGst,
  total: propTotal,
  paymentStatus,
  balanceDue: propBalanceDue 
}) => {
  const printRef = useRef();
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPageNumbers, setShowPageNumbers] = useState(true);

  // Local state to ensure data is always populated
  const [form, setForm] = useState({
    invoice_no: '',
    invoiceDate: '',
    billTo: { name: '', address: '', phone: '', email: '' },
    items: [{ description: '', quantity: 1, price: 0 }],
    terms: '',
    totalPaid: 0,
    gstEnabled: true
  });

  // Sync form from props when it changes
  useEffect(() => {
    if (propForm) {
      setForm(prev => ({
        ...prev,
        // Handle both camelCase and snake_case field names
        invoice_no: propForm.invoiceNo || propForm.invoice_no || prev.invoice_no,
        invoiceDate: propForm.invoiceDate || propForm.invoice_date || prev.invoiceDate,
        billTo: {
          name: propForm.billTo?.name || propForm.bill_to?.name || prev.billTo.name,
          address: toDisplayString(
            propForm.billTo?.address ?? propForm.bill_to?.address,
            prev.billTo.address
          ),
          phone: propForm.billTo?.phone || propForm.bill_to?.phone || prev.billTo.phone,
          email: propForm.billTo?.email || propForm.bill_to?.email || prev.billTo.email,
        },
        items: propForm.items?.length > 0 ? propForm.items : prev.items,
        terms: propForm.terms || prev.terms,
        totalPaid: propForm.totalPaid ?? (propForm.total_paid ?? prev.totalPaid),
        gstEnabled: propForm.gstEnabled ?? (propForm.gst_applied ?? prev.gstEnabled),
      }));
    }
  }, [propForm]);

  // Calculate local values if not provided as props
  // make sure precedence is correct when mixing ?? with ||
  const calculatedSubtotal = (propSubtotal ?? (form.items?.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.price) || 0),
    0
  ) || 0)) || 0;

  const calculatedGst = propGst ?? (form.gstEnabled ? calculatedSubtotal * 0.18 : 0);
  const calculatedTotal = propTotal ?? (calculatedSubtotal + calculatedGst);
  const calculatedBalanceDue = propBalanceDue ?? Math.max(calculatedTotal - (Number(form.totalPaid) || 0), 0);

  // Use provided values or calculated ones
  const subtotal = propSubtotal ?? calculatedSubtotal;
  const gst = propGst ?? calculatedGst;
  const total = propTotal ?? calculatedTotal;
  const balanceDue = propBalanceDue ?? calculatedBalanceDue;

  // Calculate if content needs multiple pages
  const itemsPerPage = 15;
  const totalPages = Math.ceil((form.items?.filter(i => i.description && i.description.trim()).length || 0) / itemsPerPage) || 1;

  // Handle copy invoice number
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(form.invoice_no);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle print with proper formatting
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${form.invoice_no}</title>
            <style>
              body { font-family: 'Helvetica', Arial, sans-serif; padding: 35px; max-width: 800px; margin: 0 auto; background: white; color: #000; }
              .header { display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .left-header { display: flex; }
              .logo { width: 70px; height: 40px; margin-right: 10px; }
              .company-name { font-size: 13px; font-weight: bold; }
              .small-text { font-size: 8px; color: #555; }
              .right-header { text-align: right; font-size: 9px; }
              .bill-box { border: 1px solid #bbb; padding: 18px; margin-bottom: 30px; }
              .bill-title { font-size: 12px; font-weight: bold; margin-bottom: 14px; }
              .bill-label { font-size: 10px; color: #777; margin-bottom: 3px; }
              .bill-value { font-size: 10px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; border: 1px solid #ddd; }
              th { background: #f2f2f2; font-weight: bold; border-bottom: 1px solid #ddd; }
              td, th { padding: 6px; text-align: left; border-right: 1px solid #ddd; }
              td:last-child, th:last-child { border-right: none; }
              .text-right { text-align: right; }
              .totals-wrapper { margin-top: 20px; align-self: flex-end; width: 60%; float: right; }
              .total-box { border: 1px solid #ddd; padding: 10px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
              .balance-due { display: flex; justify-content: space-between; margin-top: 6px; font-weight: bold; }
              .line { border-bottom: 1px solid #000; margin: 5px 0; }
              .terms-section { display: flex; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
              .terms-left { width: 70%; }
              .stamp-right { width: 30%; text-align: center; }
              .stamp { width: 110px; }
              .watermark { position: fixed; top: 300px; left: 150px; font-size: 60px; color: #e6e6e6; transform: rotate(-30deg); z-index: -1; }
              .clearfix::after { content: ""; clear: both; display: table; }
            </style>
          </head>
          <body>
            ${document.getElementById('printable-invoice')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Handle PDF download
  const handleDownload = () => {
    handlePrint();
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Get status
  const status = balanceDue <= 0 ? "Paid" : balanceDue < total ? "Partial" : "Pending";

  // Filter valid items
  const validItems = form.items?.filter(i => i.description && i.description.trim() !== '') || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className={`bg-gray-100 rounded-xl overflow-hidden flex flex-col ${
          fullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="bg-gray-800 text-white p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            <span className="font-semibold">Invoice #{form.invoice_no}</span>
            <button
              onClick={handleCopyNumber}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Copy invoice number"
            >
              {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Zoom controls */}
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              disabled={zoom <= 50}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              disabled={zoom >= 200}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors text-xs"
              title="Reset zoom"
            >
              100%
            </button>

            <div className="w-px h-6 bg-gray-600 mx-1" />

            {/* Page navigation */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <div className="w-px h-6 bg-gray-600 mx-1" />

            {/* Action buttons */}
            <button
              onClick={handleDownload}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              title="Download PDF"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors ml-1"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div 
          className="flex-1 overflow-auto bg-gray-900 p-4"
          style={{ 
            background: '#1a1a1a',
            backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        >
          <div 
            className="flex justify-center transition-all duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* PDF Style Document - Exact Match with InvoicePDF */}
            <div 
              ref={printRef}
              id="printable-invoice"
              className="bg-white shadow-2xl relative"
              style={{
                width: '800px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                padding: '35px',
                boxShadow: '0 30px 40px -20px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              {/* WATERMARK */}
              {status === "Paid" && (
                <div style={{
                  position: 'absolute',
                  top: '300px',
                  left: '150px',
                  fontSize: '60px',
                  color: '#e6e6e6',
                  transform: 'rotate(-30deg)',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}>
                  PAID
                </div>
              )}

              {/* HEADER */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #000',
                paddingBottom: '10px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ display: 'flex' }}>
                  {/* Logo */}
                  <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ width: '70px', height: '40px', marginRight: '10px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>BITMAX TECHNOLOGY PVT LTD</div>
                    <div style={{ fontSize: '8px', color: '#555' }}>BHUTANI ALPHATHUM</div>
                    <div style={{ fontSize: '8px', color: '#555' }}>GSTIN: 09ABCDE1234F1Z5</div>
                    <div style={{ fontSize: '8px', color: '#555' }}>8595986967 | accounts@bitmaxgroup.com</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '9px' }}>
                  <div>
                    Invoice No: <span style={{ fontWeight: 'bold' }}>{form.invoice_no}</span>
                  </div>
                  <div>Date: {formatDate(form.invoiceDate)}</div>
                  <div>GST No: 09AANCB4231E1ZT</div>
                  <div style={{ fontWeight: 'bold' }}>Status: {status}</div>
                </div>
              </div>

              {/* BILL TO */}
              <div style={{
                border: '1px solid #bbb',
                padding: '18px',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '14px' }}>BILL TO</div>

                <div style={{ fontSize: '10px', color: '#777', marginBottom: '3px' }}>Address</div>
                {form.billTo?.address && (
                  <div style={{ fontSize: '10px', marginBottom: '10px' }}>{toDisplayString(form.billTo.address)}</div>
                )}

                <div style={{ fontSize: '10px', color: '#777', marginBottom: '3px' }}>Phone Number</div>
                {form.billTo?.phone && (
                  <div style={{ fontSize: '10px', marginBottom: '10px' }}>{form.billTo.phone}</div>
                )}

                <div style={{ fontSize: '10px', color: '#777', marginBottom: '3px' }}>Email</div>
                {form.billTo?.email && (
                  <div style={{ fontSize: '10px', marginBottom: '10px' }}>{form.billTo.email}</div>
                )}
              </div>

              {/* TABLE */}
              <div style={{
                width: '100%',
                border: '1px solid #ddd',
                position: 'relative',
                zIndex: 1,
                marginBottom: '20px'
              }}>
                {/* Header Row */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#f2f2f2',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #ddd'
                }}>
                  <div style={{ width: '8%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'center' }}>#</div>
                  <div style={{ width: '42%', padding: '6px', borderRight: '1px solid #ddd' }}>Description</div>
                  <div style={{ width: '10%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'right' }}>Qty</div>
                  <div style={{ width: '15%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'right' }}>Price</div>
                  <div style={{ width: '15%', padding: '6px', textAlign: 'right' }}>Amount</div>
                </div>

                {/* Items */}
                {validItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, idx) => {
                  const actualIdx = (currentPage - 1) * itemsPerPage + idx;
                  const qty = Number(item.quantity || 0);
                  const price = Number(item.price || 0);
                  const rowTotal = qty * price;

                  return (
                    <div key={actualIdx} style={{
                      display: 'flex',
                      borderTop: '1px solid #eee'
                    }}>
                      <div style={{ width: '8%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'center' }}>{actualIdx + 1}</div>
                      <div style={{ width: '42%', padding: '6px', borderRight: '1px solid #ddd' }}>{item.description}</div>
                      <div style={{ width: '10%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'right' }}>{qty}</div>
                      <div style={{ width: '15%', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'right' }}>₹ {price.toFixed(2)}</div>
                      <div style={{ width: '15%', padding: '6px', textAlign: 'right' }}>₹ {rowTotal.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>

              {/* TOTAL SECTION */}
              <div style={{
                marginTop: '20px',
                alignSelf: 'flex-end',
                width: '60%',
                float: 'right',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {/* Subtotal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 'bold', fontSize: '10px' }}>₹ {subtotal.toFixed(2)}</span>
                  </div>

                  {/* GST */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>GST (18%)</span>
                    <span style={{ fontWeight: 'bold', fontSize: '10px' }}>₹ {gst.toFixed(2)}</span>
                  </div>

                  {/* Total Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 'bold' }}>
                    <span>Total Amount</span>
                    <span style={{ fontWeight: 'bold', fontSize: '10px' }}>₹ {total.toFixed(2)}</span>
                  </div>

                  {/* Payment Received */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Payment Received</span>
                    <span style={{ fontWeight: 'bold', fontSize: '10px' }}>₹ {(form.totalPaid || 0).toFixed(2)}</span>
                  </div>

                  {/* Line separator */}
                  <div style={{ borderBottom: '1px solid #000', margin: '5px 0' }} />

                  {/* Balance Due */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontWeight: 'bold' }}>
                    <span>BALANCE DUE</span>
                    <span style={{ fontWeight: 'bold', fontSize: '10px' }}>₹ {balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Clear float */}
              <div style={{ clear: 'both' }} />

              {/* TERMS + STAMP */}
              <div style={{
                display: 'flex',
                marginTop: '20px',
                borderTop: '1px solid #000',
                paddingTop: '10px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ width: '70%' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>TERMS & CONDITIONS</div>
                  {form.terms && form.terms.split('\n').map((t, i) => (
                    <div key={i} style={{ fontSize: '10px', marginBottom: '2px' }}>{t}</div>
                  ))}
                </div>

                <div style={{ width: '30%', textAlign: 'center' }}>
                  <img 
                    src={stamp} 
                    alt="Stamp" 
                    style={{ width: '110px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: '20px',
                fontSize: '8px',
                textAlign: 'center',
                color: '#777',
                position: 'relative',
                zIndex: 1
              }}>
                This is a computer generated invoice - valid without signature
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 text-white p-2 text-xs flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-0.5 rounded ${
              status === 'Paid' ? 'bg-green-600' :
              status === 'Partial' ? 'bg-yellow-600' :
              'bg-red-600'
            }`}>
              {status}
            </span>
            <span>{validItems.length} items</span>
            <span>Total: ₹{total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Zoom: {zoom}%</span>
            <span className="text-gray-400">Page {currentPage}/{totalPages}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoicePreview;
