// export const calculateInvoice = (invoice) => {
//   const itemsTotal = invoice.items.reduce(
//     (sum, item) => sum + item.quantity * item.price,
//     0
//   );

//   const gstAmount = invoice.gstEnabled ? itemsTotal * 0.18 : 0;
//   const subTotal = itemsTotal + gstAmount;

//   return {
//     itemsTotal,
//     gstAmount,
//     subTotal,
//     balanceDue: subTotal
//   };
// };
// utills/calculateInvoice.js

export const calculateTotals = (form) => {

  /* -------------------- ITEM TOTAL -------------------- */
  const calculateItemTotal = (item) => {
    const qty = Number(item.quantity || item.qty || 0);
    const price = Number(item.price || item.rate || 0);
    return qty * price;
  };

  /* -------------------- SUBTOTAL -------------------- */
  const subtotal = form.items?.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0) || 0;

  /* -------------------- GST -------------------- */
  const gst = form.gstEnabled ? subtotal * 0.18 : 0;

  /* -------------------- TOTAL -------------------- */
  const total = subtotal + gst;

  /* -------------------- BALANCE -------------------- */
  const totalPaid = Number(form.totalPaid || 0);
  const balanceDue = total - totalPaid;

  /* -------------------- STATUS -------------------- */
  let paymentStatus = "unpaid";

  if (balanceDue <= 0 && total > 0) {
    paymentStatus = "paid";
  } else if (totalPaid > 0 && balanceDue > 0) {
    paymentStatus = "partial";
  }

  return {
    subtotal,
    gst,
    total,
    balanceDue,
    paymentStatus,
    calculateItemTotal,
  };
};