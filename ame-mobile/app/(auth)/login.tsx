import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { Image } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
  source={require('../../assets/bbg1.png')} 
  style={styles.logo}
  resizeMode="contain"/>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <Text style={styles.switchText}>Don't have an account? <Link href="/(auth)/signup"><Text style={styles.switchLink}>Sign Up</Text></Link></Text>
    </View>
  );
}
const styles = StyleSheet.create({
  logo: {width: 120,height: 120,alignSelf: 'center',marginBottom: 24,},
  container: { flex: 1, backgroundColor: Colors.bgDark, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 32 },
  input: { backgroundColor: Colors.bgMedium, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: 8, padding: 16, color: Colors.textPrimary, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  switchText: { marginTop: 24, textAlign: 'center', color: Colors.textMuted },
  switchLink: { color: Colors.secondary, fontWeight: 'bold' },
});
