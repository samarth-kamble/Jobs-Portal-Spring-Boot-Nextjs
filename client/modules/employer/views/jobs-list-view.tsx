"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobPostedBy } from "@/modules/job/server/job-service";
import { Loader2, Calendar, MapPin, Briefcase, ChevronRight, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const JobsListView = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-primary/60" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No jobs posted yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't posted any jobs. Once you create job listings, you can manage them and view analytics here.
        </p>
        <Link
          href="/post-job"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage your active job postings and view detailed analytics.
          </p>
        </div>
        <Link
          href="/post-job"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => {
          const applicantCount = job.applicants?.length || 0;
          let newApplicants = 0;
          let interviewing = 0;

          if (job.applicants) {
            job.applicants.forEach((app: any) => {
              if (app.applicationStatus === "APPLIED") newApplicants++;
              if (app.applicationStatus === "INTERVIEWING") interviewing++;
            });
          }

          return (
            <Link key={job.id} href={`/employer/jobs/${job.id}`}>
              <Card className="border-border bg-card/40 hover:bg-card/80 transition-all duration-300 group cursor-pointer overflow-hidden backdrop-blur-xl">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center">

                    {/* Left details */}
                    <div className="p-6 flex-1 w-full">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {job.jobTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-foreground/80 mt-1">
                            <span>{job.company}</span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0">
                          {job.jobStatus || "Active"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {job.jobType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Posted {job.postDate ? formatDistanceToNow(new Date(job.postDate), { addSuffix: true }) : "recently"}
                        </span>
                      </div>
                    </div>

                    {/* Right side stats & action */}
                    <div className="w-full md:w-auto p-6 md:border-l border-t md:border-t-0 border-border bg-card/60 flex items-center justify-between gap-8">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-foreground">{applicantCount}</span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Total
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-emerald-500">{newApplicants}</span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            New
                          </span>
                        </div>
                        <div className="hidden sm:flex flex-col items-center">
                          <span className="text-2xl font-bold text-amber-500">{interviewing}</span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            Interviews
                          </span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
