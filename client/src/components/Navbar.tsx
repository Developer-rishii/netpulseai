import { useEffect, useState } from "react";
import { Activity, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Benefits", href: "#benefits" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "border-b border-border/60 bg-background/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
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
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded border border-cyan/60 bg-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan transition-all hover:bg-cyan/20 hover:border-glow"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md border border-border p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="mt-2 rounded border border-cyan/60 bg-cyan/10 px-3 py-2.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-cyan"
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
