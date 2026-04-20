import { Activity, Github, Linkedin, Twitter } from "lucide-react";

const cols = [
  {
    heading: "Product",
    links: ["Features", "Dashboard", "Pricing", "Changelog", "Roadmap"],
  },
  {
    heading: "Solutions",
    links: ["Tier-1 Carriers", "Regional ISPs", "MNOs", "Data Centers", "Enterprise"],
  },
  {
    heading: "Company",
    links: ["About", "Customers", "Careers", "Press", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Docs", "API Reference", "Status", "Security", "Compliance"],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-md border border-cyan/40 bg-cyan/10">
                <Activity className="h-4 w-4 text-cyan" strokeWidth={2.5} />
              </span>
              <span>
                <span className="block text-base font-semibold tracking-tight">
                  NetPulse <span className="text-cyan">AI</span>
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Telco Intelligence
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Predictive intelligence for the networks the world runs on.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-cyan/50 hover:text-cyan"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.heading}>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                // {c.heading}
              </div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            © {new Date().getFullYear()} NetPulse AI · All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            hello@netpulse.ai · SOC 2 · ISO 27001
          </p>
        </div>
      </div>
    </footer>
  );
}
