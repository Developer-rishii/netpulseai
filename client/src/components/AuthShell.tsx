import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowLeft } from "lucide-react";
import { NetworkGrid } from "@/components/NetworkGrid";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated network background */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <NetworkGrid />
      </div>
      <div className="pointer-events-none absolute inset-0 grid-bg radial-fade opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklab,var(--cyan)_18%,transparent),transparent_60%)]" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-md border border-cyan/40 bg-cyan/10">
            <Activity className="h-4 w-4 text-cyan" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan animate-pulse-dot" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">
              NetPulse <span className="text-cyan">AI</span>
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Telco Intelligence
            </span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-cyan"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-10 lg:flex-row lg:items-stretch lg:gap-16 lg:py-16">
        {/* Left brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden flex-1 flex-col justify-between lg:flex"
        >
          <div>
            <span className="chip">Secure access</span>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight">
              Predictive intelligence for the <span className="text-gradient-brand">networks</span>{" "}
              the world runs on.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Real-time telemetry, AI-powered congestion forecasting, and SLA-grade alerting —
              purpose-built for telecom operators and infrastructure providers.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { k: "99.99%", v: "Platform uptime" },
              { k: "<2 min", v: "Alert latency" },
              { k: "SOC 2", v: "Type II ready" },
            ].map((s) => (
              <div key={s.v} className="glass-panel rounded-md p-3">
                <div className="font-mono text-lg font-semibold text-cyan">{s.k}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex-shrink-0"
        >
          <div className="glass-panel border-glow rounded-xl p-7 sm:p-9">
            <div className="mb-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                {eyebrow}
              </span>
              <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            <div className="mt-7 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Encrypted · TLS 1.3 · SOC 2 controls
          </p>
        </motion.div>
      </main>
    </div>
  );
}
