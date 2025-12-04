import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ScheduleList({ item, onDelete }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.when}>{item.when}</Text>
      </View>
      {onDelete ? (
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: 14, borderBottomWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  title: { fontWeight: '700', fontSize: 15, color: '#1a202c' },
  when: { color: '#718096', marginTop: 6, fontSize: 14 },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fed7d7', borderRadius: 8, borderWidth: 1, borderColor: '#fc8181' },
  deleteText: { color: '#c53030', fontWeight: '700', fontSize: 13 },
});
