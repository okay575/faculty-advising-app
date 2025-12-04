import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleList from '../components/ScheduleList';
import TopBar from '../components/TopBar';

export default function CourseScreen({ course, onBack }) {
  const schedules = (course && course.schedules) || [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title={course ? course.name : 'Course'} showBack={true} onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedules</Text>
          {schedules.length === 0 ? <Text style={styles.empty}>No schedules yet.</Text> : (
            schedules.map((item) => <ScheduleList key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: { padding: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 12, fontSize: 16, color: '#1a202c' },
  empty: { color: '#a0aec0', fontSize: 14 },
});
