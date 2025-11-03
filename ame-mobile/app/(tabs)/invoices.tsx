import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: { customerName: string };
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
}

export default function InvoicesScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/api/invoices');
      if (response.data.success) {
        setInvoices(response.data.invoices);
      }
    } catch (error: any) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return Colors.success;
      case 'sent': return Colors.info;
      case 'overdue': return Colors.error;
      default: return Colors.warning;
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <TouchableOpacity 
      style={styles.invoiceCard}
      onPress={() => router.push(`/invoices/detail/${item._id}`)}
    >
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceLeft}>
          <MaterialCommunityIcons name="file-document" size={24} color={Colors.primary} />
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
            <Text style={styles.customerName}>{item.customerId?.customerName || 'N/A'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.invoiceFooter}>
        <Text style={styles.amount}>₹{item.totalAmount.toLocaleString('en-IN')}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/export')}
          >
            <MaterialCommunityIcons name="download" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderInvoice}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={80} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No Invoices Found</Text>
            <Text style={styles.emptySubtext}>Scan or create your first invoice</Text>
          </View>
        }
      />

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => router.push('/invoices/create')}
        >
          <MaterialCommunityIcons name="file-plus" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.fab, styles.fabPrimary]}
          onPress={() => router.push('/scan/camera')}
        >
          <Ionicons name="camera" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDark },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgDark },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgMedium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  invoiceCard: {
    backgroundColor: Colors.bgMedium,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invoiceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  invoiceNumber: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  customerName: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  amount: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  date: { fontSize: 13, color: Colors.textMuted },
  emptyContainer: { alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: Colors.textMuted, marginTop: 8 },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    gap: 12,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabPrimary: {
    backgroundColor: Colors.primary,
  },
  fabSecondary: {
    backgroundColor: Colors.secondary,
  },
});