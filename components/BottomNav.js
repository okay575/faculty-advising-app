import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BottomNav({ currentScreen, onNavigate, userRole, onSignOut, backgroundColor }) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.btn} onPress={() => onNavigate('dashboard')}>
        <Text style={[styles.icon, currentScreen === 'dashboard' && styles.active]}>🏠</Text>
        <Text style={[styles.label, currentScreen === 'dashboard' && styles.active]}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => onNavigate('notifications')}>
        <Text style={[styles.icon, currentScreen === 'notifications' && styles.active]}>🔔</Text>
        <Text style={[styles.label, currentScreen === 'notifications' && styles.active]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => onNavigate('account')}>
        <Text style={[styles.icon, currentScreen === 'account' && styles.active]}>👤</Text>
        <Text style={[styles.label, currentScreen === 'account' && styles.active]}>Account</Text>
      </TouchableOpacity>
      {/* People & Courses replaced by Notifications; icons added */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  icon: { color: '#000000', fontSize: 20 },
  label: { color: '#718096', fontSize: 12, fontWeight: '600' },
  active: { color: '#2b6cb0', fontWeight: '700', fontSize: 13 }
});
