import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ onLogin, onGoToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => onLogin({ email: email.trim(), password })}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={onGoToSignup}><Text style={styles.link}> Sign up</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'transparent' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 28, textAlign: 'center', color: '#1a202c' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, marginBottom: 14, backgroundColor: 'transparent', fontSize: 16, height: 48 },
  button: { backgroundColor: '#2b6cb0', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 18, shadowColor: '#2b6cb0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  link: { color: '#2b6cb0', fontWeight: '600' },
  note: { marginTop: 24, color: '#718096', fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
