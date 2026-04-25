import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean; // For latency/loss, positive trend (increase) might be bad, handle color externally or keep simple
  };
  status?: "good" | "warning" | "critical";
  glow?: boolean;
}

export function MetricCard({ title, value, unit, icon: Icon, trend, status = "good", glow = false }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "critical": return "text-destructive";
      case "warning": return "text-orange-400";
      default: return "text-cyan";
    }
  };

  const getStatusGlow = () => {
    if (!glow) return "";
    switch (status) {
      case "critical": return "shadow-[0_0_15px_-3px_var(--color-destructive)] border-destructive/50";
      case "warning": return "shadow-[0_0_15px_-3px_orange] border-orange-500/50";
      default: return "border-glow border-cyan/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 ${getStatusGlow()}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-bold tracking-tight text-foreground group-hover:text-glow-cyan transition-all">
              {value}
            </h3>
            {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-card/50 ${getStatusColor()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-medium flex items-center ${trend.isPositive ? 'text-destructive' : 'text-green-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last 5m</span>
        </div>
      )}
      
      {/* Subtle corner gradient */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan/20 to-violet/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
