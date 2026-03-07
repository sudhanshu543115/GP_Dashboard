export default function InvoiceItemsTable({ items, setItems, readOnly }) {

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "quantity" || field === "price") {
      updated[index].total =
        updated[index].quantity * updated[index].price;
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, price: 0, total: 0 }
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Description</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
            {!readOnly && <th className="border p-2">Action</th>}
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  disabled={readOnly}
                  value={item.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  disabled={readOnly}
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", Number(e.target.value))
                  }
                  className="w-full border p-1"
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  disabled={readOnly}
                  value={item.price}
                  onChange={(e) =>
                    handleChange(index, "price", Number(e.target.value))
                  }
                  className="w-full border p-1"
                />
              </td>

              <td className="border p-2">
                ₹ {item.total.toFixed(2)}
              </td>

              {!readOnly && (
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!readOnly && (
        <button
          onClick={addItem}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}