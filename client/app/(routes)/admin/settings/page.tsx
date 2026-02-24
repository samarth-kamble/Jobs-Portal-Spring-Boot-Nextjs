"use client";

import { Settings, Cpu, Globe, Database, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const settingsCards = [
    {
      title: "AI Model Configuration",
      description: "Configure the Gemini AI model parameters for resume analysis and candidate matching.",
      icon: Cpu,
      cssVar: "chart-1",
      status: "Active",
    },
    {
      title: "Email Service",
      description: "Manage SMTP configuration for sending OTP, interview notifications, and status update emails.",
      icon: Globe,
      cssVar: "chart-2",
      status: "Connected",
    },
    {
      title: "Database",
      description: "MongoDB connection status and collection management for users, jobs, profiles, and notifications.",
      icon: Database,
      cssVar: "chart-5",
      status: "Connected",
    },
    {
      title: "Security & Auth",
      description: "JWT token configuration, session management, and role-based access control settings.",
      icon: Shield,
      cssVar: "chart-4",
      status: "Configured",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">System Settings</h1>
        <p className="text-muted-foreground">Configure platform integrations and system parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card) => (
          <div
            key={card.title}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `color-mix(in oklch, var(--${card.cssVar}) 15%, transparent)` }}
              >
                <card.icon
                  className="w-6 h-6"
                  style={{ color: `var(--${card.cssVar})` }}
                />
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `color-mix(in oklch, var(--${card.cssVar}) 15%, transparent)`,
                  color: `var(--${card.cssVar})`,
                }}
              >
                {card.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
            <button
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Configure →
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings className="w-4 h-4" />
          <span>Settings are configured via environment variables. Contact your system administrator for changes.</span>
        </div>
      </div>
    </div>
  );
}
