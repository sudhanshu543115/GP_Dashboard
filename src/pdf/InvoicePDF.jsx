import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

import logo from "../assets/logo.png";
import stamp from "../assets/stamp.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },

  /* Clean Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 20,
  },

  companySection: {
    flexDirection: 'row',
    gap: 15,
  },

  logo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },

  companyInfo: {
    flexDirection: 'column',
  },

  companyName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
    letterSpacing: -0.5,
  },

  companyDetails: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.4,
  },

  gstInfo: {
    fontSize: 5,
    color: '#1e3a8a',
    marginTop: 5,
    fontWeight: 'bold',
  },

  invoiceMeta: {
    alignItems: 'flex-end',
  },

  invoiceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  metaBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 200,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  metaLabel: {
    fontSize: 8,
    color: '#64748b',
  },

  metaValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  /* Bill To Section */
  billSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },

  billContent: {
    flexDirection: 'row',
    gap: 40,
  },

  billItem: {
    marginBottom: 8,
  },

  billItemLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  billItemValue: {
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'medium',
  },

  /* Table */
  tableContainer: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  tableHeaderText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },

  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },

  colIndex: {
    width: '8%',
    fontSize: 9,
    color: '#64748b',
  },

  colDesc: {
    width: '42%',
    fontSize: 9,
    color: '#0f172a',
  },

  colQty: {
    width: '12%',
    textAlign: 'right',
    fontSize: 9,
    color: '#0f172a',
  },

  colRate: {
    width: '18%',
    textAlign: 'right',
    fontSize: 9,
    color: '#0f172a',
  },

  colAmount: {
    width: '20%',
    textAlign: 'right',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  /* Totals Section */
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  notes: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },

  notesText: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.5,
  },

  totalsBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },

  totalLabel: {
    fontSize: 9,
    color: '#64748b',
  },

  totalValue: {
    fontSize: 9,
    color: '#0f172a',
    fontWeight: 'medium',
  },

  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1e3a8a',
  },

  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  /* Payment Status */
  paymentStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  statusPaid: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderColor: '#bbf7d0',
  },

  /* Footer */
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  stampSection: {
    width: '30%',
    alignItems: 'center',
  },

  stamp: {
    width: 80,
    height: 60,
    objectFit: 'contain',
    marginBottom: 5,
  },

  signature: {
    fontSize: 8,
    color: '#1e3a8a',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a8a',
    marginTop: 5,
    marginBottom: 3,
  },

  authorizedBy: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },

  footerNote: {
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});

export default function InvoicePDF({ invoice }) {

  const toDisplayString = (value, fallback = "") => {
    if (value == null) return fallback;
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || fallback;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (typeof value === "object") {
      const orderedKeys = ["street", "city", "state", "zipCode", "country"];
      const parts = orderedKeys
        .map((key) => value?.[key])
        .filter((part) => part != null && String(part).trim() !== "")
        .map((part) => String(part).trim());

      if (parts.length > 0) return parts.join(", ");

      const genericParts = Object.values(value)
        .filter((part) => part != null && String(part).trim() !== "")
        .map((part) => String(part).trim());
      if (genericParts.length > 0) return genericParts.join(", ");
    }
    return fallback;
  };
  
  const items = invoice.items || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const gstAmount = invoice.gstEnabled ? itemsTotal * 0.18 : 0;
  const grandTotal = itemsTotal + gstAmount;
  const totalPaid = Number(invoice.totalPaid || 0);
  const balanceDue = grandTotal - totalPaid > 0 ? grandTotal - totalPaid : 0;
  const status = balanceDue === 0 ? "Paid" : "Pending";

  const formatDate = (dateString) => {
    if (!dateString) return '15 Mar 2024';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹ ${Number(amount).toFixed(2)}`;
  };

  const defaultTerms = [
    "SECURITY IS 100% REFUNDABLE AFTER THE AGREEMENT PERIOD ENDS OR IF WORK TERMINATED BY ANY ONE.",
    "BITMAX IS AGREED TO PROVIDE ANY ADDITIONAL REQUIREMENT RAISED.",
    "BALANCE AMOUNT WILL BE PAID BEFORE INSTALLATION.",
    "MAINTENANCE AND SUPPORT WILL BE PROVIDED BY BITMAX.",
    "THE SECURITY DEPOSIT WILL BE APPLICABLE EXCLUSIVE TOWARDS TECHNICAL ASSISTANCE AND SOFTWARE SUPPORT."
  ];

  const terms = invoice.terms ? invoice.terms.split("\n").filter(t => t.trim()) : defaultTerms;
  const billTo = invoice.billTo || invoice.bill_to || {};
  const billAddress = toDisplayString(billTo.address, "Bhubaneswar");
  const billPhone = toDisplayString(billTo.phone, "1234567890");
  const billEmail = toDisplayString(billTo.email, "kalinga123@gmail.com");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>BITMAX TECHNOLOGY PVT LTD</Text>
              <Text style={styles.companyDetails}>BHUTANI ALPHATHUM, Bhubaneswar - 751024</Text>
              <Text style={styles.companyDetails}>Ph: 8595986967 | Email: accounts@bitmaxgroup.com</Text>
              <Text style={styles.gstInfo}>GSTIN: 09AANCB4231E1ZT | CIN: U72900OD2020PTC032456</Text>
            </View>
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No.</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNo || 'INV-2024-001'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{formatDate(invoice.invoiceDate)}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>GST No.</Text>
                <Text style={styles.metaValue}>09AANCB4231E1ZT</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billSection}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <View style={styles.billContent}>
            <View style={{ flex: 1 }}>
              <View style={styles.billItem}>
                <Text style={styles.billItemLabel}>Address</Text>
                <Text style={styles.billItemValue}>{billAddress}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.billItem}>
                <Text style={styles.billItemLabel}>Phone</Text>
                <Text style={styles.billItemValue}>{billPhone}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.billItem}>
                <Text style={styles.billItemLabel}>Email</Text>
                <Text style={styles.billItemValue}>{billEmail}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.paymentStatus}>
          <Text style={[styles.statusBadge, status === "Paid" && styles.statusPaid]}>
            {status === "Paid" ? "✓ PAID" : "⏱ PENDING"}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colIndex]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>QTY</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>RATE (₹)</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>AMOUNT (₹)</Text>
          </View>

          {items.length > 0 ? items.map((item, i) => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const rowTotal = qty * price;

            return (
              <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={styles.colIndex}>{i + 1}</Text>
                <Text style={styles.colDesc}>{item.description || 'csaccas'}</Text>
                <Text style={styles.colQty}>{qty || 1}</Text>
                <Text style={styles.colRate}>₹ {price.toFixed(2)}</Text>
                <Text style={styles.colAmount}>₹ {rowTotal.toFixed(2)}</Text>
              </View>
            );
          }) : (
            <View style={styles.tableRow}>
              <Text style={styles.colIndex}>1</Text>
              <Text style={styles.colDesc}>csaccas</Text>
              <Text style={styles.colQty}>1</Text>
              <Text style={styles.colRate}>₹ 12205.92</Text>
              <Text style={styles.colAmount}>₹ 12205.92</Text>
            </View>
          )}
        </View>

        {/* Totals and Notes */}
        <View style={styles.totalsContainer}>
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Terms & Conditions:</Text>
            {terms.map((term, index) => (
              <Text key={index} style={styles.notesText}>• {term}</Text>
            ))}
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₹ {itemsTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST (18%)</Text>
              <Text style={styles.totalValue}>₹ {gstAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalValue}>₹ {grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer with Stamp */}
        <View style={styles.footer}>
          <View style={styles.stampSection}>
            <Image src={stamp} style={styles.stamp} />
            <Text style={styles.signature}>For Bitmax Technology</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.authorizedBy}>Authorized Signatory</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          This is a computer generated invoice - valid without signature
        </Text>
      </Page>
    </Document>
  );
}
