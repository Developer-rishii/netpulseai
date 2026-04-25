import { motion } from "framer-motion";
import { TrendingDown, Gauge, Layers } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  {
    icon: TrendingDown,
    stat: "−47%",
    title: "Reduced downtime",
    desc: "Predictive alerting catches incidents before customers feel them — measurable MTTR collapse in week one.",
  },
  {
    icon: Gauge,
    stat: "+31%",
    title: "Improved network efficiency",
    desc: "Smarter capacity planning and traffic shaping reclaim headroom from your existing infrastructure.",
  },
  {
    icon: Layers,
    stat: "∞",
    title: "Scales with your network",
    desc: "From regional ISPs to Tier-1 carriers — horizontally scalable to billions of metrics per day.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="// Outcomes"
          title={
            <>
              Why operators <span className="text-gradient-brand">choose NetPulse</span>.
            </>
          }
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-8 backdrop-blur transition-all hover:border-cyan/40"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan/10 blur-3xl transition-opacity group-hover:opacity-100" />
              <it.icon className="h-7 w-7 text-cyan" />
              <div className="mt-6 text-5xl font-semibold tracking-tight text-gradient-brand">
                {it.stat}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
