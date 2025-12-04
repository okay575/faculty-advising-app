import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignupScreen({ onSignup, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [studentID, setStudentID] = useState('');

  const submit = () => {
    if (!name || !email || !password) return alert('Please fill all fields');
    if (role === 'student' && !studentID) return alert('Please enter Student ID');
    onSignup({ name: name.trim(), email: email.trim(), password, role, studentID: role === 'student' ? studentID.trim() : undefined });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      {role === 'student' && (
        <TextInput placeholder="Student ID Number" value={studentID} onChangeText={setStudentID} style={styles.input} />
      )}

      <View style={styles.roleRow}>
        <TouchableOpacity style={[styles.roleBtn, role === 'faculty' && styles.roleSelected]} onPress={() => setRole('faculty')}>
          <Text style={role === 'faculty' ? { color: 'white' } : {}}>Faculty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleBtn, role === 'student' && styles.roleSelected]} onPress={() => setRole('student')}>
          <Text style={role === 'student' ? { color: 'white' } : {}}>Student</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={submit}><Text style={styles.buttonText}>Sign up</Text></TouchableOpacity>

      <View style={styles.row}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={onGoToLogin}><Text style={styles.link}> Sign in</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'transparent' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 28, textAlign: 'center', color: '#1a202c' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, marginBottom: 14, backgroundColor: 'transparent', fontSize: 16, height: 48 },
  roleRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18, gap: 12 },
  roleBtn: { flex: 1, padding: 14, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 8, alignItems: 'center', backgroundColor: 'transparent', minHeight: 48 },
  roleSelected: { backgroundColor: '#2b6cb0', borderColor: '#2b6cb0' },
  button: { backgroundColor: '#2b6cb0', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 18, shadowColor: '#2b6cb0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  link: { color: '#2b6cb0', fontWeight: '600' },
  note: { marginTop: 24, color: '#718096', fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
