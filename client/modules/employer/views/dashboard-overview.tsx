"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobPostedBy } from "@/modules/job/server/job-service";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { Briefcase, Loader2 } from "lucide-react";
import { DashboardCharts } from "../components/dashboard-charts";

export default function DashboardOverview() {
  const user = useSelector((state: any) => state.user);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getJobPostedBy(user.id)
        .then((res) => {
          setJobs(res || []);
        })
        .catch((err) => {
          console.error("Error fetching jobs:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Aggregate metrics
  let totalApplicants = 0;
  let interviewing = 0;
  let hired = 0;
  let rejected = 0;
  let appliedOnly = 0;

  jobs.forEach((job) => {
    if (job.applicants && Array.isArray(job.applicants)) {
      totalApplicants += job.applicants.length;
      job.applicants.forEach((app: any) => {
        if (app.applicationStatus === "INTERVIEWING") interviewing++;
        else if (app.applicationStatus === "OFFERED" || app.applicationStatus === "HIRED") hired++;
        else if (app.applicationStatus === "REJECTED") rejected++;
        else appliedOnly++; // APPLIED or other pending
      });
    }
  });

  const funnelData = [
    { name: "Applied", value: appliedOnly, color: "#8b5cf6" }, // Violet
    { name: "Interviewing", value: interviewing, color: "#f59e0b" }, // Amber
    { name: "Hired", value: hired, color: "#10b981" }, // Emerald
    { name: "Rejected", value: rejected, color: "#ef4444" }, // Red
  ].filter((d) => d.value > 0);

  // Take top 5 jobs by applicant count for the bar chart
  const activeJobsData = [...jobs]
    .sort((a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0))
    .slice(0, 5)
    .map((j) => ({
      name: j.jobTitle.length > 20 ? j.jobTitle.slice(0, 20) + "..." : j.jobTitle,
      applicants: j.applicants?.length || 0,
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Aggregate metrics loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here is what's happening across all your job postings.
        </p>
      </div>

      <DashboardMetrics
        totalJobs={jobs.length}
        totalApplicants={totalApplicants}
        interviewing={interviewing}
        hired={hired}
        rejected={rejected}
      />

      {totalApplicants > 0 ? (
        <DashboardCharts funnelData={funnelData} activeJobsData={activeJobsData} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Candidates Yet</h3>
          <p className="text-muted-foreground max-w-md">
            You have posted {jobs.length} jobs, but no one has applied yet. Once candidates start applying, your recruitment funnel and charts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
