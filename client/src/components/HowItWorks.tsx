import { motion } from "framer-motion";
import { Database, Cpu, LineChart, BellRing } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    icon: Database,
    title: "Data Ingestion",
    desc: "Stream SNMP, NetFlow, gNMI, and RAN counters into a unified time-series lake at carrier scale.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    desc: "Transformer models continuously learn baselines, seasonality, and topology dependencies per region.",
  },
  {
    icon: LineChart,
    title: "Prediction",
    desc: "Forecast congestion, latency drift, and capacity exhaustion across a 4–24 hour horizon.",
  },
  {
    icon: BellRing,
    title: "Alerts & Action",
    desc: "Route correlated incidents to the right team — or trigger automated remediation playbooks.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="// Pipeline"
          title={
            <>
              From raw telemetry to{" "}
              <span className="text-gradient-brand">actionable foresight</span>.
            </>
          }
          description="A four-stage pipeline engineered for sub-second inference and zero data loss."
        />

        <div className="relative mt-20">
          {/* Connecting line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent md:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan/40 bg-background text-cyan border-glow">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-6 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Step 0{i + 1}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
