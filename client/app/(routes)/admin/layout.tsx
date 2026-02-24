
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";
import {
  Users,
  FileText,
  Settings,
  UserPlus,
  LayoutDashboard,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Platform Jobs", href: "/admin/jobs", icon: FileText },
  { label: "Add Admin", href: "/admin/add-admin", icon: UserPlus },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="w-[260px] shrink-0 min-h-[calc(100vh-3.5rem)] sticky top-14 hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border">
            {/* Sidebar Header */}
            <div className="px-5 pt-6 pb-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-sidebar-foreground leading-none">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Platform Management
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Navigation
              </p>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

          </aside>

          {/* Mobile Top Bar */}
          <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sidebar-primary" />
              <span className="text-sm font-bold text-sidebar-foreground">
                Admin
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 top-[7.5rem] z-30 bg-black/40"
                onClick={() => setMobileOpen(false)}
              />
              <div className="lg:hidden fixed top-[7.5rem] left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-3 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 p-6 lg:p-8 mt-[52px] lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
