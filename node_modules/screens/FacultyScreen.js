import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleList from '../components/ScheduleList';
import TopBar from '../components/TopBar';

export default function FacultyScreen({ data, onSave, onBack }) {
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [status, setStatus] = useState((data && data.status) || 'available');
  const [subjectName, setSubjectName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const subjects = (data && data.subjects) || [];

  const addSchedule = () => {
    if (!title || !when) {
      Alert.alert('Validation', 'Please enter both title and time/notes');
      return;
    }
    if (!selectedSubjectId) {
      Alert.alert('Select subject', 'Please select a subject to add the schedule to.');
      return;
    }

    const nextSubjects = subjects.map((s) => {
      if (s.id !== selectedSubjectId) return s;
      const existing = s.schedules || [];
      return { ...s, schedules: [{ id: Date.now().toString(), title, when }, ...existing] };
    });

    const next = { ...(data || {}), subjects: nextSubjects, status };
    onSave(next);
    setTitle('');
    setWhen('');
  };

  const toggleStatus = () => {
    const nextStatus = status === 'available' ? 'busy' : 'available';
    setStatus(nextStatus);
    onSave({ ...(data || {}), status: nextStatus, subjects });
  };

  const clearAll = () => {
    Alert.alert('Clear all', 'Remove all subjects and schedules?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => onSave({ ...(data || {}), subjects: [] }) },
    ]);
  };

  const addSubject = () => {
    if (!subjectName) return Alert.alert('Validation', 'Enter subject name');
    const next = { ...(data || {}), subjects: [{ id: Date.now().toString(), name: subjectName.trim(), schedules: [] }, ...(data && data.subjects ? data.subjects : [])], status };
    onSave(next);
    setSubjectName('');
  };

  const deleteSubject = (id) => {
    Alert.alert('Delete subject', 'Remove this subject and its schedules?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const nextSubjects = subjects.filter((s) => s.id !== id);
        onSave({ ...(data || {}), subjects: nextSubjects, status });
        if (selectedSubjectId === id) setSelectedSubjectId(null);
      } }
    ]);
  };

  const deleteSchedule = (scheduleId) => {
    if (!selectedSubjectId) return;
    const nextSubjects = subjects.map((s) => {
      if (s.id !== selectedSubjectId) return s;
      return { ...s, schedules: (s.schedules || []).filter((it) => it.id !== scheduleId) };
    });
    onSave({ ...(data || {}), subjects: nextSubjects, status });
  };

  const acceptRequest = (requestId) => {
    const nextRequests = (data.requests || []).map((r) => r.id === requestId ? { ...r, status: 'accepted' } : r);
    onSave({ ...(data || {}), subjects, status, requests: nextRequests });
  };

  const rejectRequest = (requestId) => {
    const nextRequests = (data.requests || []).map((r) => r.id === requestId ? { ...r, status: 'rejected' } : r);
    onSave({ ...(data || {}), subjects, status, requests: nextRequests });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Faculty Panel" showBack={true} onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.container}>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Status:</Text>
        <TouchableOpacity style={[styles.statusBtn, status === 'available' && styles.statusAvailable]} onPress={toggleStatus}>
          <Text style={{ color: status === 'available' ? 'white' : 'black' }}>{status === 'available' ? 'Available' : 'Busy'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}><Text style={styles.clearBtnText}>Clear All</Text></TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subjects</Text>
        <View style={styles.rowForm}>
          <TextInput placeholder="Add subject name" value={subjectName} onChangeText={setSubjectName} style={[styles.input, { flex: 1 }]} />
          <TouchableOpacity style={styles.smallAddBtn} onPress={addSubject}><Text style={{ color: 'white' }}>Add</Text></TouchableOpacity>
        </View>

        {subjects.length === 0 ? <Text style={{ padding: 12, color: '#555' }}>No subjects yet.</Text> : (
          subjects.map((s) => (
            <TouchableOpacity key={s.id} style={[styles.subjectRow, selectedSubjectId === s.id && styles.subjectSelected]} onPress={() => setSelectedSubjectId(s.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subjectName}>{s.name}</Text>
                <Text style={styles.subjectCount}>{(s.schedules || []).length} schedules</Text>
              </View>
              <TouchableOpacity onPress={() => deleteSubject(s.id)} style={styles.deleteTiny}><Text style={{ color: '#c53030' }}>Del</Text></TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Schedule to Selected Subject</Text>
        <Text style={{ color: '#666', marginBottom: 8 }}>{selectedSubjectId ? 'Selected subject will receive the schedule.' : 'Select a subject above to add schedules.'}</Text>
        <TextInput placeholder="Schedule title (e.g., Office Hours)" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="When / Notes (e.g., Mon 3-5pm or Zoom link)" value={when} onChangeText={setWhen} style={styles.input} />
        <TouchableOpacity style={styles.addBtn} onPress={addSchedule}><Text style={{ color: 'white' }}>Add Schedule</Text></TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scheduled items</Text>
        {selectedSubjectId ? (
          <FlatList data={(subjects.find((s) => s.id === selectedSubjectId) || {}).schedules || []} keyExtractor={(i) => i.id} renderItem={({ item }) => <ScheduleList item={item} onDelete={deleteSchedule} />} ListEmptyComponent={<Text style={{ padding: 16 }}>No schedules for this subject yet.</Text>} />
        ) : (
          <Text style={{ padding: 12, color: '#555' }}>Select a subject to see schedules.</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Requests</Text>
        {(!data.requests || data.requests.length === 0) ? (
          <Text style={{ padding: 12, color: '#666' }}>No consultation requests.</Text>
        ) : (
          (data.requests || []).map((req) => (
            <View key={req.id} style={styles.requestRowItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>{req.fromName}</Text>
                <Text style={{ color: '#666' }}>{req.datetime}</Text>
                {req.message ? <Text style={{ marginTop: 6 }}>{req.message}</Text> : null}
                <Text style={{ marginTop: 6, color: req.status === 'accepted' ? '#2f855a' : req.status === 'rejected' ? '#c53030' : '#b7791f' }}>{req.status}</Text>
              </View>
              {req.status === 'pending' ? (
                <View style={{ marginLeft: 12 }}>
                  <TouchableOpacity onPress={() => acceptRequest(req.id)} style={styles.smallAction}><Text style={{ color: '#2f855a' }}>Accept</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => rejectRequest(req.id)} style={styles.smallAction}><Text style={{ color: '#c53030' }}>Reject</Text></TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))
        )}
      </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'transparent' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  label: { marginRight: 8, fontWeight: '700', color: '#1a202c' },
  statusBtn: { padding: 10, borderRadius: 8, backgroundColor: '#edf2f7', borderWidth: 2, borderColor: '#cbd5e1', minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  statusAvailable: { backgroundColor: '#38a169', borderColor: '#38a169' },
  clearBtn: { marginLeft: 12, padding: 10, borderRadius: 8, backgroundColor: '#fed7d7', borderWidth: 1, borderColor: '#fc8181', minHeight: 44, justifyContent: 'center' },
  form: { marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: 'transparent', fontSize: 15, height: 44 },
  addBtn: { backgroundColor: '#2b6cb0', padding: 14, borderRadius: 8, alignItems: 'center', shadowColor: '#2b6cb0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  sub: { marginTop: 16, marginBottom: 8, fontWeight: '600' },
  section: { marginTop: 14, marginBottom: 10, backgroundColor: 'transparent', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontWeight: '700', marginBottom: 12, fontSize: 16, color: '#1a202c' },
  rowForm: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallAddBtn: { backgroundColor: '#2b6cb0', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  subjectRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  subjectSelected: { backgroundColor: '#ebf8ff' },
  subjectName: { fontWeight: '700', fontSize: 15, color: '#1a202c' },
  subjectCount: { color: '#718096', marginTop: 6, fontSize: 13 },
  deleteTiny: { padding: 8 },
  smallBtnText: { color: '#2b6cb0', fontWeight: '700', fontSize: 14 },
  clearBtnText: { color: '#c53030', fontWeight: '700', fontSize: 14 },
  requestRowItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderTopWidth: 1, borderColor: '#f1f5f9' },
  smallAction: { padding: 10 }
});
