import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AlertItem } from '@/components/AlertItem';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsScreen() {
  const { alerts } = useDashboardData();

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={[s.headerBar, { backgroundColor: Colors.warning }]} />
            <View>
              <Text style={s.title}>Alert Center</Text>
              <Text style={s.subtitle}>Threshold-based network alerts</Text>
            </View>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeText}>{alerts.length}</Text>
          </View>
        </View>

        {/* Alert list */}
        {alerts.length > 0 ? (
          alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
        ) : (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.good} />
            </View>
            <Text style={s.emptyTitle}>All Clear</Text>
            <Text style={s.emptyText}>No active alerts. Network is operating normally.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBar: { width: 3, height: 32, borderRadius: 2 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.foreground, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  badge: { backgroundColor: Colors.warningDim, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: Colors.warning + '30' },
  badgeText: { fontFamily: 'SpaceMono', fontSize: 12, fontWeight: '700', color: Colors.warning },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.goodDim, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground },
  emptyText: { fontSize: 13, color: Colors.muted, textAlign: 'center' },
});
