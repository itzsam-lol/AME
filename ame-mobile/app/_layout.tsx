import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/Colors';

const InitialLayout = () => {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) router.replace('/(auth)/login');
    else if (token && inAuthGroup) router.replace('/(tabs)');
  }, [token, segments, loading]);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.bgDark }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
