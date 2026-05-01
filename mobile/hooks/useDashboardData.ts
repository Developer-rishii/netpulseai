import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { metricsAPI, BASE_URL } from '@/services/api';

export interface MetricData {
  time: string;
  latency: number;
  throughput: number;
  active_users: number;
  congestion_level: number;
  congestionStatus: 'Low' | 'Medium' | 'High';
}

export interface Alert {
  id: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  log: string;
  timestamp: string;
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [latestMetric, setLatestMetric] = useState<MetricData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [modelStatus, setModelStatus] = useState<'Active' | 'Idle'>('Idle');
  const [apiStatus, setApiStatus] = useState<'Online' | 'Offline'>('Offline');
  const [lastPredictionTime, setLastPredictionTime] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  const processMetric = useCallback((metric: MetricData) => {
    setMetrics((prev) => {
      const updated = [...prev, metric];
      if (updated.length > 30) updated.shift();
      return updated;
    });

    setLatestMetric(metric);
    setLastPredictionTime(metric.time);
    setApiStatus('Online');
    setModelStatus('Active');

    // Generate activity log
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      log: `users=${metric.active_users}, latency=${metric.latency.toFixed(0)}ms, throughput=${metric.throughput.toFixed(1)}Mbps, congestion=${metric.congestionStatus.toUpperCase()}`,
      timestamp: metric.time,
    };
    setLogs((prev) => [...prev.slice(-49), newLog]);

    // Generate alerts based on thresholds
    if (metric.congestionStatus === 'High') {
      const newAlert: Alert = {
        id: Date.now().toString(),
        message: `⚠ High congestion detected (latency: ${metric.latency.toFixed(0)}ms)`,
        type: 'critical',
        timestamp: metric.time,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
    } else if (metric.congestionStatus === 'Medium' && metric.latency > 60) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        message: `📉 Network congestion rising (latency: ${metric.latency.toFixed(0)}ms)`,
        type: 'warning',
        timestamp: metric.time,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
    }
  }, []);

  // 1) Fetch historical data on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await metricsAPI.getRecent(30);
        if (response.data?.data) {
          const history: MetricData[] = response.data.data;
          setMetrics(history);
          if (history.length > 0) {
            const latest = history[history.length - 1];
            setLatestMetric(latest);
            setLastPredictionTime(latest.time);
            setApiStatus('Online');
            setModelStatus('Active');

            setAlerts([
              {
                id: 'init',
                message: 'System initialized. Monitoring active.',
                type: 'info',
                timestamp: new Date().toLocaleTimeString([], {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch historical metrics:', error);
        setApiStatus('Offline');
      }
    };

    fetchHistory();
  }, []);

  // 2) Connect to WebSocket for real-time updates
  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      setApiStatus('Online');
    });

    socket.on('new_metric', (data: MetricData) => {
      console.log('Received new metric via WebSocket:', data);
      processMetric(data);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setApiStatus('Offline');
      setModelStatus('Idle');
    });

    return () => {
      socket.disconnect();
    };
  }, [processMetric]);

  return {
    metrics,
    latestMetric,
    alerts,
    logs,
    modelStatus,
    apiStatus,
    lastPredictionTime,
  };
}
