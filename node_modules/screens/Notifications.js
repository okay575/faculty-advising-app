import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';

export default function Notifications({ currentUser, users, facultyData }) {
  // Simple notifications view: show consultation requests for faculty users
  if (!currentUser) return null;

  if (currentUser.role === 'faculty') {
    const requests = (facultyData && facultyData.requests) || [];
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TopBar title="Notifications" showBack={false} />
        <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
          <View style={styles.container}>
            {requests.length === 0 ? (
              <Text style={styles.empty}>No consultation requests</Text>
            ) : (
              requests.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.fromName} — {item.datetime}</Text>
                  <Text style={styles.cardBody}>{item.message}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For students, notifications are empty as they haven't received approvals from faculty yet
  const studentRequests = [];
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Notifications" showBack={false} />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.container}>
          {studentRequests.length === 0 ? (
            <Text style={styles.empty}>No notifications yet</Text>
          ) : (
            studentRequests.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.facultyName} — {item.datetime}</Text>
                <Text style={styles.cardBody}>{item.message}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  empty: { color: '#718096' },
  card: { padding: 12, borderRadius: 8, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  cardTitle: { fontWeight: '700' },
  cardBody: { color: '#4a5568', marginTop: 6 },
  status: { marginTop: 8, color: '#2b6cb0', fontWeight: '700' }
});
