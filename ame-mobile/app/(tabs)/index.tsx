import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import api from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalRevenue: number;
  outstandingDues: number;
  totalCustomers: number;
  totalInvoices: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      if (response.data.success) {
        setStats({
          ...response.data.stats,
          totalInvoices: response.data.stats.totalInvoices || 0
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      setStats({ totalRevenue: 0, outstandingDues: 0, totalCustomers: 0, totalInvoices: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Action - Scan Invoice */}
      <View style={styles.mainActionContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/scan/camera')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.scanGradient}
          >
            <Ionicons name="camera" size={40} color="#fff" />
            <Text style={styles.scanButtonText}>Scan Invoice</Text>
            <Text style={styles.scanButtonSubtext}>Digitize handwritten invoices</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors.success + '15' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.success }]}>
              <MaterialCommunityIcons name="cash" size={24} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              ₹{stats?.totalRevenue.toLocaleString() || 0}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.error + '15' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.error }]}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Outstanding</Text>
            <Text style={[styles.statValue, { color: Colors.error }]}>
              ₹{stats?.outstandingDues.toLocaleString() || 0}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.info + '15' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.info }]}>
              <Ionicons name="people" size={24} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Customers</Text>
            <Text style={[styles.statValue, { color: Colors.info }]}>
              {stats?.totalCustomers || 0}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.warning + '15' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.warning }]}>
              <MaterialCommunityIcons name="file-document" size={24} color="#fff" />
            </View>
            <Text style={styles.statLabel}>Invoices</Text>
            <Text style={[styles.statValue, { color: Colors.warning }]}>
              {stats?.totalInvoices || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/invoices/create')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
              <MaterialCommunityIcons name="file-plus" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Manual Entry</Text>
            <Text style={styles.actionSubtitle}>Create invoice manually</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/customers/add')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Ionicons name="person-add" size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.actionTitle}>Add Customer</Text>
            <Text style={styles.actionSubtitle}>New customer entry</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/invoices')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
              <MaterialCommunityIcons name="view-list" size={28} color={Colors.success} />
            </View>
            <Text style={styles.actionTitle}>All Invoices</Text>
            <Text style={styles.actionSubtitle}>View invoice list</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/export')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.warning + '20' }]}>
              <MaterialCommunityIcons name="download" size={28} color={Colors.warning} />
            </View>
            <Text style={styles.actionTitle}>Export CSV</Text>
            <Text style={styles.actionSubtitle}>Download data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainActionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  scanButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  scanButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});