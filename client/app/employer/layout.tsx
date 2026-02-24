import { AuthGuard } from "@/modules/auth/components/AuthGuard";
import { EmployerSidebar } from "@/modules/employer/components/employer-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/modules/landing/components/header";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["EMPLOYER"]}>
      <SidebarProvider>
        <EmployerSidebar />
        <SidebarInset className="flex min-h-screen flex-col bg-background overflow-hidden relative">
          <Header />

          {/* Subheader for Sidebar Controls */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 bg-card/30 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <div className="w-px h-4 bg-border mx-2" />
            <span className="text-sm font-medium text-muted-foreground">
              Employer Workspace
            </span>
          </div>

          <main className="flex-1 w-full bg-background overflow-x-hidden">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
