import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handleExportInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/invoices/export', {
        params: { month: selectedMonth, year: selectedYear },
        responseType: 'blob',
      });

      const monthName = months.find(m => m.value === selectedMonth)?.label;
      const filename = `invoices_${monthName}_${selectedYear}.csv`;

      if (Platform.OS === 'web') {
        // Web download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Mobile download
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, response.data, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }

      Alert.alert('Success', `Invoices exported successfully as ${filename}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to export invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/customers/export', {
        responseType: 'blob',
      });

      const filename = `customers_${new Date().toISOString().split('T')[0]}.csv`;

      if (Platform.OS === 'web') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, response.data, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }

      Alert.alert('Success', `Customers exported successfully as ${filename}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to export customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="download" size={64} color={Colors.success} />
        </View>

        <Text style={styles.title}>Export Your Data</Text>
        <Text style={styles.subtitle}>Download invoices and customer data as CSV files</Text>

        {/* Monthly Invoice Export */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Invoice Export</Text>

          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                style={styles.picker}
              >
                {months.map((month) => (
                  <Picker.Item key={month.value} label={month.label} value={month.value} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Year</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                style={styles.picker}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.exportButton, loading && styles.exportButtonDisabled]}
            onPress={handleExportInvoices}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="file-export" size={24} color="#fff" />
                <Text style={styles.exportButtonText}>Export Invoices</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              CSV will include: Invoice number, date, customer, items, amounts, and status
            </Text>
          </View>
        </View>

        {/* Customer Export */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Database Export</Text>

          <TouchableOpacity
            style={[styles.exportButton, styles.exportButtonSecondary, loading && styles.exportButtonDisabled]}
            onPress={handleExportCustomers}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.secondary} />
            ) : (
              <>
                <Ionicons name="people" size={24} color={Colors.secondary} />
                <Text style={[styles.exportButtonText, { color: Colors.secondary }]}>
                  Export All Customers
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              CSV will include: Name, phone, email, address, GST, and outstanding balance
            </Text>
          </View>
        </View>

        {/* Export Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>
            <MaterialCommunityIcons name="lightbulb" size={20} color={Colors.warning} />
            {' '}Tips for Using Exported Data
          </Text>
          <Text style={styles.tipItem}>• Open CSV files in Excel, Google Sheets, or any accounting software</Text>
          <Text style={styles.tipItem}>• Monthly exports help with tax filing and bookkeeping</Text>
          <Text style={styles.tipItem}>• Keep backups of exported data for your records</Text>
          <Text style={styles.tipItem}>• Share files via WhatsApp, Email, or save to Google Drive</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDark },
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
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textMuted, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  pickerContainer: {
    flex: 1,
    backgroundColor: Colors.bgMedium,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    padding: 8,
  },
  pickerLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  picker: { color: Colors.textPrimary },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  exportButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  exportButtonDisabled: { opacity: 0.5 },
  exportButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  tipsCard: {
    backgroundColor: Colors.warning + '15',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  tipItem: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 4 },
});