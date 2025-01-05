import type { Cart } from '@/lib/shopify/types';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

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
});

interface InvoicePDFProps {
  cart: Cart;
}

const InvoicePDF = ({ cart }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoice</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
        <Text>Invoice #: {cart.id}</Text>
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
                ${line.merchandise.price.amount}
              </Text>
              <Text style={styles.tableCell}>
                ${(parseFloat(line.merchandise.price.amount) * line.quantity).toFixed(2)}
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

export default InvoicePDF; 