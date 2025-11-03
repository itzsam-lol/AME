import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Business',
      items: [
        { 
          icon: <MaterialCommunityIcons name="store" size={22} color={Colors.primary} />,
          title: 'Business Profile', 
          subtitle: 'Manage your business details',
          screen: '/business-setup',
          color: Colors.primary
        },
        { 
          icon: <MaterialCommunityIcons name="file-export" size={22} color={Colors.success} />,
          title: 'Export Data', 
          subtitle: 'Download monthly reports',
          screen: '/settings/export',
          color: Colors.success
        },
      ]
    },
    {
      title: 'Account',
      items: [
        { 
          icon: <Ionicons name="person" size={22} color={Colors.info} />,
          title: 'Account Settings', 
          subtitle: 'Update your personal info',
          screen: '/settings/account',
          color: Colors.info
        },
        { 
          icon: <Ionicons name="notifications" size={22} color={Colors.warning} />,
          title: 'Notifications', 
          subtitle: 'Manage notification preferences',
          screen: '/settings/notifications',
          color: Colors.warning
        },
      ]
    },
    {
      title: 'Legal & Support',
      items: [
        { 
          icon: <MaterialCommunityIcons name="shield-lock" size={22} color={Colors.secondary} />,
          title: 'Privacy Policy', 
          subtitle: 'Read our privacy policy',
          screen: '/settings/privacy-policy',
          color: Colors.secondary
        },
        { 
          icon: <MaterialCommunityIcons name="file-document" size={22} color={Colors.secondary} />,
          title: 'Terms & Conditions', 
          subtitle: 'Read our terms',
          screen: '/settings/terms',
          color: Colors.secondary
        },
        { 
          icon: <Ionicons name="help-circle" size={22} color={Colors.info} />,
          title: 'Help & Support', 
          subtitle: 'Get help and support',
          screen: '/settings/help',
          color: Colors.info
        },
        { 
          icon: <Ionicons name="information-circle" size={22} color={Colors.textMuted} />,
          title: 'About', 
          subtitle: 'App version and info',
          screen: '/settings/about',
          color: Colors.textMuted
        },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => item.screen && router.push(item.screen as any)}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                  {item.icon}
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 40,
  },
});