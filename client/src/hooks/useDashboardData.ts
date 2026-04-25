import { useState, useEffect } from "react";
import axios from "axios";

export interface MetricData {
  time: string;
  latency: number;
  packetLoss: number;
  rssi: number;
  throughput: number;
  congestionStatus: "Low" | "Medium" | "High";
}

export interface Alert {
  id: string;
  message: string;
  type: "critical" | "warning" | "info";
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
  const [modelStatus, setModelStatus] = useState<"Active" | "Idle">("Active");
  const [apiStatus, setApiStatus] = useState<"Online" | "Offline">("Online");
  const [lastPredictionTime, setLastPredictionTime] = useState<string>("");

  // Helper to get random value within a range
  const randomValue = (min: number, max: number) => Math.random() * (max - min) + min;

  useEffect(() => {
    // Initial mock data
    const initialData: MetricData[] = Array.from({ length: 20 }).map((_, i) => {
      const now = new Date();
      now.setSeconds(now.getSeconds() - (20 - i) * 2);
      return {
        time: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        latency: randomValue(10, 50),
        packetLoss: randomValue(0, 0.5),
        rssi: randomValue(-70, -40),
        throughput: randomValue(800, 1200),
        congestionStatus: "Low",
      };
    });
    setMetrics(initialData);
    setLatestMetric(initialData[initialData.length - 1]);
    
    setAlerts([
      { id: "1", message: "System initialized. Monitoring active.", type: "info", timestamp: new Date().toLocaleTimeString() }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Here we would ideally fetch from the real endpoints:
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/metrics`);
        // const prediction = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, data);
        
        // Simulating the API response for real-time behavior
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Add some jitter to make it look real
        const baseLatency = 40 + Math.sin(now.getTime() / 10000) * 80; // simulates wave of latency
        const currentLatency = Math.max(5, baseLatency + randomValue(-10, 10));
        
        const currentPacketLoss = currentLatency > 100 ? randomValue(1, 5) : randomValue(0, 0.2);
        const currentRssi = randomValue(-85, -45);
        const currentThroughput = currentLatency > 100 ? randomValue(200, 600) : randomValue(900, 1500);
        
        let status: "Low" | "Medium" | "High" = "Low";
        if (currentLatency > 100 || currentPacketLoss > 2) status = "High";
        else if (currentLatency > 60 || currentPacketLoss > 0.5) status = "Medium";

        const newDataPoint: MetricData = {
          time: timeStr,
          latency: Number(currentLatency.toFixed(2)),
          packetLoss: Number(currentPacketLoss.toFixed(2)),
          rssi: Number(currentRssi.toFixed(2)),
          throughput: Number(currentThroughput.toFixed(2)),
          congestionStatus: status,
        };

        setMetrics(prev => {
          const updated = [...prev, newDataPoint];
          if (updated.length > 30) updated.shift(); // Keep last 30 data points
          return updated;
        });
        
        setLatestMetric(newDataPoint);
        setLastPredictionTime(timeStr);
        setApiStatus("Online");
        setModelStatus("Active");

        // Generate logs
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          log: `latency=${newDataPoint.latency.toFixed(0)}ms, pkt_loss=${newDataPoint.packetLoss.toFixed(2)}%, congestion=${status.toUpperCase()}`,
          timestamp: timeStr,
        };
        setLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50 logs

        // Generate alerts if needed
        if (status === "High" && Math.random() > 0.7) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            message: `⚠ High latency spike detected (${newDataPoint.latency.toFixed(0)}ms)`,
            type: "critical",
            timestamp: timeStr,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        } else if (status === "Medium" && Math.random() > 0.8) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            message: `📉 Network congestion rising`,
            type: "warning",
            timestamp: timeStr,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setApiStatus("Offline");
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, latestMetric, alerts, logs, modelStatus, apiStatus, lastPredictionTime };
}
