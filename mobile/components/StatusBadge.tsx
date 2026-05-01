import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface StatusBadgeProps {
  label: string;
  value: string;
  status: 'online' | 'offline' | 'active' | 'idle';
}

const statusConfig = {
  online: { color: Colors.good, bg: Colors.goodDim },
  offline: { color: Colors.critical, bg: Colors.criticalDim },
  active: { color: Colors.cyan, bg: Colors.cyanDim },
  idle: { color: Colors.muted, bg: Colors.border },
};

export function StatusBadge({ label, value, status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color + '30' }]}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.value, { color: config.color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  value: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
