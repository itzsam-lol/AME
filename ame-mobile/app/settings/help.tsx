import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpScreen() {
  const router = useRouter();

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@ame.app?subject=AME Support Request');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/919876543210?text=Hello, I need help with AME app');
  };

  const faqs = [
    {
      question: 'How do I scan an invoice?',
      answer: 'Tap the "Scan Invoice" button on the dashboard or the camera icon in the Invoices tab. Position your handwritten invoice within the frame and tap the capture button. The app will automatically extract the data using AI.',
    },
    {
      question: 'How accurate is the OCR extraction?',
      answer: 'Our AI achieves 85-95% accuracy depending on handwriting clarity. We recommend reviewing extracted data before finalizing invoices. You can always edit any field that was incorrectly extracted.',
    },
    {
      question: 'How do I export my data?',
      answer: 'Go to Profile → Export Data. Select the month and year, then tap "Export Invoices" to download a CSV file. You can also export all customers at once.',
    },
    {
      question: 'Can I edit invoices after scanning?',
      answer: 'Yes! After scanning, you\'ll see a preview screen where you can edit all extracted fields before saving the invoice.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. All data is encrypted and stored on secure servers in India. We use industry-standard AES-256 encryption. See our Privacy Policy for details.',
    },
    {
      question: 'How do I add customers manually?',
      answer: 'Go to the Customers tab and tap the + button. Fill in the customer details and save. Customers can also be auto-created when you scan invoices.',
    },
    {
      question: 'What file format is the export?',
      answer: 'Exports are in CSV (Comma-Separated Values) format, which can be opened in Excel, Google Sheets, or any accounting software.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Profile → Account Settings → Danger Zone → Delete Account. Please note this action is permanent and cannot be undone.',
    },
  ];

  const contactMethods = [
    {
      icon: <Ionicons name="mail" size={24} color={Colors.primary} />,
      title: 'Email Support',
      subtitle: 'support@ame.app',
      description: 'Get help within 24 hours',
      action: openEmail,
    },
    {
      icon: <Ionicons name="logo-whatsapp" size={24} color={Colors.success} />,
      title: 'WhatsApp Support',
      subtitle: '+91 98765 43210',
      description: 'Chat with us instantly',
      action: openWhatsApp,
    },
    {
      icon: <Ionicons name="call" size={24} color={Colors.secondary} />,
      title: 'Phone Support',
      subtitle: '+91 98765 43210',
      description: 'Mon-Sat, 9 AM - 6 PM IST',
      action: () => Linking.openURL('tel:+919876543210'),
    },
  ];

  const resources = [
    {
      icon: <MaterialCommunityIcons name="book-open-variant" size={24} color={Colors.info} />,
      title: 'User Guide',
      subtitle: 'Complete app documentation',
      action: () => openURL('https://ame.app/guide'),
    },
    {
      icon: <MaterialCommunityIcons name="video" size={24} color={Colors.warning} />,
      title: 'Video Tutorials',
      subtitle: 'Learn with step-by-step videos',
      action: () => openURL('https://youtube.com/@ameapp'),
    },
    {
      icon: <MaterialCommunityIcons name="frequently-asked-questions" size={24} color={Colors.primary} />,
      title: 'FAQ',
      subtitle: 'Common questions answered',
      action: () => {}, // Scroll to FAQ section below
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Methods */}
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        {contactMethods.map((method, index) => (
          <TouchableOpacity key={index} style={styles.contactCard} onPress={method.action}>
            <View style={styles.contactIcon}>{method.icon}</View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              <Text style={styles.contactDescription}>{method.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Resources */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Resources</Text>
        {resources.map((resource, index) => (
          <TouchableOpacity key={index} style={styles.resourceCard} onPress={resource.action}>
            <View style={styles.resourceIcon}>{resource.icon}</View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <View style={styles.faqQuestion}>
              <Ionicons name="help-circle" size={20} color={Colors.primary} />
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
            </View>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}

        {/* Report Bug */}
        <View style={styles.bugCard}>
          <MaterialCommunityIcons name="bug" size={32} color={Colors.error} />
          <Text style={styles.bugTitle}>Found a Bug?</Text>
          <Text style={styles.bugText}>
            Help us improve AME by reporting any issues you encounter
          </Text>
          <TouchableOpacity
            style={styles.bugButton}
            onPress={() => openURL('mailto:bugs@ame.app?subject=Bug Report')}
          >
            <Text style={styles.bugButtonText}>Report Bug</Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  contactIcon: { marginRight: 12 },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  contactSubtitle: { fontSize: 14, color: Colors.primary, marginBottom: 2 },
  contactDescription: { fontSize: 12, color: Colors.textMuted },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  resourceIcon: { marginRight: 12 },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  resourceSubtitle: { fontSize: 13, color: Colors.textMuted },
  faqCard: {
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  faqAnswer: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  bugCard: {
    backgroundColor: Colors.error + '15',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  bugTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.error, marginTop: 12, marginBottom: 8 },
  bugText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  bugButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bugButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});