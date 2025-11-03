import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

export default function BusinessOnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    gstin: '',
    city: '',
    state: '',
  });

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Puducherry',
    'Jammu and Kashmir',
    'Ladakh',
  ];

  const businessTypes = [
    'Retail Store',
    'Wholesale',
    'Manufacturing',
    'Services',
    'Restaurant/Cafe',
    'Food & Beverage',
    'Medical/Pharmacy',
    'Clinic/Hospital',
    'Electronics',
    'Clothing/Fashion',
    'Grocery Store',
    'Supermarket',
    'Hardware Store',
    'Automobile/Garage',
    'Beauty/Salon',
    'Gym/Fitness',
    'Education/Tuition',
    'Real Estate',
    'Construction',
    'Consultancy',
    'IT Services',
    'Photography',
    'Event Management',
    'Travel Agency',
    'Printing/Stationery',
    'Jewelry',
    'Furniture',
    'Home Decor',
    'Books/Stationery',
    'Pet Shop',
    'Florist',
    'Bakery',
    'Other',
  ];

  const verifyLocation = async () => {
    if (!formData.city) {
      Alert.alert('Error', 'Please enter your city first');
      return;
    }

    setLocationLoading(true);
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'We need your location to verify your business city. This is only used once during setup.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Grant Permission', onPress: verifyLocation }
          ]
        );
        setLocationLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get city
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const detectedCity = geocode[0].city || geocode[0].district || geocode[0].subregion;
        setCurrentLocation(detectedCity || 'Unknown');

        // Verify city match (case-insensitive, partial match)
        const enteredCity = formData.city.toLowerCase().trim();
        const detectedCityLower = (detectedCity || '').toLowerCase().trim();

        const isMatch = 
          enteredCity === detectedCityLower ||
          detectedCityLower.includes(enteredCity) ||
          enteredCity.includes(detectedCityLower);

        if (isMatch) {
          setLocationVerified(true);
          Alert.alert(
            'Location Verified ✓',
            `Your business city "${formData.city}" has been verified successfully!`
          );
        } else {
          Alert.alert(
            'Location Mismatch',
            `Your current location appears to be "${detectedCity}" but you entered "${formData.city}".\n\nPlease verify your business city is correct.`,
            [
              { 
                text: 'Update City', 
                onPress: () => {
                  setFormData({ ...formData, city: detectedCity || '' });
                  setLocationVerified(true);
                }
              },
              { 
                text: 'Keep Entered City', 
                onPress: () => {
                  // Allow user to proceed if they confirm
                  Alert.alert(
                    'Confirm Business City',
                    `Are you sure your business is in "${formData.city}"?`,
                    [
                      { text: 'No, Let Me Change', style: 'cancel' },
                      { 
                        text: 'Yes, Continue',
                        onPress: () => setLocationVerified(true)
                      }
                    ]
                  );
                }
              }
            ]
          );
        }
      }
    } catch (error: any) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Failed to get your location. Please try again or continue without verification.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!formData.businessName || !formData.businessType || !formData.city || !formData.state) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!locationVerified) {
      Alert.alert(
        'Location Not Verified',
        'Please verify your business location before proceeding.',
        [
          { text: 'Verify Now', onPress: verifyLocation },
          { text: 'Skip Verification', onPress: () => proceedWithSetup() }
        ]
      );
      return;
    }

    proceedWithSetup();
  };

  const proceedWithSetup = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/business', formData);
      
      if (response.data.success) {
        Alert.alert(
          'Setup Complete!',
          'Your business profile has been created successfully',
          [{ text: 'Start Using AME', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create business profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Business Setup</Text>
        <Text style={styles.stepIndicator}>Step 3 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="store" size={64} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Setup Your Business</Text>
        <Text style={styles.subtitle}>Tell us about your business to get started</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter business name"
            placeholderTextColor={Colors.textMuted}
            value={formData.businessName}
            onChangeText={(text) => setFormData({ ...formData, businessName: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessType}
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              style={styles.picker}
              dropdownIconColor={Colors.textPrimary}
            >
              <Picker.Item label="Select business type" value="" />
              {businessTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>GST Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter GST number"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            maxLength={15}
            value={formData.gstin}
            onChangeText={(text) => setFormData({ ...formData, gstin: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>State *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.state}
              onValueChange={(value) => setFormData({ ...formData, state: value })}
              style={styles.picker}
              dropdownIconColor={Colors.textPrimary}
            >
              <Picker.Item label="Select state" value="" />
              {indianStates.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            placeholderTextColor={Colors.textMuted}
            value={formData.city}
            onChangeText={(text) => {
              setFormData({ ...formData, city: text });
              setLocationVerified(false); // Reset verification when city changes
            }}
          />
        </View>

        {/* Location Verification */}
        <View style={[styles.locationCard, locationVerified && styles.locationCardVerified]}>
          <View style={styles.locationHeader}>
            <Ionicons 
              name={locationVerified ? "checkmark-circle" : "location"} 
              size={24} 
              color={locationVerified ? Colors.success : Colors.warning} 
            />
            <Text style={[styles.locationTitle, locationVerified && styles.locationTitleVerified]}>
              {locationVerified ? 'Location Verified' : 'Verify Business Location'}
            </Text>
          </View>
          
          {!locationVerified ? (
            <>
              <Text style={styles.locationText}>
                We need to verify that your business is actually in the city you mentioned. This helps maintain trust and accuracy.
              </Text>
              <TouchableOpacity
                style={[styles.verifyButton, locationLoading && styles.verifyButtonDisabled]}
                onPress={verifyLocation}
                disabled={locationLoading || !formData.city}
              >
                {locationLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="location" size={20} color="#fff" />
                    <Text style={styles.verifyButtonText}>Verify Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.verifiedInfo}>
              <Text style={styles.verifiedText}>
                Your business location in {formData.city}, {formData.state} has been verified successfully!
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (loading || !locationVerified) && styles.submitButtonDisabled]}
          onPress={handleComplete}
          disabled={loading || !locationVerified}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Complete Setup</Text>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </>
          )}
        </TouchableOpacity>

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
  stepIndicator: { fontSize: 12, color: Colors.textMuted },
  content: { padding: 24 },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textMuted, marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: Colors.bgMedium,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  pickerContainer: {
    backgroundColor: Colors.bgMedium,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: { color: Colors.textPrimary },
  locationCard: {
    backgroundColor: Colors.warning + '15',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.warning + '30',
    marginBottom: 24,
  },
  locationCardVerified: {
    backgroundColor: Colors.success + '15',
    borderColor: Colors.success + '30',
  },
  locationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  locationTitle: { fontSize: 16, fontWeight: '600', color: Colors.warning },
  locationTitleVerified: { color: Colors.success },
  locationText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  verifyButton: {
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  verifyButtonDisabled: { opacity: 0.5 },
  verifyButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  verifiedInfo: { paddingVertical: 8 },
  verifiedText: { fontSize: 14, color: Colors.success, lineHeight: 20 },
  submitButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});