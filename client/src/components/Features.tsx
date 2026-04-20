import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  LayoutDashboard,
  BellRing,
  ShieldCheck,
  Network,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: Activity,
    title: "Real-time Network Monitoring",
    desc: "Stream telemetry from every node — fiber, radio, and core — with sub-second resolution and global visibility.",
    tag: "01 / Telemetry",
  },
  {
    icon: BrainCircuit,
    title: "AI-based Congestion Prediction",
    desc: "Forecast bottlenecks 4–24 hours ahead using transformer models trained on years of operator traffic patterns.",
    tag: "02 / Forecast",
  },
  {
    icon: LayoutDashboard,
    title: "Provider Dashboard & Analytics",
    desc: "A unified control plane for NOC teams — drill from region to cell-site in two clicks, with full historical replay.",
    tag: "03 / Console",
  },
  {
    icon: BellRing,
    title: "Alerts & SLA Tracking",
    desc: "Tiered alert routing with auto-correlation. Track SLA burn-down per customer, region, and service class.",
    tag: "04 / Alerting",
  },
  {
    icon: Network,
    title: "Topology-Aware Correlation",
    desc: "Group thousands of symptoms into a handful of root causes by walking your live network graph.",
    tag: "05 / Graph",
  },
  {
    icon: ShieldCheck,
    title: "Carrier-Grade Security",
    desc: "SOC 2 Type II, ISO 27001, and end-to-end encryption with regional data residency by default.",
    tag: "06 / Trust",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="// Capabilities"
          title={
            <>
              Built for the{" "}
              <span className="text-gradient-brand">network operators</span> of
              the next decade.
            </>
          }
          description="Six pillars that turn raw telemetry into operational foresight — designed alongside Tier-1 carriers."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-card/80 p-7 backdrop-blur transition-colors hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan transition-all group-hover:border-cyan/70 group-hover:shadow-[0_0_24px_-4px_var(--cyan)]">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {f.tag}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
