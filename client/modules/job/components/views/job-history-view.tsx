"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IconHistory, IconBriefcase, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { getAllJobs } from "@/modules/job/server/job-service";
import { JobHistoryCard } from "../ui/job-history-card";
import { Input } from "@/components/ui/input";

export const JobHistoryView = () => {
  const user = useSelector((state: any) => state.user);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    getAllJobs()
      .then((res: any[]) => {
        // Find jobs where the user is an applicant
        const history = res.filter((job) =>
          job.applicants?.some((applicant: any) => applicant.applicantId === user.id)
        );

        // Sort by newest job post as an approximation if there's no applicant date
        history.sort((a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime());

        setAppliedJobs(history);
        setFilteredJobs(history);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load applied jobs:", err);
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredJobs(appliedJobs);
      return;
    }
    const term = search.toLowerCase();
    setFilteredJobs(
      appliedJobs.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(term) ||
          job.company?.toLowerCase().includes(term)
      )
    );
  }, [search, appliedJobs]);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-8">

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl shadow-lg shadow-primary/5 flex shrink-0">
              <IconHistory size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                Application History
              </h1>
              <p className="text-muted-foreground font-medium">
                Track and manage the jobs you've applied for.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or company..."
              className="pl-9 bg-card/50 border-border/50 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* List section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="h-32 bg-card/30 border border-border/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4 flex flex-col">
            {filteredJobs.map((job) => {
              // Extract the user's specific applicant profile for this job
              const applicantProfile = job.applicants.find(
                (a: any) => a.applicantId === user.id
              );
              return (
                <JobHistoryCard
                  key={job.id}
                  job={job}
                  applicant={applicantProfile}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-card/10 border border-border/20 rounded-3xl border-dashed">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
              <IconBriefcase size={36} className="text-muted-foreground/60" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {search ? "No matches found" : "No Applications Yet"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {search
                ? `We couldn't find any applied jobs matching "${search}".`
                : "You haven't applied to any jobs yet. Start exploring opportunities to see them listed here."}
            </p>
            {!search && (
              <Link href="/find-jobs">
                <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 hover:bg-primary/90 transition-all">
                  Browse Jobs
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
