import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    invoiceReminders: true,
    paymentAlerts: true,
    overdueInvoices: true,
    newCustomers: false,
    monthlyReports: true,
    appUpdates: true,
    marketingEmails: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationCategories = [
    {
      title: 'Invoice Notifications',
      items: [
        {
          key: 'invoiceReminders',
          icon: <MaterialCommunityIcons name="bell-ring" size={22} color={Colors.primary} />,
          label: 'Invoice Reminders',
          description: 'Remind customers about pending invoices',
        },
        {
          key: 'paymentAlerts',
          icon: <Ionicons name="cash" size={22} color={Colors.success} />,
          label: 'Payment Alerts',
          description: 'Notify when payments are received',
        },
        {
          key: 'overdueInvoices',
          icon: <MaterialCommunityIcons name="alert-circle" size={22} color={Colors.error} />,
          label: 'Overdue Invoice Alerts',
          description: 'Alert when invoices become overdue',
        },
      ],
    },
    {
      title: 'Business Updates',
      items: [
        {
          key: 'newCustomers',
          icon: <Ionicons name="person-add" size={22} color={Colors.secondary} />,
          label: 'New Customers',
          description: 'Notify when new customers are added',
        },
        {
          key: 'monthlyReports',
          icon: <MaterialCommunityIcons name="chart-line" size={22} color={Colors.info} />,
          label: 'Monthly Reports',
          description: 'Receive monthly business summary',
        },
      ],
    },
    {
      title: 'App Notifications',
      items: [
        {
          key: 'appUpdates',
          icon: <Ionicons name="download" size={22} color={Colors.warning} />,
          label: 'App Updates',
          description: 'Notify about new features and updates',
        },
        {
          key: 'marketingEmails',
          icon: <Ionicons name="mail" size={22} color={Colors.primary} />,
          label: 'Marketing Emails',
          description: 'Promotional offers and tips',
        },
      ],
    },
    {
      title: 'Notification Channels',
      items: [
        {
          key: 'pushNotifications',
          icon: <Ionicons name="notifications" size={22} color={Colors.primary} />,
          label: 'Push Notifications',
          description: 'In-app notifications',
        },
        {
          key: 'emailNotifications',
          icon: <Ionicons name="mail-open" size={22} color={Colors.secondary} />,
          label: 'Email Notifications',
          description: 'Receive notifications via email',
        },
        {
          key: 'smsNotifications',
          icon: <Ionicons name="chatbox" size={22} color={Colors.success} />,
          label: 'SMS Notifications',
          description: 'Receive notifications via SMS',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <Text style={styles.infoText}>
            Manage how and when you receive notifications about your business activities
          </Text>
        </View>

        {notificationCategories.map((category, catIndex) => (
          <View key={catIndex} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>{item.icon}</View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: Colors.bgLight, true: Colors.primary + '50' }}
                  thumbColor={settings[item.key] ? Colors.primary : Colors.textMuted}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.quietHoursCard}>
          <MaterialCommunityIcons name="moon-waning-crescent" size={32} color={Colors.warning} />
          <Text style={styles.quietHoursTitle}>Quiet Hours</Text>
          <Text style={styles.quietHoursText}>
            Schedule quiet hours to pause notifications during specific times (Coming Soon)
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
  infoText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  category: { marginBottom: 32 },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 },
  settingIcon: { marginRight: 12 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary, marginBottom: 2 },
  settingDescription: { fontSize: 13, color: Colors.textMuted },
  quietHoursCard: {
    backgroundColor: Colors.warning + '15',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  quietHoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.warning,
    marginTop: 12,
    marginBottom: 8,
  },
  quietHoursText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});