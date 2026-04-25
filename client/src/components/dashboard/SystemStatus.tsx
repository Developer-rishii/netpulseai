import React from "react";
import { Server, Activity, Clock } from "lucide-react";

interface SystemStatusProps {
  modelStatus: "Active" | "Idle";
  apiStatus: "Online" | "Offline";
  lastPredictionTime: string;
}

export function SystemStatus({ modelStatus, apiStatus, lastPredictionTime }: SystemStatusProps) {
  return (
    <div className="flex gap-6 items-center px-4 py-2 bg-card/40 backdrop-blur-md rounded-full border border-border/50 text-xs font-mono text-muted-foreground w-max">
      <div className="flex items-center gap-2">
        <Server className="w-3.5 h-3.5" />
        <span>API:</span>
        <span className={`flex items-center gap-1.5 ${apiStatus === 'Online' ? 'text-green-400' : 'text-destructive'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'Online' ? 'bg-green-400 animate-pulse-dot' : 'bg-destructive'}`} />
          {apiStatus}
        </span>
      </div>
      
      <div className="w-px h-3 bg-border" />
      
      <div className="flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" />
        <span>Model:</span>
        <span className={`flex items-center gap-1.5 ${modelStatus === 'Active' ? 'text-cyan' : 'text-muted-foreground'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${modelStatus === 'Active' ? 'bg-cyan animate-pulse-dot' : 'bg-muted-foreground'}`} />
          {modelStatus}
        </span>
      </div>

      <div className="w-px h-3 bg-border" />

      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" />
        <span>Last updated: {lastPredictionTime || "--:--:--"}</span>
      </div>
    </div>
  );
}
