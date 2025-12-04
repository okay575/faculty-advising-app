import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import TopBar from '../components/TopBar';

export default function Dashboard({ user, users, onOpenFaculty, onOpenStudent, onOpenCourse, onSignOut, onSendRequest }) {
  const isFaculty = user && user.role === 'faculty';
  const facultySubjects = isFaculty ? (user.subjects || []) : [];
  const facultyList = users ? users.filter((u) => u.role === 'faculty') : [];
  const [showRequest, setShowRequest] = useState(false);
  const [targetFaculty, setTargetFaculty] = useState(null);
  const [datetime, setDatetime] = useState('');
  const [message, setMessage] = useState('');

  const openRequestFor = (faculty) => {
    setTargetFaculty(faculty);
    setDatetime('');
    setMessage('');
    setShowRequest(true);
  };

  const sendRequest = async () => {
    if (!targetFaculty) return alert('No faculty selected');
    if (!datetime) return alert('Enter date & time');
    await onSendRequest({ facultyId: targetFaculty.id, datetime, message });
    setShowRequest(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Dashboard" showBack={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome, {user ? user.name : 'Guest'}</Text>
          <Text style={styles.sectionSub}>Quick access</Text>
          {isFaculty ? (
            <>
              <Card title="Manage Courses" subtitle={`${facultySubjects.length} courses`} accent="#2b6cb0" onPress={onOpenFaculty} style={styles.largeCard} />
              <Card title="Status / Office Hours" subtitle={`Status: ${user.status || 'available'}`} accent="#38a169" onPress={onOpenFaculty} style={styles.largeCard} />
            </>
              ) : (
            <>
              <Card title="Browse Faculty" subtitle={`${facultyList.length} instructors`} accent="#2b6cb0" onPress={onOpenStudent} style={styles.largeCard} />
              <Card title="My Schedule" subtitle="View your enrolled course schedules" accent="#805ad5" onPress={() => onOpenCourse(null)} style={styles.largeCard} />
            </>
          )}
        </View>

      <Modal visible={showRequest} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Request Consultation with {targetFaculty ? targetFaculty.name : ''}</Text>
            <TextInput placeholder="Date & time (e.g., 2025-12-05 14:00)" value={datetime} onChangeText={setDatetime} style={styles.input} />
            <TextInput placeholder="Message (optional)" value={message} onChangeText={setMessage} style={[styles.input, { height: 80 }]} multiline />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity onPress={() => setShowRequest(false)} style={{ marginRight: 12 }}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendRequest} style={{ backgroundColor: '#2b6cb0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }}><Text style={{ color: 'white' }}>Send</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signOut: { color: '#2b6cb0', fontWeight: '700', fontSize: 14 },
  section: { marginTop: 16, paddingVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 16, color: '#1a202c', marginBottom: 12 },
  sectionSub: { paddingHorizontal: 16, color: '#718096', marginTop: 6, fontSize: 14 },
  empty: { padding: 16, color: '#a0aec0', fontSize: 14 },
  largeCard: { height: 120, marginHorizontal: 16, marginVertical: 8 },
  requestRow: { paddingHorizontal: 12, marginBottom: 6 },
  requestBtn: { backgroundColor: '#edf2f7', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1' },
  requestText: { color: '#2b6cb0', fontWeight: '700', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: 'transparent', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginTop: 12, backgroundColor: 'transparent', fontSize: 15, height: 44 }
});
