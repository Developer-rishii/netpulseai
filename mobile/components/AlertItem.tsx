import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { Alert } from '@/hooks/useDashboardData';

interface AlertItemProps {
  alert: Alert;
}

const typeConfig = {
  critical: {
    color: Colors.critical,
    bg: Colors.criticalDim,
    icon: 'alert-circle' as const,
  },
  warning: {
    color: Colors.warning,
    bg: Colors.warningDim,
    icon: 'warning' as const,
  },
  info: {
    color: Colors.cyan,
    bg: Colors.cyanDim,
    icon: 'information-circle' as const,
  },
};

export function AlertItem({ alert }: AlertItemProps) {
  const config = typeConfig[alert.type];

  return (
    <View style={[styles.container, { borderLeftColor: config.color }]}>
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>
        <Text style={styles.timestamp}>{alert.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontSize: 13,
    color: Colors.foreground,
    lineHeight: 18,
  },
  timestamp: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 0.5,
  },
});
