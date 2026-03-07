export default function InvoiceSummary({
  total,
  gstEnabled,
  setGstEnabled,
  gstAmount,
  subTotal,
  balanceDue,
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span>Total</span>
        <span>₹ {total.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={gstEnabled}
          onChange={() => setGstEnabled(!gstEnabled)}
        />
        <span>Add GST (18%)</span>
      </div>

      {gstEnabled && (
        <>
          <div className="flex justify-between mb-2">
            <span>GST</span>
            <span>₹ {gstAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Sub Total</span>
            <span>₹ {subTotal.toFixed(2)}</span>
          </div>
        </>
      )}

      <div className="flex justify-between font-bold text-indigo-900 text-lg border-t pt-2">
        <span>Balance Due</span>
        <span>₹ {balanceDue.toFixed(2)}</span>
      </div>
    </div>
  );
}