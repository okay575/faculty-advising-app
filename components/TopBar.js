import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ title, onBack, showBack = false, rightNode = null }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>{title || ''}</Text>
      </View>
      <View style={styles.right}>{rightNode}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  left: { width: 80, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  right: { width: 80, alignItems: 'flex-end' },
  backButton: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#f7fafc', borderRadius: 6 },
  backText: { color: '#2b6cb0', fontWeight: '700', fontSize: 15 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a202c' }
});
