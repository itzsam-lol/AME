import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

export default function BusinessProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  const fetchBusinessProfile = async () => {
    try {
      const response = await api.get('/api/business');
      if (response.data.success && response.data.business) {
        setBusinessData(response.data.business);
      }
    } catch (error) {
      console.error('Failed to fetch business profile:', error);
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

  if (!businessData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="store-off" size={80} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No Business Profile Found</Text>
          <Text style={styles.emptySubtext}>Complete the onboarding to create your business profile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <Text style={styles.infoText}>
            Business profile details cannot be edited after onboarding. Contact support if you need to make changes.
          </Text>
        </View>

        {/* Business Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="store" size={32} color={Colors.primary} />
            <Text style={styles.cardTitle}>Business Information</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MaterialCommunityIcons name="tag" size={20} color={Colors.textMuted} />
              <Text style={styles.labelText}>Business Name</Text>
            </View>
            <Text style={styles.valueText}>{businessData.businessName}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MaterialCommunityIcons name="briefcase" size={20} color={Colors.textMuted} />
              <Text style={styles.labelText}>Business Type</Text>
            </View>
            <Text style={styles.valueText}>{businessData.businessType}</Text>
          </View>

          {businessData.gstin && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <MaterialCommunityIcons name="file-document" size={20} color={Colors.textMuted} />
                <Text style={styles.labelText}>GST Number</Text>
              </View>
              <Text style={[styles.valueText, styles.gstText]}>{businessData.gstin}</Text>
            </View>
          )}
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={32} color={Colors.secondary} />
            <Text style={styles.cardTitle}>Business Location</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="business" size={20} color={Colors.textMuted} />
              <Text style={styles.labelText}>City</Text>
            </View>
            <Text style={styles.valueText}>{businessData.city}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="map" size={20} color={Colors.textMuted} />
              <Text style={styles.labelText}>State</Text>
            </View>
            <Text style={styles.valueText}>{businessData.state}</Text>
          </View>

          {businessData.locationVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.verifiedText}>Location Verified</Text>
            </View>
          )}
        </View>

        {/* Support Card */}
        <View style={styles.supportCard}>
          <MaterialCommunityIcons name="help-circle" size={32} color={Colors.warning} />
          <Text style={styles.supportTitle}>Need to Update Business Details?</Text>
          <Text style={styles.supportText}>
            Business information is locked after onboarding for security reasons. If you need to make changes, please contact our support team.
          </Text>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => router.push('/settings/help')}
          >
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Metadata */}
        {businessData.createdAt && (
          <View style={styles.metadataCard}>
            <Text style={styles.metadataText}>
              Profile created on {new Date(businessData.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDark },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  content: { padding: 24 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.bgMedium,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  detailRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  gstText: {
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  verifiedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: Colors.warning + '15',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.warning,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  supportButton: {
    flexDirection: 'row',
    backgroundColor: Colors.warning,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  metadataCard: {
    backgroundColor: Colors.bgMedium,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  metadataText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});