export default function InvoiceHeader({
  invoice,
  setInvoice,
  readOnly
}) {

  const handleChange = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex justify-between border-b pb-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-indigo-900">
          BITMAX TECHNOLOGY PVT LTD
        </h1>
        <p className="text-sm text-gray-500">
          BHUTANI ALPHATHUM, Sector 90, Noida
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Invoice No"
          value={invoice.invoiceNo}
          disabled={readOnly}
          onChange={(e) => handleChange("invoiceNo", e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        />

        <input
          type="date"
          value={invoice.invoiceDate}
          disabled={readOnly}
          onChange={(e) => handleChange("invoiceDate", e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        />
      </div>
    </div>
  );
}