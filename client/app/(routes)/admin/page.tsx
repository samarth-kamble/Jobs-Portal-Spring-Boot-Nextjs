"use client";

import { useEffect, useState } from "react";
import { Users, FileText, UserPlus, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/modules/admin/server/admin-service";
import { getAllJobs } from "@/modules/job/server/job-service";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    applicants: 0,
    employers: 0,
    admins: 0,
    totalJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllJobs()])
      .then(([users, jobs]) => {
        setStats({
          totalUsers: users.length,
          applicants: users.filter((u: any) => u.accountType === "APPLICANT")
            .length,
          employers: users.filter((u: any) => u.accountType === "EMPLOYER")
            .length,
          admins: users.filter((u: any) => u.accountType === "ADMIN").length,
          totalJobs: jobs.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      cssVar: "chart-1",
    },
    {
      title: "Applicants",
      value: stats.applicants,
      icon: Users,
      cssVar: "chart-2",
    },
    {
      title: "Employers",
      value: stats.employers,
      icon: Users,
      cssVar: "chart-3",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: Shield,
      cssVar: "chart-4",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: FileText,
      cssVar: "chart-5",
    },
  ];

  const quickLinks = [
    {
      label: "Manage Users",
      href: "/admin/users",
      icon: Users,
      desc: "View, search, and remove users",
    },
    {
      label: "Platform Jobs",
      href: "/admin/jobs",
      icon: FileText,
      desc: "Moderate all job listings",
    },
    {
      label: "Add Admin",
      href: "/admin/add-admin",
      icon: UserPlus,
      desc: "Create new admin account",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and quick actions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 shadow-sm"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `color-mix(in oklch, var(--${card.cssVar}) 15%, transparent)`,
              }}
            >
              <card.icon
                className="w-5 h-5"
                style={{ color: `var(--${card.cssVar})` }}
              />
            </div>
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: `var(--${card.cssVar})` }}
              >
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <link.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">
                {link.label}
              </h3>
              <p className="text-sm text-muted-foreground">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
