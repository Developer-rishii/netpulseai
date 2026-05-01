import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { MetricData } from '@/hooks/useDashboardData';

const screenWidth = Dimensions.get('window').width;

interface ChartProps {
  data: MetricData[];
}

const chartConfig = {
  backgroundGradientFrom: Colors.card,
  backgroundGradientTo: Colors.card,
  color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`,
  labelColor: () => Colors.muted,
  strokeWidth: 2,
  propsForBackgroundLines: {
    strokeDasharray: '4 4',
    stroke: Colors.border,
    strokeWidth: 1,
  },
  propsForLabels: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
  },
  decimalPlaces: 0,
  useShadowColorFromDataset: false,
};

export function LatencyChart({ data }: ChartProps) {
  if (data.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Waiting for data...</Text>
      </View>
    );
  }

  const labels = data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map(d => d.time.slice(0, 5));
  const values = data.map(d => d.latency);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>LATENCY TREND (MS)</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values, color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`, strokeWidth: 2 }],
        }}
        width={screenWidth - 48}
        height={180}
        chartConfig={{
          ...chartConfig,
          fillShadowGradientFrom: Colors.cyan,
          fillShadowGradientFromOpacity: 0.2,
          fillShadowGradientTo: Colors.card,
          fillShadowGradientToOpacity: 0,
        }}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        fromZero
      />
    </View>
  );
}

export function ThroughputChart({ data }: ChartProps) {
  if (data.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Waiting for data...</Text>
      </View>
    );
  }

  const labels = data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map(d => d.time.slice(0, 5));
  const throughputValues = data.map(d => d.throughput);
  const latencyValues = data.map(d => d.latency);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>THROUGHPUT VS LATENCY</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.violet }]} />
          <Text style={styles.legendText}>Throughput</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.cyan }]} />
          <Text style={styles.legendText}>Latency</Text>
        </View>
      </View>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: throughputValues, color: (opacity = 1) => `rgba(156, 92, 255, ${opacity})`, strokeWidth: 2 },
            { data: latencyValues, color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`, strokeWidth: 2 },
          ],
        }}
        width={screenWidth - 48}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.muted,
  },
  chart: {
    borderRadius: BorderRadius.md,
    marginLeft: -16,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    color: Colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.muted,
    letterSpacing: 1,
  },
});
