import { motion } from "framer-motion";

const stats = [
  { value: "11,457", label: "Nodes monitored" },
  { value: "910 Gbps", label: "Aggregate throughput" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "38", label: "Operators deployed" },
];

const logos = [
  "TELCOM ONE",
  "FIBERNET",
  "RADIO+",
  "MERIDIAN",
  "OMNICAST",
  "ARCWAVE",
];

export function Trust() {
  return (
    <section className="relative border-y border-border bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border/60 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-background p-7 text-center"
            >
              <div className="text-3xl font-semibold tracking-tight text-gradient-brand md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            // Trusted by network operators worldwide
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {logos.map((l) => (
              <span
                key={l}
                className="font-mono text-sm font-semibold tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
