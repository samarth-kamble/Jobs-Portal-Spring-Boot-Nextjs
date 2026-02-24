"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobPostedBy } from "@/modules/job/server/job-service";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { Briefcase, Loader2, Clock } from "lucide-react";
import {
  DashboardPieChart,
  DashboardBarChart,
  DashboardAreaChart,
  DashboardRadarChart,
} from "../components/dashboard-charts";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  const allApplicants: any[] = [];

  jobs.forEach((job) => {
    if (job.applicants && Array.isArray(job.applicants)) {
      totalApplicants += job.applicants.length;
      job.applicants.forEach((app: any) => {
        allApplicants.push({
          ...app,
          jobId: job.id,
          jobTitle: job.jobTitle,
          company: job.company,
        });

        if (app.applicationStatus === "INTERVIEWING") interviewing++;
        else if (
          app.applicationStatus === "OFFERED" ||
          app.applicationStatus === "HIRED"
        )
          hired++;
        else if (app.applicationStatus === "REJECTED") rejected++;
        else appliedOnly++; // APPLIED or other pending
      });
    }
  });

  // Funnel Data (Pie Chart)
  const funnelData = [
    { name: "Applied", value: appliedOnly, color: "var(--color-chart-1)" },
    {
      name: "Interviewing",
      value: interviewing,
      color: "var(--color-chart-2)",
    },
    { name: "Hired", value: hired, color: "var(--color-chart-3)" },
    { name: "Rejected", value: rejected, color: "var(--color-chart-4)" },
  ].filter((d) => d.value > 0);

  // Active Jobs Data (Bar Chart)
  const activeJobsData = [...jobs]
    .sort((a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0))
    .slice(0, 5)
    .map((j) => ({
      name:
        j.jobTitle.length > 20 ? j.jobTitle.slice(0, 20) + "..." : j.jobTitle,
      applicants: j.applicants?.length || 0,
    }));

  // Trend Data (Area Chart)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const trendMap: Record<string, number> = {};

  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    let key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    trendMap[key] = 0;
  }

  allApplicants.forEach((app) => {
    if (app.timestamp) {
      let d = new Date(app.timestamp);
      let key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (trendMap[key] !== undefined) {
        trendMap[key]++;
      } else {
        trendMap[key] = (trendMap[key] || 0) + 1;
      }
    }
  });

  const trendData = Object.entries(trendMap)
    .sort((a, b) => {
      const [m1, y1] = a[0].split(" ");
      const [m2, y2] = b[0].split(" ");
      if (y1 !== y2) return parseInt(y1) - parseInt(y2);
      return months.indexOf(m1) - months.indexOf(m2);
    })
    .map(([month, applications]) => ({ month, applications }));

  // Radar Data (Skills)
  const skillsMap: Record<string, number> = {};
  allApplicants.forEach((app) => {
    if (app.candidateSkills && Array.isArray(app.candidateSkills)) {
      app.candidateSkills.forEach((skill: string) => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    }
  });

  const radarDataRaw = Object.entries(skillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  // If radarData is empty or too small, provide some default placeholder data for visual completeness
  const finalRadarData =
    radarDataRaw.length > 2
      ? radarDataRaw
      : [
          { skill: "JavaScript", count: 12 },
          { skill: "React", count: 10 },
          { skill: "Node.js", count: 8 },
          { skill: "Python", count: 6 },
          { skill: "SQL", count: 9 },
          { skill: "Java", count: 5 },
        ];

  // Recent Applications
  const recentApplications = allApplicants
    .sort(
      (a, b) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime(),
    )
    .slice(0, 5); // take 5 to fit well alongside charts

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Aggregate metrics loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Account Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here is what's happening across all your
          job postings.
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
        <div className="space-y-8">
          {/* Row 1: Top Active Jobs & Recent Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardBarChart activeJobsData={activeJobsData} />

            {/* Recent Notifications Card List */}
            <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Recent Applications
                  </CardTitle>
                  <Link
                    href="/employer/jobs"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto max-h-[350px]">
                {recentApplications.length > 0 ? (
                  <div className="flex flex-col">
                    {recentApplications.map((app, index) => (
                      <Link
                        key={index}
                        href={`/employer/jobs/${app.jobId}/analytics`}
                        className="group block p-4 border-b border-border/40 hover:bg-muted/30 transition-colors last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {(app.name || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {app.name || "Unknown Candidate"}
                              </p>
                              {app.timestamp && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {new Date(app.timestamp).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1.5">
                              Applied for{" "}
                              <span className="font-medium text-foreground/80">
                                {app.jobTitle}
                              </span>
                            </p>
                            <span className="inline-flex bg-muted/60 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border border-border/50 uppercase">
                              {app.applicationStatus}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
                    No recent applications found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Full Width Area Chart */}
          <div className="w-full">
            <DashboardAreaChart trendData={trendData} />
          </div>

          {/* Row 3: Candidate Pipeline & Radar Chart (flex 2 / grid cols 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardPieChart funnelData={funnelData} />
            <DashboardRadarChart radarData={finalRadarData} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Candidates Yet</h3>
          <p className="text-muted-foreground max-w-md">
            You have posted {jobs.length} jobs, but no one has applied yet. Once
            candidates start applying, your recruitment funnel and charts will
            appear here.
          </p>
        </div>
      )}
    </div>
  );
}
