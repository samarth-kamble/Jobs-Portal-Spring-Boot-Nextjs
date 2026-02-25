"use client";

import { timeAgo } from "@/lib/time-ago";
import ApplicationForm from "./application-form";
import { IconBriefcase, IconUsers, IconClock } from "@tabler/icons-react";
import { CompanyLogo } from "@/components/ui/company-logo";

const ApplyJobCompany = (props: any) => {
  return (
    <div className="px-6 pt-6 pb-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Company Header Card */}
        <div className="relative group bg-card border border-border rounded-2xl p-6 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Company Logo */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative bg-background border border-border rounded-2xl p-4 group-hover:border-primary/30 transition-all shadow">
                <CompanyLogo
                  company={props.company}
                  className="h-16 w-16"
                  fallbackClassName="h-16 w-16"
                />
              </div>
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 capitalize">
                {props.jobTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                {/* Company Name */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-muted rounded-lg">
                    <IconBriefcase
                      size={15}
                      className="text-primary"
                      stroke={1.5}
                    />
                  </div>
                  <span className="font-medium capitalize">
                    {props.company}
                  </span>
                </div>

                <div className="w-1 h-1 bg-border rounded-full" />

                {/* Post Time */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-muted rounded-lg">
                    <IconClock
                      size={15}
                      className="text-primary"
                      stroke={1.5}
                    />
                  </div>
                  <span>{timeAgo(props.postTime)}</span>
                </div>

                <div className="w-1 h-1 bg-border rounded-full" />

                {/* Applicants Count */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-muted rounded-lg">
                    <IconUsers
                      size={15}
                      className="text-primary"
                      stroke={1.5}
                    />
                  </div>
                  <span>
                    <span className="font-semibold text-foreground">
                      {props.applicants ? props.applicants.length : 0}
                    </span>{" "}
                    {props.applicants?.length === 1
                      ? "Applicant"
                      : "Applicants"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="hidden md:block shrink-0">
              <div className="px-4 py-2 bg-primary/10 border border-primary/25 rounded-xl">
                <span className="text-sm font-semibold text-primary">
                  Now Hiring
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <ApplicationForm />
      </div>
    </div>
  );
};

export default ApplyJobCompany;
