import type { Cart } from '@/lib/shopify/types';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    padding: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  invoiceTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 14,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

interface InvoicePDFProps {
  cart: Cart;
  invoiceData: InvoiceData;
}

type InvoiceData = {
  invoiceNumber: string;
  date: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    company?: string;
    vatNumber?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    email: string;
    phone?: string;
  };
};

export default function InvoicePDF({ cart, invoiceData }: InvoicePDFProps) {
  const invoiceNumber = `AT${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`;
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
          <Text style={styles.date}>Date: {currentDate}</Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{invoiceData.customerInfo.firstName} {invoiceData.customerInfo.lastName}</Text>
          {invoiceData.customerInfo.company && <Text>{invoiceData.customerInfo.company}</Text>}
          <Text>{invoiceData.customerInfo.address}</Text>
          <Text>{invoiceData.customerInfo.city}, {invoiceData.customerInfo.postalCode}</Text>
          <Text>{invoiceData.customerInfo.country}</Text>
          <Text>Email: {invoiceData.customerInfo.email}</Text>
          {invoiceData.customerInfo.vatNumber && <Text>VAT: {invoiceData.customerInfo.vatNumber}</Text>}
        </View>

        <View style={styles.section}>
          <Text>Items:</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Product</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
            {cart.lines.map((line) => (
              <View key={line.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{line.merchandise.product.title}</Text>
                <Text style={styles.tableCell}>{line.quantity}</Text>
                <Text style={styles.tableCell}>
                  ${(parseFloat(line.cost.totalAmount.amount) / line.quantity).toFixed(2)}
                </Text>
                <Text style={styles.tableCell}>
                  ${line.cost.totalAmount.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.total}>
          <Text>Total: ${cart.cost.totalAmount.amount}</Text>
        </View>
      </Page>
    </Document>
  );
} 