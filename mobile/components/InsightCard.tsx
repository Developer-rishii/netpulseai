import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface InsightCardProps {
  text: string;
  type: 'prediction' | 'recommendation' | 'observation';
}

const typeConfig = {
  prediction: {
    color: Colors.cyan,
    icon: 'trending-up' as const,
    label: 'PREDICTION',
  },
  recommendation: {
    color: Colors.violet,
    icon: 'bulb' as const,
    label: 'RECOMMENDATION',
  },
  observation: {
    color: Colors.good,
    icon: 'eye' as const,
    label: 'OBSERVATION',
  },
};

export function InsightCard({ text, type }: InsightCardProps) {
  const config = typeConfig[type];

  return (
    <View style={[styles.container, { borderColor: config.color + '20' }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '15' }]}>
          <Ionicons name={config.icon} size={16} color={config.color} />
        </View>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },
});
