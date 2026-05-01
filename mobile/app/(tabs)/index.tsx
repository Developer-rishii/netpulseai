import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardData } from '@/hooks/useDashboardData';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { LatencyChart, ThroughputChart } from '@/components/Charts';
import { LiveFeedItem } from '@/components/LiveFeedItem';
import { GlassCard } from '@/components/GlassCard';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { metrics, latestMetric, logs, modelStatus, apiStatus, lastPredictionTime } = useDashboardData();
  const [refreshing, setRefreshing] = React.useState(false);

  if (!latestMetric) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.loading}>
          <View style={s.pulseDot} />
          <Text style={s.loadingText}>Waiting for IoT data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.cyan}
          onRefresh={()=>{setRefreshing(true);setTimeout(()=>setRefreshing(false),1000)}} />}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.headerBar} />
            <View>
              <Text style={s.headerTitle}>Network Console</Text>
              <Text style={s.headerSub}>Real-time traffic monitoring</Text>
            </View>
          </View>
          <View style={s.statusRow}>
            <StatusBadge label="API" value={apiStatus} status={apiStatus === 'Online' ? 'online' : 'offline'} />
            <StatusBadge label="Model" value={modelStatus} status={modelStatus === 'Active' ? 'active' : 'idle'} />
          </View>
        </View>

        {/* Metric Cards */}
        <View style={s.metricsGrid}>
          <MetricCard title="Latency" value={latestMetric.latency.toFixed(0)} unit="ms"
            icon="pulse" status={latestMetric.latency > 100 ? 'critical' : latestMetric.latency > 60 ? 'warning' : 'good'}
            glow={latestMetric.latency > 60} />
          <MetricCard title="Active Users" value={latestMetric.active_users}
            icon="people" status={latestMetric.active_users > 80 ? 'critical' : latestMetric.active_users > 50 ? 'warning' : 'good'}
            glow={latestMetric.active_users > 50} />
          <MetricCard title="Throughput" value={latestMetric.throughput.toFixed(1)} unit="Mbps"
            icon="cloud-download" />
          <MetricCard title="Congestion" value={latestMetric.congestionStatus}
            icon="warning" status={latestMetric.congestionStatus === 'High' ? 'critical' : latestMetric.congestionStatus === 'Medium' ? 'warning' : 'good'}
            glow={latestMetric.congestionStatus !== 'Low'} />
        </View>

        {/* Charts */}
        <LatencyChart data={metrics} />
        <ThroughputChart data={metrics} />

        {/* Live Feed */}
        <GlassCard noPadding>
          <View style={s.feedHeader}>
            <Ionicons name="radio" size={16} color={Colors.cyan} />
            <Text style={s.feedTitle}>LIVE ACTIVITY FEED</Text>
          </View>
          <View style={s.feedContent}>
            {logs.slice(-8).reverse().map((log) => (
              <LiveFeedItem key={log.id} log={log.log} timestamp={log.timestamp} />
            ))}
            {logs.length === 0 && <Text style={s.emptyText}>No activity yet...</Text>}
          </View>
        </GlassCard>

        {/* Last prediction */}
        {lastPredictionTime && (
          <Text style={s.lastPred}>Last prediction: {lastPredictionTime}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  pulseDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.cyan, opacity: 0.7 },
  loadingText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.muted, letterSpacing: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBar: { width: 3, height: 32, borderRadius: 2, backgroundColor: Colors.cyan },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.foreground, letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  statusRow: { flexDirection: 'row', gap: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  feedTitle: { fontFamily: 'SpaceMono', fontSize: 10, letterSpacing: 2, color: Colors.muted },
  feedContent: { padding: 16 },
  emptyText: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.muted, textAlign: 'center', padding: 20 },
  lastPred: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.muted, textAlign: 'center', letterSpacing: 1 },
});
