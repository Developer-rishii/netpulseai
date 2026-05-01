import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SpeedGauge } from '@/components/SpeedGauge';
import { GlassCard } from '@/components/GlassCard';
import { Colors, Spacing, Gradients, BorderRadius } from '@/constants/theme';
import { speedTestAPI } from '@/services/api';

export default function SpeedTestScreen() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'completed' | 'error'>('idle');
  const [speed, setSpeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTest = async () => {
    setStatus('testing');
    setSpeed(null);
    setError(null);
    try {
      const res = await speedTestAPI.run();
      setSpeed(parseFloat(res.data.speed));
      setStatus('completed');
    } catch (err) {
      setError('Unable to connect to speed test servers.');
      setStatus('error');
    }
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={[s.headerBar, { backgroundColor: Colors.neon }]} />
            <View>
              <Text style={s.title}>Speed Test</Text>
              <Text style={s.subtitle}>Measure network throughput</Text>
            </View>
          </View>
        </View>

        {/* Gauge */}
        <View style={s.gaugeWrap}>
          <SpeedGauge speed={speed} status={status} />
        </View>

        {/* Action */}
        {(status === 'idle' || status === 'error') && (
          <TouchableOpacity onPress={startTest} activeOpacity={0.8}>
            <LinearGradient colors={[...Gradients.brand]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.startBtn}>
              <Ionicons name="flash" size={20} color={Colors.background} />
              <Text style={s.startTxt}>START TEST</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {status === 'testing' && (
          <Text style={s.testingMsg}>Communicating with NetPulse edge servers...</Text>
        )}

        {status === 'error' && error && (
          <Text style={s.errorMsg}>{error}</Text>
        )}

        {/* Results */}
        {status === 'completed' && (
          <View style={s.results}>
            <View style={s.resultRow}>
              <GlassCard style={s.resultCard}>
                <Text style={s.resultLabel}>LATENCY</Text>
                <Text style={s.resultValue}>14 <Text style={s.resultUnit}>ms</Text></Text>
              </GlassCard>
              <GlassCard style={s.resultCard}>
                <Text style={s.resultLabel}>JITTER</Text>
                <Text style={s.resultValue}>2 <Text style={s.resultUnit}>ms</Text></Text>
              </GlassCard>
              <GlassCard style={s.resultCard}>
                <Text style={s.resultLabel}>CONSISTENCY</Text>
                <Text style={s.resultValue}>98<Text style={s.resultUnit}>%</Text></Text>
              </GlassCard>
            </View>

            <View style={s.actionRow}>
              <TouchableOpacity onPress={startTest} style={s.retryBtn}>
                <Ionicons name="refresh" size={16} color={Colors.foreground} />
                <Text style={s.retryTxt}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.shareBtn}>
                <Ionicons name="share-social" size={16} color={Colors.cyan} />
                <Text style={s.shareTxt}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  page: { flex: 1, padding: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBar: { width: 3, height: 32, borderRadius: 2 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.foreground, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  gaugeWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: BorderRadius.pill, marginHorizontal: 40 },
  startTxt: { fontFamily: 'SpaceMono', fontSize: 14, fontWeight: '700', letterSpacing: 3, color: Colors.background },
  testingMsg: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.muted, textAlign: 'center', letterSpacing: 0.5, marginTop: 12 },
  errorMsg: { fontSize: 13, color: Colors.critical, textAlign: 'center', marginTop: 12 },
  results: { gap: 16, marginTop: 16 },
  resultRow: { flexDirection: 'row', gap: 10 },
  resultCard: { flex: 1, alignItems: 'center', gap: 4 },
  resultLabel: { fontFamily: 'SpaceMono', fontSize: 8, letterSpacing: 2, color: Colors.muted },
  resultValue: { fontSize: 22, fontWeight: '700', color: Colors.foreground },
  resultUnit: { fontSize: 12, fontWeight: '500', color: Colors.muted },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.border },
  retryTxt: { fontSize: 13, color: Colors.foreground },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.pill, backgroundColor: Colors.cyanDim, borderWidth: 1, borderColor: Colors.borderCyan },
  shareTxt: { fontSize: 13, color: Colors.cyan },
});
