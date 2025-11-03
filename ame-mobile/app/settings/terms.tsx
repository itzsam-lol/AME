import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: November 2, 2025</Text>

        <Text style={styles.intro}>
          Welcome to AME. By accessing or using our invoice digitization application, you agree to be bound by these Terms and Conditions. Please read them carefully.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Service Description</Text>
          <Text style={styles.text}>
            AME provides invoice digitization services using Optical Character Recognition (OCR) and Artificial Intelligence technologies. The service includes:{'\n\n'}
            • Scanning handwritten invoices via camera{'\n'}
            • Extracting invoice data using AI/OCR{'\n'}
            • Managing customer database{'\n'}
            • Generating monthly reports{'\n'}
            • Exporting data to CSV format
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By creating an account or using AME, you:{'\n\n'}
            • Confirm you are at least 18 years old{'\n'}
            • Agree to these Terms and Conditions{'\n'}
            • Agree to our Privacy Policy{'\n'}
            • Have the authority to bind your business to these terms
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Obligations</Text>
          <Text style={styles.text}>
            You agree to:{'\n\n'}
            • Provide accurate business information{'\n'}
            • Keep your account credentials secure{'\n'}
            • Use the service only for lawful purposes{'\n'}
            • Not attempt to hack, reverse-engineer, or disrupt the service{'\n'}
            • Not upload malicious content or viruses{'\n'}
            • Comply with all applicable laws and regulations{'\n'}
            • Be responsible for all activity under your account
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Service Accuracy</Text>
          <Text style={styles.text}>
            While we strive for accuracy in OCR/AI extraction:{'\n\n'}
            • We cannot guarantee 100% error-free data extraction{'\n'}
            • Users must verify extracted data before finalizing invoices{'\n'}
            • We are not liable for errors in extracted data{'\n'}
            • Accuracy depends on invoice quality and handwriting clarity{'\n'}
            • Users should always double-check amounts and customer details
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Payment and Subscription</Text>
          <Text style={styles.text}>
            • Basic features are provided free of charge{'\n'}
            • Premium features may require a paid subscription{'\n'}
            • Subscription fees are non-refundable{'\n'}
            • Prices may change with 30 days notice{'\n'}
            • You can cancel subscription at any time{'\n'}
            • All prices are in Indian Rupees (INR)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
          <Text style={styles.text}>
            • AME and its original content are owned by us{'\n'}
            • Our logo, design, and software are protected by copyright{'\n'}
            • You retain ownership of your business data{'\n'}
            • You grant us license to process your data to provide services{'\n'}
            • You may not copy, modify, or distribute our software
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data Ownership</Text>
          <Text style={styles.text}>
            • You own all your business and customer data{'\n'}
            • You can export your data at any time{'\n'}
            • You can delete your account and data{'\n'}
            • We use your data only as described in Privacy Policy{'\n'}
            • We may use anonymized data to improve AI models
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.text}>
            AME and its affiliates shall not be liable for:{'\n\n'}
            • Business decisions made based on app data{'\n'}
            • Loss of data due to device issues{'\n'}
            • Service interruptions or downtime{'\n'}
            • OCR extraction errors{'\n'}
            • Indirect, incidental, or consequential damages{'\n'}
            • Loss of profits or revenue{'\n\n'}
            Total liability is limited to subscription fees paid in the last 3 months.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Service Availability</Text>
          <Text style={styles.text}>
            • We aim for 99% uptime but do not guarantee it{'\n'}
            • Scheduled maintenance will be announced in advance{'\n'}
            • We reserve the right to modify or discontinue features{'\n'}
            • Service may be temporarily unavailable for updates
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Termination</Text>
          <Text style={styles.text}>
            We may suspend or terminate your account if:{'\n\n'}
            • You violate these Terms{'\n'}
            • You engage in fraudulent activity{'\n'}
            • You fail to pay subscription fees{'\n'}
            • Required by law{'\n\n'}
            Upon termination:{'\n'}
            • Your access will be revoked{'\n'}
            • You can export data within 30 days{'\n'}
            • Data will be deleted after 30 days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Governing Law</Text>
          <Text style={styles.text}>
            These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in [Your City], India.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Dispute Resolution</Text>
          <Text style={styles.text}>
            • Disputes should first be resolved through good-faith negotiation{'\n'}
            • If unresolved, disputes may be submitted to arbitration{'\n'}
            • Arbitration will be conducted in accordance with Indian Arbitration and Conciliation Act, 1996
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right to modify these Terms at any time. Material changes will be notified via:{'\n\n'}
            • Email notification{'\n'}
            • In-app notification{'\n'}
            • Website announcement{'\n\n'}
            Continued use after changes constitutes acceptance.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.text}>
            For questions about these Terms, contact:{'\n\n'}
            Email: legal@ame.app{'\n'}
            Address: [Your Business Address]{'\n'}
            Phone: [Your Phone Number]
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
  text: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
});