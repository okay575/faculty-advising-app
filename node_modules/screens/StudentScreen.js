import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleList from '../components/ScheduleList';
import TopBar from '../components/TopBar';

export default function StudentScreen({ users = [], facultyData = null, onSelectFaculty, onBack, studentEnrollments = {}, onUpdateEnrollments }) {
  const facultyUsers = (users || []).filter((u) => u.role === 'faculty');
  const [enrollmentUI, setEnrollmentUI] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');

  const addEnrollment = () => {
    if (!subjectName.trim() || !facultyEmail.trim()) {
      return Alert.alert('Validation', 'Enter both subject name and faculty email');
    }
    const newEnrollment = {
      id: Date.now().toString(),
      subject: subjectName.trim(),
      facultyEmail: facultyEmail.trim(),
      enrolledAt: new Date().toISOString()
    };
    const updated = { ...(studentEnrollments || {}), [newEnrollment.id]: newEnrollment };
    if (onUpdateEnrollments) onUpdateEnrollments(updated);
    setSubjectName('');
    setFacultyEmail('');
    setEnrollmentUI(false);
  };

  const removeEnrollment = (id) => {
    Alert.alert('Remove Course', 'Unenroll from this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unenroll',
        style: 'destructive',
        onPress: () => {
          const updated = { ...(studentEnrollments || {}) };
          delete updated[id];
          if (onUpdateEnrollments) onUpdateEnrollments(updated);
        }
      }
    ]);
  };

  // Browse Faculty section
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Browse Faculty" showBack={true} onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.container}>
          {/* Browse Faculty Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse Faculty</Text>
              <Text style={styles.sectionSub}>Select a faculty to request consultation</Text>
              {facultyUsers.length === 0 ? (
                <Text style={styles.empty}>No faculty available.</Text>
              ) : (
                facultyUsers.map((faculty) => (
                  <TouchableOpacity key={faculty.id} style={styles.facultyCard} onPress={() => onSelectFaculty(faculty.id)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.facultyName}>{faculty.name}</Text>
                      <Text style={styles.facultyEmail}>{faculty.email}</Text>
                    </View>
                    <Text style={styles.browseBtn}>View ›</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* My Enrolled Courses Section */}
            <View style={styles.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>My Courses</Text>
                <TouchableOpacity onPress={() => setEnrollmentUI(!enrollmentUI)} style={styles.addCourseBtn}>
                  <Text style={styles.addCourseBtnText}>{enrollmentUI ? '✕' : '+ Add'}</Text>
                </TouchableOpacity>
              </View>

              {enrollmentUI && (
                <View style={styles.enrollmentForm}>
                  <TextInput
                    placeholder="Course Subject (e.g., Introduction to React)"
                    value={subjectName}
                    onChangeText={setSubjectName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Instructor Email"
                    value={facultyEmail}
                    onChangeText={setFacultyEmail}
                    style={styles.input}
                  />
                  <TouchableOpacity style={styles.submitBtn} onPress={addEnrollment}>
                    <Text style={styles.submitBtnText}>Enroll</Text>
                  </TouchableOpacity>
                </View>
              )}

              {Object.keys(studentEnrollments || {}).length === 0 ? (
                <Text style={styles.empty}>No courses enrolled yet. Tap "+ Add" to get started.</Text>
              ) : (
                Object.entries(studentEnrollments || {}).map(([id, enrollment]) => (
                  <View key={id} style={styles.enrollmentCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.enrollmentSubject}>{enrollment.subject}</Text>
                      <Text style={styles.enrollmentFaculty}>Instructor: {enrollment.facultyEmail}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeEnrollment(id)} style={styles.removeBtn}>
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Selected Faculty View */}
            {facultyData && (
              <View style={styles.section}>
                <TouchableOpacity onPress={() => onSelectFaculty(null)} style={styles.backToFacultyBtn}>
                  <Text style={styles.backToFacultyBtnText}>‹ Back to Faculty List</Text>
                </TouchableOpacity>
                <View style={styles.statusBox}>
                  <Text style={styles.statusLabel}>Faculty status:</Text>
                  <Text style={[styles.statusText, (facultyData && facultyData.status) === 'available' ? styles.available : styles.busy]}>
                    {(facultyData && facultyData.status) === 'available' ? 'Available for consultation' : 'Currently busy'}
                  </Text>
                </View>
                <Text style={styles.sectionTitle}>Schedules</Text>
                {((facultyData && facultyData.subjects) || []).length === 0 ? (
                  <Text style={styles.empty}>No schedules published yet.</Text>
                ) : (
                  ((facultyData && facultyData.subjects) || []).map((sub) => (
                    <View key={sub.id} style={styles.subjectBlock}>
                      <Text style={styles.subjectHeader}>{sub.name}</Text>
                      {(sub.schedules || []).length === 0 ? (
                        <Text style={{ paddingLeft: 12, color: '#666' }}>No schedules</Text>
                      ) : (
                        sub.schedules.map((it) => <ScheduleList key={it.id} item={it} />)
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'transparent' },
  section: { marginBottom: 18, backgroundColor: 'transparent', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a202c', marginBottom: 8 },
  sectionSub: { fontSize: 14, color: '#718096', marginBottom: 12 },
  empty: { padding: 12, color: '#a0aec0', fontSize: 14 },
  facultyCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: 'transparent' },
  facultyName: { fontWeight: '700', fontSize: 15, color: '#1a202c' },
  facultyEmail: { color: '#718096', fontSize: 13, marginTop: 4 },
  browseBtn: { color: '#2b6cb0', fontWeight: '700', fontSize: 14 },
  addCourseBtn: { backgroundColor: '#2b6cb0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addCourseBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
  enrollmentForm: { padding: 12, backgroundColor: '#f7fafc', borderRadius: 8, marginBottom: 14, borderWidth: 1, borderColor: '#cbd5e1' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: 'transparent', fontSize: 14, height: 44 },
  submitBtn: { backgroundColor: '#2b6cb0', padding: 12, borderRadius: 8, alignItems: 'center', shadowColor: '#2b6cb0', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  enrollmentCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: 'transparent' },
  enrollmentSubject: { fontWeight: '700', fontSize: 15, color: '#1a202c' },
  enrollmentFaculty: { color: '#718096', fontSize: 13, marginTop: 4 },
  removeBtn: { backgroundColor: '#fed7d7', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#fc8181' },
  removeBtnText: { color: '#c53030', fontWeight: '700', fontSize: 12 },
  backToFacultyBtn: { marginBottom: 14, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#edf2f7', borderRadius: 8 },
  backToFacultyBtnText: { color: '#2b6cb0', fontWeight: '700', fontSize: 14 },
  statusBox: { marginBottom: 14, padding: 12, borderRadius: 10, backgroundColor: '#f0f7ff', borderLeftWidth: 4, borderLeftColor: '#2b6cb0' },
  statusLabel: { fontWeight: '700', marginBottom: 6, color: '#1a202c', fontSize: 14 },
  statusText: { fontWeight: '700', fontSize: 15 },
  available: { color: '#2f855a' },
  busy: { color: '#c53030' },
  subjectBlock: { marginBottom: 12, borderRadius: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  subjectHeader: { backgroundColor: 'transparent', padding: 12, fontWeight: '700', fontSize: 14, borderBottomWidth: 1, borderColor: '#e2e8f0', color: '#1a202c' },
});
