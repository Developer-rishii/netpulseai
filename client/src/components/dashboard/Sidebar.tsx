import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, BarChart2, Bell, Settings, LogOut, Activity } from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Alerts", path: "/alerts", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="hidden lg:flex w-64 h-full bg-card/40 backdrop-blur-xl border-r border-border/50 flex-col pt-6 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20 shrink-0">
      {/* Brand */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <Activity className="w-4 h-4 text-cyan" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          NetPulse<span className="text-cyan">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-cyan/10 text-cyan font-medium" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-cyan" : "text-muted-foreground group-hover:text-foreground"}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1 h-5 bg-cyan rounded-full shadow-[0_0_8px_var(--color-cyan)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 mt-auto pt-6 border-t border-border/30">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:text-destructive transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}
