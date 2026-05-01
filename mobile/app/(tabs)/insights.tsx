import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function InsightsScreen() {
  const { modelStatus, latestMetric, lastPredictionTime } = useDashboardData();

  const InsightCard = ({ title, description, icon, color }: any) => (
    <BlurView intensity={10} tint="dark" style={s.card}>
      <View style={[s.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={s.cardContent}>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardDesc}>{description}</Text>
      </View>
    </BlurView>
  );

  return (
    <View style={s.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={s.header}>
            <Text style={s.eyebrow}>// NEURAL ENGINE</Text>
            <Text style={s.title}>AI Network Insights</Text>
          </View>

          {/* Engine Status */}
          <BlurView intensity={20} tint="dark" style={s.statusCard}>
            <View style={s.statusRow}>
              <View style={s.statusInfo}>
                <Text style={s.statusLabel}>MODEL STATUS</Text>
                <View style={s.statusBadge}>
                  <View style={[s.dot, { backgroundColor: modelStatus === 'Active' ? Colors.good : Colors.warning }]} />
                  <Text style={[s.statusValue, { color: modelStatus === 'Active' ? Colors.good : Colors.warning }]}>
                    {modelStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={s.statusDivider} />
              <View style={s.statusInfo}>
                <Text style={s.statusLabel}>LAST PREDICTION</Text>
                <Text style={s.statusTime}>{lastPredictionTime || '--:--:--'}</Text>
              </View>
            </View>
          </BlurView>

          <Text style={s.sectionTitle}>PREDICTIVE ANALYSIS</Text>

          <InsightCard 
            title="Traffic Surge Prediction"
            description="Anticipated 15% increase in active users over the next 30 minutes based on historical Friday patterns."
            icon="trending-up-outline"
            color={Colors.cyan}
          />

          <InsightCard 
            title="Latency Optimization"
            description="Model suggests re-routing traffic through Node-7 to reduce current latency by approx. 8ms."
            icon="speedometer-outline"
            color={Colors.neon}
          />

          <InsightCard 
            title="Anomaly Detection"
            description="No significant behavioral anomalies detected in the last 24-hour cycle. System stability is nominal."
            icon="shield-checkmark-outline"
            color={Colors.good}
          />

          <InsightCard 
            title="Congestion Warning"
            description="Probability of 'High Congestion' status is currently 12% for the next observation window."
            icon="alert-circle-outline"
            color={Colors.warning}
          />

          <View style={s.footer}>
            <Ionicons name="sparkles" size={16} color={Colors.muted} />
            <Text style={s.footerText}>Powered by NetPulse AI Neural Engine v2.0</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  eyebrow: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.cyan,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  statusCard: {
    backgroundColor: Colors.surface + '30',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderCyan,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    color: Colors.muted,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  statusTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
    fontFamily: 'SpaceMono',
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.muted,
    marginBottom: Spacing.lg,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.card + '50',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    opacity: 0.5,
  },
  footerText: {
    fontSize: 11,
    color: Colors.muted,
    fontFamily: 'SpaceMono',
  },
});
