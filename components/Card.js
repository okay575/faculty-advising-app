import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function Card({ title, subtitle, onPress, accent, style }) {
  return (
    <TouchableOpacity style={[styles.card, accent ? { borderLeftColor: accent, borderLeftWidth: 6 } : null, style]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6
  },
  title: { fontWeight: '700', fontSize: 17, color: '#1a202c' },
  subtitle: { color: '#718096', marginTop: 6, fontSize: 14 },
});
