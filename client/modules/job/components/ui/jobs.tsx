"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBriefcase, IconFilter } from "@tabler/icons-react";
import { resetFilter } from "@/modules/redux/filter-slice";
import { getAllJobs } from "../../server/job-service";
import { JobCard } from "./job-card";
import { Sort } from "./sort";
import { resetSort } from "@/modules/redux/sort-slice";

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="backdrop-blur-xl bg-muted/20 border border-border/20 rounded-xl p-5 h-80 animate-pulse">
    <div className="flex gap-3 mb-4">
      <div className="w-14 h-14 bg-muted/40 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-5 bg-muted/40 rounded w-3/4" />
        <div className="h-4 bg-muted/40 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-muted/40 rounded-full w-20" />
      <div className="h-6 bg-muted/40 rounded-full w-24" />
      <div className="h-6 bg-muted/40 rounded-full w-16" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-muted/40 rounded w-full" />
      <div className="h-4 bg-muted/40 rounded w-5/6" />
      <div className="h-4 bg-muted/40 rounded w-4/6" />
    </div>
    <div className="h-px bg-muted/30 mb-4" />
    <div className="flex justify-between mb-4">
      <div className="h-5 bg-muted/40 rounded w-20" />
      <div className="h-5 bg-muted/40 rounded w-16" />
    </div>
    <div className="h-10 bg-muted/40 rounded-lg" />
  </div>
);

export const Jobs = () => {
  const dispatch = useDispatch();
  const [jobList, setJobList] = useState<any[]>([]);
  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch on mount ── */
  useEffect(() => {
    dispatch(resetFilter());
    dispatch(resetSort());
    setLoading(true);
    getAllJobs()
      .then((res: any) => {
        setJobList(res.filter((job: any) => job.jobStatus === "ACTIVE"));
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  /* ── Sort & Filter merged to prevent circular dependency loops ── */
  useEffect(() => {
    let result = [...jobList];

    const currentFilter = filter || {};

    // 1. Apply Filters
    if (currentFilter["Job Title"]?.length) {
      result = result.filter((job) =>
        currentFilter["Job Title"].some((x: string) =>
          job.jobTitle?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (currentFilter.Location?.length) {
      result = result.filter((job) =>
        currentFilter.Location.some((x: string) =>
          job.location?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (currentFilter.Experience?.length) {
      result = result.filter((job) =>
        currentFilter.Experience.some((x: string) =>
          job.experience?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (currentFilter["Job Type"]?.length) {
      result = result.filter((job) =>
        currentFilter["Job Type"].some((x: string) =>
          job.jobType?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (currentFilter.packageOffered?.length === 2) {
      const [minLpa, maxLpa] = currentFilter.packageOffered;
      result = result.filter(
        (job) =>
          job.packageOffered >= minLpa && job.packageOffered <= maxLpa
      );
    }

    // 2. Apply Sort to the filtered results instead of raw jobList
    if (sort === "most recent") {
      result.sort(
        (a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()
      );
    } else if (sort === "salary (low-high)") {
      result.sort((a, b) => a.packageOffered - b.packageOffered);
    } else if (sort === "salary (high-low)") {
      result.sort((a, b) => b.packageOffered - a.packageOffered);
    }

    setFilteredJobs(result);
  }, [filter, sort, jobList]);

  return (
    <div className="py-12 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-border/20">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <IconBriefcase className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Recommended Jobs
            </h2>
            <p className="text-muted-foreground text-sm">
              {loading
                ? "Loading jobs…"
                : `${filteredJobs.length} ${filteredJobs.length === 1 ? "job" : "jobs"} found`}
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
            <IconFilter className="w-4 h-4" />
            <span>Sort by:</span>
          </div>
          <Sort sort="job" />
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job: any, index: number) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="text-center py-24">
          <div className="inline-flex p-6 bg-muted/20 border border-border/20 rounded-2xl mb-6">
            <IconBriefcase
              size={56}
              className="text-muted-foreground/40"
              stroke={1.2}
            />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            No Jobs Found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Try adjusting your filters or search criteria to find more
            opportunities
          </p>
        </div>
      )}
    </div>
  );
};
