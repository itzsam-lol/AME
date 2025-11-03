import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About AME</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="receipt" size={80} color={Colors.primary} />
          <Text style={styles.appName}>AME</Text>
          <Text style={styles.tagline}>Invoice Digitization Made Easy</Text>
        </View>

        <View style={styles.versionCard}>
          <Text style={styles.versionLabel}>Version</Text>
          <Text style={styles.versionNumber}>1.0.0</Text>
          <Text style={styles.buildNumber}>Build 100</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.text}>
            AME is an AI-powered invoice digitization app designed specifically for small and medium businesses in India. We help convert handwritten invoices into digital format using advanced OCR technology.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="camera" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>Scan handwritten invoices</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud-done" size={20} color={Colors.success} />
            <Text style={styles.featureText}>AI-powered data extraction</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={20} color={Colors.secondary} />
            <Text style={styles.featureText}>Customer management</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="download" size={20} color={Colors.warning} />
            <Text style={styles.featureText}>Monthly CSV exports</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={20} color={Colors.info} />
            <Text style={styles.featureText}>Business analytics</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={() => openURL('mailto:support@ame.app')}>
            <Ionicons name="mail" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>support@ame.app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={() => openURL('https://ame.app')}>
            <Ionicons name="globe" size={20} color={Colors.secondary} />
            <Text style={styles.contactText}>www.ame.app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={() => openURL('https://twitter.com/ameapp')}>
            <Ionicons name="logo-twitter" size={20} color={Colors.info} />
            <Text style={styles.contactText}>@ameapp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.legalItem} onPress={() => router.push('/settings/privacy-policy')}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalItem} onPress={() => router.push('/settings/terms')}>
            <Text style={styles.legalText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalItem} onPress={() => openURL('https://ame.app/licenses')}>
            <Text style={styles.legalText}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2025 AME. All rights reserved.{'\n'}
          Made with ❤️ in India
        </Text>

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
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  appName: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16 },
  tagline: { fontSize: 16, color: Colors.textMuted, marginTop: 4 },
  versionCard: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  versionLabel: { fontSize: 14, color: Colors.textMuted, marginBottom: 4 },
  versionNumber: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  buildNumber: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  text: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  featureText: { fontSize: 15, color: Colors.textSecondary },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: { fontSize: 15, color: Colors.primary },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  legalText: { fontSize: 15, color: Colors.textSecondary },
  copyright: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 16,
    lineHeight: 22,
  },
});