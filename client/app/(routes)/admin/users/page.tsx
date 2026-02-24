"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, Shield, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, deleteUser } from "@/modules/admin/server/admin-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers(roleFilter || undefined)
      .then((res) => setUsers(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;
    deleteUser(id)
      .then(() => {
        successNotification("User Deleted", `${name} has been removed.`);
        fetchUsers();
      })
      .catch(() => {
        errorNotification("Error", "Failed to delete user.");
      });
  };

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const roleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "EMPLOYER": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "APPLICANT": return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">View and manage all platform users.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
        >
          <option value="">All Roles</option>
          <option value="APPLICANT">Applicants</option>
          <option value="EMPLOYER">Employers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-card rounded-xl border border-border">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Role</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{user.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground capitalize">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`${roleBadgeStyle(user.accountType)} text-xs font-bold`}>
                        {user.accountType === "ADMIN" && <Shield className="w-3 h-3 mr-1" />}
                        {user.accountType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
            Showing {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Users Found</h3>
          <p className="text-muted-foreground">
            {search ? "No users match your search criteria." : "No users on the platform yet."}
          </p>
        </div>
      )}
    </div>
  );
}
