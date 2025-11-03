import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: Colors.bgMedium, borderTopColor: Colors.glassBorder },
      tabBarActiveTintColor: Colors.primary,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{color}}>📊</Text> }} />
      <Tabs.Screen name="invoices" options={{ title: 'Invoices', tabBarIcon: ({ color }) => <Text style={{color}}>📄</Text> }} />
      <Tabs.Screen name="customers" options={{ title: 'Customers', tabBarIcon: ({ color }) => <Text style={{color}}>👥</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{color}}>👤</Text> }} />
    </Tabs>
  );
}
