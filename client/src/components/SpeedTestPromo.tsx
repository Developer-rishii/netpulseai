import { motion } from "framer-motion";
import { Gauge, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SpeedTestPromo() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyan/5 -z-10" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-cyan/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 blur-[100px] -z-10 group-hover:bg-cyan/20 transition-colors" />
          
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono uppercase tracking-widest">
              <Gauge className="w-3 h-3" />
              Free Tool
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Test your <span className="text-gradient-brand">actual throughput</span> in seconds.
            </h2>
            <p className="text-muted-foreground text-lg">
              Curious about your current network performance? Use our AI-optimized speed test tool to measure your real-time latency and bandwidth.
            </p>
            <div className="pt-4">
              <Link
                to="/speedtest"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--color-cyan)]"
              >
                Launch Speed Test
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative flex-shrink-0">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-dashed border-cyan/30 flex items-center justify-center"
             >
                <div className="w-full h-1 bg-gradient-to-r from-cyan to-transparent absolute top-1/2 left-1/2 -translate-y-1/2 origin-left" />
             </motion.div>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Gauge className="w-12 h-12 text-cyan mb-2" />
                <span className="font-mono text-2xl font-bold text-glow-cyan">Mbps</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
