import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Customer {
  _id: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  outstandingBalance: number;
}

export default function CustomersScreen() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers');
      if (response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [Colors.primary, Colors.secondary, Colors.success, Colors.warning, Colors.info];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => router.push(`/customers/detail/${item._id}`)}
    >
      <View style={styles.customerHeader}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.customerName) }]}>
          <Text style={styles.avatarText}>{getInitials(item.customerName)}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={14} color={Colors.textMuted} />
            <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
          </View>
        </View>
      </View>
      {item.outstandingBalance > 0 && (
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Outstanding:</Text>
          <Text style={styles.balanceAmount}>₹{item.outstandingBalance.toLocaleString('en-IN')}</Text>
        </View>
      )}
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
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.push('/export')}
        >
          <MaterialCommunityIcons name="download" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No Customers Added</Text>
            <Text style={styles.emptySubtext}>Customers will be auto-added from invoices</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/customers/add')}
      >
        <Ionicons name="person-add" size={28} color="#fff" />
      </TouchableOpacity>
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  customerCard: {
    backgroundColor: Colors.bgMedium,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  customerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  phoneNumber: { fontSize: 14, color: Colors.textMuted },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  balanceLabel: { fontSize: 14, color: Colors.textMuted },
  balanceAmount: { fontSize: 16, fontWeight: 'bold', color: Colors.error },
  emptyContainer: { alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: Colors.textMuted, marginTop: 8 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});