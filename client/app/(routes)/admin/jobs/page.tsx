"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, FileText, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllJobsAdmin, deleteJobAdmin } from "@/modules/admin/server/admin-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = () => {
    setLoading(true);
    getAllJobsAdmin()
      .then((res) => setJobs(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete job "${title}"? This cannot be undone.`)) return;
    deleteJobAdmin(id)
      .then(() => {
        successNotification("Job Deleted", `"${title}" has been removed.`);
        fetchJobs();
      })
      .catch(() => {
        errorNotification("Error", "Failed to delete job.");
      });
  };

  const filtered = jobs.filter((j) =>
    (j.jobTitle || "").toLowerCase().includes(search.toLowerCase()) ||
    (j.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Platform Jobs</h1>
        <p className="text-muted-foreground">View and moderate all job postings on the platform.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Jobs Table */}
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
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Job Title</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Company</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Location</th>
                  <th className="text-center px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Applicants</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{job.jobTitle}</td>
                    <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        {job.applicants?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                        {job.jobStatus || "ACTIVE"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id, job.jobTitle)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
            Showing {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Jobs Found</h3>
          <p className="text-muted-foreground">
            {search ? "No jobs match your search." : "No jobs posted on the platform yet."}
          </p>
        </div>
      )}
    </div>
  );
}
