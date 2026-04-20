import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight, Cpu, Gauge, Radio, Wifi } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const traffic = Array.from({ length: 24 }, (_, i) => ({
  h: `${i.toString().padStart(2, "0")}:00`,
  load: 40 + Math.sin(i / 2) * 20 + Math.random() * 10,
  predicted: 50 + Math.sin(i / 2 + 0.5) * 25 + Math.random() * 5,
}));

const latency = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  ms: 18 + Math.cos(i / 3) * 6 + Math.random() * 3,
}));

// 8x14 heatmap
const heat = Array.from({ length: 8 }, () =>
  Array.from({ length: 14 }, () => Math.random()),
);

function heatColor(v: number) {
  // cyan → violet → red
  if (v < 0.4) return `oklch(0.65 0.15 200 / ${0.25 + v * 0.6})`;
  if (v < 0.75) return `oklch(0.6 0.22 295 / ${0.4 + v * 0.5})`;
  return `oklch(0.65 0.24 25 / ${0.5 + v * 0.5})`;
}

const kpis = [
  { icon: Gauge, label: "Avg Load", value: "62.4%", trend: "+2.1%" },
  { icon: Wifi, label: "Active Cells", value: "11,457", trend: "+12" },
  { icon: Radio, label: "Latency p95", value: "21 ms", trend: "-1.8%" },
  { icon: Cpu, label: "AI Confidence", value: "97.3%", trend: "+0.4%" },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="// Console"
          title={
            <>
              Your network,{" "}
              <span className="text-gradient-brand">one screen</span>.
            </>
          }
          description="A NOC-grade dashboard your engineers will actually open. Live demo data shown below."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 overflow-hidden rounded-xl border border-border glass-panel"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
              <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                netpulse://noc/global-overview
              </span>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-cyan md:inline">
              ● Live · UTC 14:22
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-px bg-border/60 md:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="bg-card/70 p-4">
                <div className="flex items-center justify-between text-muted-foreground">
                  <k.icon className="h-4 w-4 text-cyan" />
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-cyan">
                    <ArrowUpRight className="h-3 w-3" />
                    {k.trend}
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold">{k.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts grid */}
          <div className="grid gap-px bg-border/60 lg:grid-cols-3">
            {/* Traffic load */}
            <div className="bg-card/70 p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Traffic Load · 24h</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    actual vs ai-predicted
                  </div>
                </div>
                <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="h-2 w-2 rounded-full bg-cyan" /> Actual
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-violet" /> Predicted
                  </span>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer>
                  <AreaChart data={traffic}>
                    <defs>
                      <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.86 0.17 200)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.86 0.17 200)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gViolet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.24 295)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.65 0.24 295)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.5 0.05 240 / 15%)" vertical={false} />
                    <XAxis dataKey="h" stroke="oklch(0.7 0.02 250)" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                    <YAxis stroke="oklch(0.7 0.02 250)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.03 252)",
                        border: "1px solid oklch(0.86 0.17 200 / 30%)",
                        borderRadius: 6,
                        fontSize: 11,
                      }}
                      labelStyle={{ color: "oklch(0.86 0.17 200)" }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="oklch(0.65 0.24 295)" fill="url(#gViolet)" strokeWidth={1.5} strokeDasharray="4 3" />
                    <Area type="monotone" dataKey="load" stroke="oklch(0.86 0.17 200)" fill="url(#gCyan)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latency */}
            <div className="bg-card/70 p-5">
              <div className="mb-4">
                <div className="text-sm font-semibold">Latency p95</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  edge → core · ms
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer>
                  <LineChart data={latency}>
                    <CartesianGrid stroke="oklch(0.5 0.05 240 / 15%)" vertical={false} />
                    <XAxis dataKey="t" hide />
                    <YAxis stroke="oklch(0.7 0.02 250)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.03 252)",
                        border: "1px solid oklch(0.86 0.17 200 / 30%)",
                        borderRadius: 6,
                        fontSize: 11,
                      }}
                    />
                    <Line type="monotone" dataKey="ms" stroke="oklch(0.92 0.20 180)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-card/70 p-5 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Congestion Heatmap</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    region × hour · risk score
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  low
                  <div className="flex h-2 w-32 overflow-hidden rounded">
                    <div className="flex-1" style={{ background: "oklch(0.65 0.15 200 / 0.5)" }} />
                    <div className="flex-1" style={{ background: "oklch(0.6 0.22 295 / 0.7)" }} />
                    <div className="flex-1" style={{ background: "oklch(0.65 0.24 25 / 0.9)" }} />
                  </div>
                  high
                </div>
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0,1fr))" }}>
                {heat.flatMap((row, ri) =>
                  row.map((v, ci) => (
                    <div
                      key={`${ri}-${ci}`}
                      className="aspect-square rounded-[3px] transition-transform hover:scale-110"
                      style={{ background: heatColor(v) }}
                      title={`Region ${ri + 1} · h${ci}: ${(v * 100).toFixed(0)}%`}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
