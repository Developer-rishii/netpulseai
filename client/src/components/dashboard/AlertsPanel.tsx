import React from "react";
import { Alert } from "../../hooks/useDashboardData";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case "critical":
        return { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", icon: AlertTriangle };
      case "warning":
        return { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500", icon: AlertCircle };
      default:
        return { bg: "bg-cyan/10", border: "border-cyan/30", text: "text-cyan", icon: Info };
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col h-full">
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4 flex items-center justify-between">
        Recent Alerts
        <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px]">{alerts.length}</span>
      </h3>
      
      <div className="flex-1 overflow-hidden">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground text-center py-8">
                No active alerts
              </motion.div>
            ) : (
              alerts.map((alert) => {
                const styles = getAlertStyles(alert.type);
                const Icon = styles.icon;
                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-3 rounded-xl border ${styles.border} ${styles.bg} flex gap-3 items-start`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${styles.text}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${styles.text} truncate`}>{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
