import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Colors, Spacing, Typography } from '@/constants/theme';

type StatusType = 'good' | 'warning' | 'critical';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  status?: StatusType;
  glow?: boolean;
}

const statusColors: Record<StatusType, string> = {
  good: Colors.cyan,
  warning: Colors.warning,
  critical: Colors.critical,
};

const statusBgColors: Record<StatusType, string> = {
  good: Colors.cyanDim,
  warning: Colors.warningDim,
  critical: Colors.criticalDim,
};

export function MetricCard({ title, value, unit, icon, status = 'good', glow = false }: MetricCardProps) {
  const color = statusColors[status];
  const bgColor = statusBgColors[status];

  return (
    <GlassCard
      style={styles.card}
      glowColor={glow ? color : undefined}
    >
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{title}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, glow && { color }]}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>

      {/* Decorative corner gradient */}
      <View style={[styles.cornerGlow, { backgroundColor: color + '10' }]} />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    ...Typography.label,
    fontSize: 9,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -1,
  },
  unit: {
    ...Typography.metricUnit,
    fontSize: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  cornerGlow: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
