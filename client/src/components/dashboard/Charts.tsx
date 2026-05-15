import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { MetricData } from "../../hooks/useDashboardData";

interface ChartsProps {
  data: MetricData[];
}

export function LatencyChart({ data }: ChartsProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl h-[300px] flex flex-col">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Latency Trend (ms)
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cyan)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-cyan)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "var(--color-cyan)" }}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="var(--color-cyan)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLatency)"
              isAnimationActive={false} // Disable to avoid jumping on frequent updates
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ThroughputLatencyChart({ data }: ChartsProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl h-[300px] flex flex-col">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Throughput vs Latency
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--color-violet)" fontSize={10} tickMargin={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="throughput"
              stroke="var(--color-violet)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke="var(--color-cyan)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ActiveUsersChart({ data }: ChartsProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl h-[300px] flex flex-col">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Active Users Trend
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#3b82f6" }}
            />
            <Area
              type="monotone"
              dataKey="active_users"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CongestionHistoryChart({ data }: ChartsProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl h-[300px] flex flex-col">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Congestion History
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickMargin={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
              cursor={{ fill: 'var(--color-white)', opacity: 0.05 }}
            />
            <Bar dataKey="congestion_level" isAnimationActive={false} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                let color = "var(--color-cyan)"; // Low
                if (entry.congestionStatus === "Medium") color = "var(--color-warning)"; // Medium
                if (entry.congestionStatus === "High") color = "var(--color-destructive)"; // High
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
