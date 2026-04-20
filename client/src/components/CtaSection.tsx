import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NetworkGrid } from "./NetworkGrid";

export function CtaSection() {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-card/40 px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div className="absolute inset-0 opacity-50">
            <NetworkGrid density={40} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-violet/15" />

          <div className="relative">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
              Ready when you are
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              Start monitoring{" "}
              <span className="text-gradient-brand italic">smarter</span>{" "}
              networks today.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Onboard your first 1,000 nodes in under 24 hours. Predictive
              alerts live by the end of the week.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded bg-cyan px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-[0_0_50px_-5px_var(--cyan)]"
              >
                Request Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded border border-border bg-background/60 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur transition-colors hover:border-cyan/60"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
