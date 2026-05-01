import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface LiveFeedItemProps {
  log: string;
  timestamp: string;
}

export function LiveFeedItem({ log, timestamp }: LiveFeedItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dotCol}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <Text style={styles.log} numberOfLines={2}>{log}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  dotCol: {
    alignItems: 'center',
    width: 12,
    paddingTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    gap: 2,
    paddingBottom: Spacing.sm,
  },
  timestamp: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    color: Colors.cyan,
    letterSpacing: 1,
  },
  log: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.mutedForeground,
    lineHeight: 16,
  },
});
