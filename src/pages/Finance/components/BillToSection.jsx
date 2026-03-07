export default function BillToSection({ billTo, setBillTo, readOnly }) {

  const handleChange = (field, value) => {
    setBillTo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="font-semibold text-indigo-900 mb-3">Bill To</h2>

      <textarea
        placeholder="Address"
        value={billTo.address}
        disabled={readOnly}
        onChange={(e) => handleChange("address", e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <input
        type="text"
        placeholder="Phone"
        value={billTo.phone}
        disabled={readOnly}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={billTo.email}
        disabled={readOnly}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-full border rounded p-2"
      />
    </div>
  );
}