import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function WelcomeScreen() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleContinue = () => {
    if (!agreedToTerms) {
      alert('Please accept the Privacy Policy and Terms & Conditions to continue');
      return;
    }
    router.push('/onboarding/auth');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/bbg1.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to AME</Text>
        <Text style={styles.subtitle}>
          Digitize your handwritten invoices with AI
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="camera" size={32} color={Colors.primary} />
            <Text style={styles.featureText}>Scan invoices with camera</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="cloud-done" size={32} color={Colors.success} />
            <Text style={styles.featureText}>Auto-extract data with AI</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="download" size={32} color={Colors.secondary} />
            <Text style={styles.featureText}>Export to CSV monthly</Text>
          </View>
        </View>

        {/* Privacy Policy Preview */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalTitle}>Privacy Policy</Text>
          <ScrollView style={styles.legalContent} nestedScrollEnabled>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>1. Data Collection{'\n'}</Text>
              We collect business information (name, GST, address), invoice data (customer details, amounts), and usage analytics to provide our service.{'\n\n'}
              
              <Text style={styles.legalBold}>2. Data Usage{'\n'}</Text>
              Your data is used to provide invoice digitization services, generate reports, and improve our AI models. We never share your data with third parties without consent.{'\n\n'}
              
              <Text style={styles.legalBold}>3. Data Storage{'\n'}</Text>
              All data is encrypted and stored securely on servers located in India. You have full control to export or delete your data anytime.{'\n\n'}
              
              <Text style={styles.legalBold}>4. Your Rights{'\n'}</Text>
              You can access, modify, or delete your data anytime through the app settings.
            </Text>
          </ScrollView>

          <TouchableOpacity 
            style={styles.readMore}
            onPress={() => router.push('/settings/privacy-policy')}
          >
            <Text style={styles.readMoreText}>Read Full Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions Preview */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalTitle}>Terms & Conditions</Text>
          <ScrollView style={styles.legalContent} nestedScrollEnabled>
            <Text style={styles.legalText}>
              <Text style={styles.legalBold}>1. Service Description{'\n'}</Text>
              AME provides invoice digitization services using OCR/AI technology. We aim for accuracy but cannot guarantee 100% error-free extraction.{'\n\n'}
              
              <Text style={styles.legalBold}>2. User Obligations{'\n'}</Text>
              You agree to provide accurate business information and use the service only for lawful purposes.{'\n\n'}
              
              <Text style={styles.legalBold}>3. Payment{'\n'}</Text>
              Basic features are free. Premium features may require subscription.{'\n\n'}
              
              <Text style={styles.legalBold}>4. Liability{'\n'}</Text>
              AME is not responsible for business decisions made based on app data. Always verify important information.{'\n\n'}
              
              <Text style={styles.legalBold}>5. Governing Law{'\n'}</Text>
              These terms are governed by the laws of India.
            </Text>
          </ScrollView>

          <TouchableOpacity 
            style={styles.readMore}
            onPress={() => router.push('/settings/terms')}
          >
            <Text style={styles.readMoreText}>Read Full Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Acceptance Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={agreedToTerms}
            onValueChange={setAgreedToTerms}
            color={agreedToTerms ? Colors.primary : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            I have read and agree to the{' '}
            <Text style={styles.link}>Privacy Policy</Text>
            {' '}and{' '}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.continueButton, !agreedToTerms && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!agreedToTerms}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  feature: {
    alignItems: 'center',
    width: '30%',
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  legalContainer: {
    backgroundColor: Colors.bgMedium,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  legalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  legalContent: {
    maxHeight: 150,
    marginBottom: 12,
  },
  legalText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  legalBold: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: Colors.primary,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});