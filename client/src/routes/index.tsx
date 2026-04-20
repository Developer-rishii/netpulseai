import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Benefits } from "@/components/Benefits";
import { Trust } from "@/components/Trust";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NetPulse AI — Predict Network Congestion Before It Happens" },
      {
        name: "description",
        content:
          "AI-powered telecom network monitoring and congestion prediction. Real-time analytics, SLA tracking, and predictive alerts for modern operators.",
      },
      { property: "og:title", content: "NetPulse AI — Telco Intelligence" },
      {
        property: "og:description",
        content:
          "Predictive intelligence for the networks the world runs on. Monitor, forecast, and act before congestion hits.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Benefits />
      <CtaSection />
      <Footer />
    </main>
  );
}
