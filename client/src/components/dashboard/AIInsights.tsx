import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";

interface Insight {
  id: string;
  text: React.ReactNode;
  type: "prediction" | "recommendation" | "observation";
}

interface AIInsightsProps {
  congestionStatus: "Low" | "Medium" | "High";
  latency: number;
}

export function AIInsights({ congestionStatus, latency }: AIInsightsProps) {
  // Generate insights based on current status
  const insights: Insight[] = React.useMemo(() => {
    const list: Insight[] = [];
    
    // Observation
    if (latency > 80) {
      list.push({
        id: "obs-1",
        type: "observation",
        text: <>Latency is currently <span className="text-destructive font-bold">{latency.toFixed(0)}ms</span>, higher than the 45ms baseline.</>
      });
    } else {
      list.push({
        id: "obs-2",
        type: "observation",
        text: <>Network operating within normal parameters.</>
      });
    }

    // Prediction
    if (congestionStatus === "High") {
      list.push({
        id: "pred-1",
        type: "prediction",
        text: <>High congestion predicted to continue for the next <span className="text-orange-400 font-bold">12 minutes</span>.</>
      });
    } else if (congestionStatus === "Medium") {
      list.push({
        id: "pred-2",
        type: "prediction",
        text: <>Congestion probability rising. Peak expected at <span className="text-cyan font-bold">18:00</span>.</>
      });
    }

    // Recommendation
    if (congestionStatus === "High" || latency > 100) {
      list.push({
        id: "rec-1",
        type: "recommendation",
        text: <>Recommendation: Reroute non-critical traffic via <span className="text-violet font-bold font-mono">Node Alpha-7</span>.</>
      });
    }

    return list;
  }, [congestionStatus, latency]);

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full border-cyan/20 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan via-violet to-cyan opacity-50" />
      
      <div className="p-5 flex items-center gap-3 border-b border-border/50">
        <div className="p-2 bg-cyan/10 rounded-lg text-cyan">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">NetPulse AI</h3>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Real-time Analysis</p>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        <AnimatePresence mode="popLayout">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-3"
            >
              <Sparkles className={`w-4 h-4 mt-1 shrink-0 ${insight.type === 'recommendation' ? 'text-violet' : 'text-cyan'}`} />
              <div className="text-sm text-muted-foreground leading-relaxed">
                {insight.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan/10 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan/20 transition-colors" />
    </div>
  );
}
