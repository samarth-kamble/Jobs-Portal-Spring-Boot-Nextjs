"use client";

import { useEffect, useState } from "react";
import { getJob } from "@/modules/job/server/job-service";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { DashboardCharts } from "../components/dashboard-charts";
import { TalentCard } from "@/modules/job/components/ui/talent-card";

interface JobAnalyticsViewProps {
  jobId: string;
}

export const JobAnalyticsView = ({ jobId }: JobAnalyticsViewProps) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      getJob(jobId)
        .then((res) => {
          setJob(res);
        })
        .catch((err) => {
          console.error("Error fetching job analytics:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading analytics for this job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">Job data not found.</p>
        <Link href="/employer/jobs" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
      </div>
    );
  }

  // Calculate isolated metrics for this job only
  const applicants = job.applicants || [];
  let interviewing = 0;
  let hired = 0;
  let rejected = 0;
  let appliedOnly = 0;

  applicants.forEach((app: any) => {
    if (app.applicationStatus === "INTERVIEWING") interviewing++;
    else if (app.applicationStatus === "OFFERED" || app.applicationStatus === "HIRED") hired++;
    else if (app.applicationStatus === "REJECTED") rejected++;
    else appliedOnly++;
  });

  const funnelData = [
    { name: "Applied", value: appliedOnly, color: "#8b5cf6" },
    { name: "Interviewing", value: interviewing, color: "#f59e0b" },
    { name: "Hired", value: hired, color: "#10b981" },
    { name: "Rejected", value: rejected, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">

      {/* Header & Back Navigation */}
      <div>
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all jobs
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
          {job.jobTitle}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
            {job.jobStatus || "Active"}
          </span>
          <span>{job.company}</span>
          <span>•</span>
          <span>{job.location}</span>
        </div>
      </div>

      {/* Primary Metrics Layer */}
      <DashboardMetrics
        totalJobs={1}
        totalApplicants={applicants.length}
        interviewing={interviewing}
        hired={hired}
        rejected={rejected}
      />

      {/* Visualizations Layer (Only render Pie Chart if there are applicants, no Bar Chart needed for single job) */}
      {applicants.length > 0 && (
         <div className="lg:w-1/2">
            <DashboardCharts funnelData={funnelData} activeJobsData={[]} />
         </div>
      )}

      {/* Candidate Pipeline Data Table / Grid */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Candidate Pipeline</h2>
          <p className="text-muted-foreground">
            Manage the applicants for this specific position.
          </p>
        </div>

        {applicants.length > 0 ? (
          <div className="flex flex-col gap-5">
            {applicants.map((applicant: any, index: number) => (
              <TalentCard
                key={index}
                {...applicant}
                jobTitle={job.jobTitle}
                company={job.company}
                requiredSkills={job.skillsRequired}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-card/30">
             <p className="text-muted-foreground">No candidates have applied to this position yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};
