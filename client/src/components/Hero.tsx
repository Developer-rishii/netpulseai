import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import { NetworkGrid } from "./NetworkGrid";

const stats = [
  { label: "Throughput", value: "910 Gbps", sub: "aggregate" },
  { label: "SLA", value: "99.46%", sub: "last 24h" },
  { label: "Predictions", value: "4", sub: "24h forward" },
  { label: "Operators", value: "38", sub: "deployed" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background */}
      <div className="absolute inset-0 grid-bg radial-fade opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 radial-fade">
        <NetworkGrid />
      </div>
      <div
        className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-violet/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
            Live · Monitoring 11,457 nodes globally
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Predict network <span className="italic text-gradient-brand">congestion</span>{" "}
          <br className="hidden md:block" />
          before it happens.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          NetPulse AI is the predictive intelligence layer for modern telecom operators — real-time
          monitoring, AI-forecasted congestion, and SLA-grade alerting across your entire fiber,
          radio, and core network.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded bg-cyan px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-[0_0_40px_-5px_var(--cyan)]"
          >
            Request Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded border border-border bg-card/40 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur transition-colors hover:border-cyan/60"
          >
            <Radio className="h-4 w-4 text-cyan" />
            Register as Provider
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border/60 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-card/80 p-5 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{s.value}</div>
              <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
