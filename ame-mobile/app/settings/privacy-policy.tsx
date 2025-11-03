import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: November 2, 2025</Text>

        <Text style={styles.intro}>
          AME ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoice digitization mobile application.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>Personal Information</Text>
          <Text style={styles.text}>
            When you create an account, we collect:{'\n'}
            • Full name{'\n'}
            • Email address{'\n'}
            • Phone number{'\n'}
            • Password (encrypted)
          </Text>

          <Text style={styles.subsectionTitle}>Business Information</Text>
          <Text style={styles.text}>
            • Business name{'\n'}
            • Business type{'\n'}
            • GST number (optional){'\n'}
            • Business address
          </Text>

          <Text style={styles.subsectionTitle}>Invoice Data</Text>
          <Text style={styles.text}>
            • Customer details (name, phone, email, address){'\n'}
            • Invoice items and amounts{'\n'}
            • Payment status{'\n'}
            • Images of scanned invoices
          </Text>

          <Text style={styles.subsectionTitle}>Usage Information</Text>
          <Text style={styles.text}>
            • Device information{'\n'}
            • App usage analytics{'\n'}
            • Error logs{'\n'}
            • Camera usage (for invoice scanning)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the collected information to:{'\n\n'}
            • Provide invoice digitization services{'\n'}
            • Process and extract data from scanned invoices using AI/OCR{'\n'}
            • Generate monthly reports and analytics{'\n'}
            • Send notifications about invoice status{'\n'}
            • Improve our OCR/AI accuracy{'\n'}
            • Provide customer support{'\n'}
            • Ensure security and prevent fraud{'\n'}
            • Comply with legal obligations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
          <Text style={styles.text}>
            • All data is stored on secure servers located in India{'\n'}
            • We use industry-standard encryption (AES-256) for data at rest{'\n'}
            • All data transmission uses SSL/TLS encryption{'\n'}
            • Passwords are hashed using bcrypt{'\n'}
            • Regular security audits are conducted{'\n'}
            • Access to data is restricted to authorized personnel only
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>
          <Text style={styles.text}>
            We do NOT sell your personal information. We may share data only in these limited circumstances:{'\n\n'}
            • With your explicit consent{'\n'}
            • With service providers (cloud hosting, OCR API) under strict confidentiality agreements{'\n'}
            • When required by law or legal proceedings{'\n'}
            • To protect our rights and prevent fraud
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:{'\n\n'}
            • Access your data at any time through the app{'\n'}
            • Update or correct your information{'\n'}
            • Export all your data as CSV files{'\n'}
            • Delete your account and all associated data{'\n'}
            • Opt-out of marketing communications{'\n'}
            • Request a copy of your data
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.text}>
            • Active account data is retained as long as your account is active{'\n'}
            • After account deletion, data is permanently removed within 30 days{'\n'}
            • Backup copies are deleted within 90 days{'\n'}
            • Legal documents may be retained for 7 years as per Indian tax laws
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.text}>
            AME is not intended for users under 18 years of age. We do not knowingly collect information from children.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or app notification.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.text}>
            If you have questions about this Privacy Policy, contact us at:{'\n\n'}
            Email: privacy@ame.app{'\n'}
            Address: [Your Business Address]{'\n'}
            Phone: [Your Phone Number]
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Governing Law</Text>
          <Text style={styles.text}>
            This Privacy Policy is governed by the laws of India and complies with the Information Technology Act, 2000 and applicable data protection regulations.
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
  lastUpdated: { fontSize: 14, color: Colors.textMuted, marginBottom: 16, fontStyle: 'italic' },
  intro: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  subsectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginTop: 12, marginBottom: 8 },
  text: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
});
