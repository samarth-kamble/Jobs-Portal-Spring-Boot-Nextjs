"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageCircle,
  CheckCircle,
  LogOut
} from "lucide-react";
import { useDispatch } from "react-redux";
import { removeUser } from "@/modules/auth/server/user-slice";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const EmployerSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser());
    window.location.href = "/";
  };

  const navItems = [
    {
      title: "Overview",
      href: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Jobs",
      href: "/employer/jobs",
      icon: Briefcase,
    },
    {
      title: "Applied Candidates",
      href: "/employer/applicants/applied",
      icon: Users,
    },
    {
      title: "Interviewing",
      href: "/employer/applicants/interviewing",
      icon: MessageCircle,
    },
    {
      title: "Hired",
      href: "/employer/applicants/hired",
      icon: CheckCircle,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border backdrop-blur-xl bg-sidebar/50 text-sidebar-foreground">

      <SidebarHeader className="border-b border-sidebar-border/50 pb-4 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent hover:text-sidebar-foreground">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Image src={Logo} alt="Joblify" width={24} height={24} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none px-2 group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-xl tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Joblify
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href
                || (item.href === "/employer/jobs" && pathname.startsWith("/employer/jobs/"));

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="h-10 text-sm mb-1 px-3.5 hover:bg-accent/60"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 auto" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors gap-3 px-3.5"
            >
              <LogOut className="w-5 h-5 auto" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
