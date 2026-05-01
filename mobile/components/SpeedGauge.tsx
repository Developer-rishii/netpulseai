import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Svg, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, Spacing } from '@/constants/theme';

interface SpeedGaugeProps {
  speed: number | null;
  status: 'idle' | 'testing' | 'completed' | 'error';
}

const SIZE = 220;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function SpeedGauge({ speed, status }: SpeedGaugeProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'testing') {
      // Spin animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }

    if (status === 'completed' && speed !== null) {
      // Animate the progress ring
      const maxSpeed = 200;
      const progress = Math.min(speed / maxSpeed, 1);
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(0);
    }
  }, [status, speed]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      {/* Background ring */}
      <Animated.View style={{ transform: status === 'testing' ? [{ rotate: rotation }] : [] }}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <SvgGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={Colors.cyan} />
              <Stop offset="1" stopColor={Colors.violet} />
            </SvgGradient>
          </Defs>

          {/* Track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={Colors.border}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Progress (only when completed) */}
          {status === 'completed' && (
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="url(#gaugeGrad)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}
            />
          )}

          {/* Dashed ring while testing */}
          {status === 'testing' && (
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={Colors.cyan}
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 12"
              opacity={0.4}
            />
          )}
        </Svg>
      </Animated.View>

      {/* Center content */}
      <View style={styles.center}>
        {status === 'idle' && (
          <>
            <Text style={styles.idleText}>TAP TO</Text>
            <Text style={[styles.idleText, { color: Colors.cyan, fontSize: 16, fontWeight: '700' }]}>START</Text>
          </>
        )}
        {status === 'testing' && (
          <>
            <Text style={styles.testingText}>...</Text>
            <Text style={styles.testingLabel}>TESTING</Text>
          </>
        )}
        {status === 'completed' && speed !== null && (
          <>
            <Text style={styles.speedValue}>{speed.toFixed(1)}</Text>
            <Text style={styles.speedUnit}>Mbps</Text>
          </>
        )}
        {status === 'error' && (
          <>
            <Text style={styles.errorIcon}>!</Text>
            <Text style={styles.errorText}>ERROR</Text>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idleText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.muted,
  },
  testingText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 4,
  },
  testingLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 4,
    color: Colors.muted,
    marginTop: 4,
  },
  speedValue: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -2,
  },
  speedUnit: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    letterSpacing: 4,
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  errorIcon: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.critical,
  },
  errorText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.critical,
    marginTop: 4,
  },
});
