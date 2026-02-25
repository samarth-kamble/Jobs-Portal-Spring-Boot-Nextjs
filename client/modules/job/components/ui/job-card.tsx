"use client";

import {
  IconBookmark,
  IconBookmarkFilled,
  IconClock,
  IconBriefcase,
  IconMapPin,
  IconUsers,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { timeAgo } from "@/lib/time-ago";
import { CompanyLogo } from "@/components/ui/company-logo";

export const JobCard = (props: any) => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const isSaved = profile.savedJobs?.includes(props.id);

  const handleSaveJob = () => {
    let savedJobs = [...(profile.savedJobs ?? [])];
    savedJobs = isSaved
      ? savedJobs.filter((id: any) => id !== props.id)
      : [...savedJobs, props.id];
    dispatch(changeProfile({ ...profile, savedJobs }));
  };

  return (
    <div className="group relative backdrop-blur-xl bg-muted/20 border border-border/20 rounded-xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-start flex-1 min-w-0">
          {/* Company logo */}
          <div className="p-2 bg-white rounded-lg shadow-md shrink-0">
            <CompanyLogo
              company={props.company}
              className="h-10 w-10"
              fallbackClassName="h-10 w-10"
            />
          </div>

          {/* Job info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1 capitalize truncate group-hover:text-primary transition-colors">
              {props.jobTitle}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <IconBriefcase className="w-4 h-4 shrink-0" />
              <span className="capitalize truncate">{props.company}</span>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1 shrink-0">
                <IconUsers className="w-4 h-4" />
                <span>{props.applicants?.length ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmark — replaces Mantine button */}
        <button
          onClick={handleSaveJob}
          className="shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors ml-1"
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? (
            <IconBookmarkFilled className="w-5 h-5 text-primary" />
          ) : (
            <IconBookmark className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>

      {/* ── Badges — replaces Mantine Badge ── */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 capitalize hover:bg-primary/15 text-xs"
        >
          {props.experience}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-muted/40 text-muted-foreground border border-border/30 capitalize text-xs"
        >
          {props.jobType}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-muted/40 text-muted-foreground border border-border/30 capitalize text-xs gap-1"
        >
          <IconMapPin className="w-3 h-3" />
          {props.location}
        </Badge>
      </div>

      {/* ── About — replaces Mantine Text lineClamp=3 ── */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
        {props.about}
      </p>

      {/* Divider */}
      <div className="h-px bg-border/20 mb-4" />

      {/* ── Footer ── */}
      <div className="flex justify-between items-center mb-4">
        {/* Salary */}
        <div className="flex items-center gap-0.5 text-foreground font-bold">
          <IconCurrencyRupee className="w-4 h-4 text-primary" />
          <span>{props.packageOffered} LPA</span>
        </div>

        {/* Posted time */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <IconClock className="w-4 h-4" />
          <span>{timeAgo(props.postTime)}</span>
        </div>
      </div>

      {/* ── CTA button — replaces Mantine Button ── */}
      <Link href={`/jobs/${props.id}`}>
        <Button className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200 font-semibold">
          View Details
        </Button>
      </Link>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </div>
  );
};
