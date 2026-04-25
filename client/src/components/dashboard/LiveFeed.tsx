import React, { useEffect, useRef } from "react";
import { ActivityLog } from "../../hooks/useDashboardData";

interface LiveFeedProps {
  logs: ActivityLog[];
}

export function LiveFeed({ logs }: LiveFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full bg-black/40">
      <div className="p-4 border-b border-border/50 flex justify-between items-center bg-card/30 rounded-t-2xl">
        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-cyan flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" />
          Live Telemetry Stream
        </h3>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 scroll-smooth"
      >
        {logs.map((log) => {
          const isHigh = log.log.includes("HIGH");
          const isMedium = log.log.includes("MEDIUM");
          
          let highlightClass = "text-muted-foreground";
          if (isHigh) highlightClass = "text-destructive";
          else if (isMedium) highlightClass = "text-orange-400";

          return (
            <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-muted-foreground/50 shrink-0">{log.timestamp}</span>
              <span className={highlightClass}>
                {log.log.split(', ').map((part, i) => {
                  const [key, val] = part.split('=');
                  return (
                    <React.Fragment key={i}>
                      <span className="text-foreground/70">{key}=</span>
                      <span className={key === 'congestion' ? 'font-bold' : 'text-cyan/80'}>{val}</span>
                      {i < 2 && <span className="text-muted-foreground/30">, </span>}
                    </React.Fragment>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
