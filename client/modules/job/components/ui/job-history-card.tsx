"use client";

import {
  IconBriefcase,
  IconMapPin,
  IconClock,
  IconCurrencyRupee,
  IconCircleCheck,
  IconCircleX,
  IconHistory,
  IconUser,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { timeAgo } from "@/lib/time-ago";

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACCEPTED":
    case "HIRED":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "REJECTED":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "INTERVIEWING":
    case "SHORTLISTED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "APPLIED":
    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACCEPTED":
    case "HIRED":
      return <IconCircleCheck className="w-4 h-4" />;
    case "REJECTED":
      return <IconCircleX className="w-4 h-4" />;
    case "INTERVIEWING":
    case "SHORTLISTED":
      return <IconUser className="w-4 h-4" />;
    case "APPLIED":
    default:
      return <IconHistory className="w-4 h-4" />;
  }
};

export const JobHistoryCard = ({ job, applicant }: { job: any; applicant: any }) => {
  // We use applicant's status if provided by the backend, otherwise default to APPLIED
  const status = applicant?.applicationStatus || "APPLIED";
  const appliedDate = applicant?.dateConfig ? new Date(applicant?.dateConfig).toLocaleDateString() : timeAgo(job.postTime); // fallback

  return (
    <div className="group bg-card/50 backdrop-blur-md border border-border/40 rounded-2xl p-5 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row gap-5">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Company Logo */}
      <div className="shrink-0 flex sm:flex-col items-start gap-4">
        <div className="w-14 h-14 bg-background rounded-xl border border-border/50 p-2.5 shadow-sm group-hover:border-primary/20 group-hover:shadow-primary/10 transition-all">
          <img
            src={`/icons/${job.company?.charAt(0).toUpperCase()}${job.company?.slice(1)}.png`}
            alt={job.company}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "/icons/default.png";
            }}
          />
        </div>
      </div>

      {/* Job Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
            <Link href={`/jobs/${job.id}`} className="block">
              <h3 className="text-xl font-bold text-foreground capitalize truncate group-hover:text-primary transition-colors">
                {job.jobTitle}
              </h3>
            </Link>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shrink-0 sm:self-start ${getStatusColor(
                status
              )}`}
            >
              {getStatusIcon(status)}
              {status}
            </div>
          </div>

          <p className="text-muted-foreground font-medium capitalize flex items-center gap-1.5 text-sm mb-4">
            <IconBriefcase className="w-4 h-4" />
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground/80 mb-4 sm:mb-0">
            <div className="flex items-center gap-1.5">
              <IconMapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <IconCurrencyRupee className="w-4 h-4 shrink-0" />
              <span>{job.packageOffered} LPA</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <IconClock className="w-4 h-4 shrink-0" />
              <span>Applied {appliedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center justify-end border-t border-border/40 pt-4 sm:border-t-0 sm:pt-0">
         <Link href={`/jobs/${job.id}`}>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium text-sm hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200">
            <IconEye size={16} />
            View Listing
          </button>
        </Link>
      </div>
    </div>
  );
};
