import { AuthGuard } from "@/modules/auth/components/AuthGuard";
import { Users, FileText, Settings } from "lucide-react";

const AdminDashboard = () => {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-muted-foreground">
              Manage recruiters, applicants, and platform admins.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Platform Jobs</h2>
            <p className="text-muted-foreground">
              View and moderate all active job postings on the platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <Settings className="w-12 h-12 text-zinc-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">System Settings</h2>
            <p className="text-muted-foreground">
              Configure AI model parameters and system integrations.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
