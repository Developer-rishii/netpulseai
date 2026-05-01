import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  noPadding?: boolean;
}

export function GlassCard({ children, style, glowColor, noPadding }: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        glowColor && {
          shadowColor: glowColor,
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          borderColor: glowColor + '30',
        },
        noPadding && { padding: 0 },
        style,
      ]}
    >
      {/* Top accent line */}
      <LinearGradient
        colors={['transparent', Colors.cyan + '40', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topLine}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
