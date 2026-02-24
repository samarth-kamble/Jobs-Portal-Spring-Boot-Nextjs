"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCalendarMonth,
  IconMapPin,
  IconMail,
  IconLink,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  changeAppStatus,
  analyzeResume,
  getJob,
  getApplicantsFiltered,
} from "@/modules/job/server/job-service";
import {
  errorNotification,
  successNotification,
} from "@/modules/notifications/server/notification-service";
import { formatInterviewTime } from "@/lib/format-interview-time";
import { openBase64PDF } from "@/lib/open-base64-pdf";

interface JobAnalyticsViewProps {
  jobId: string;
}

export const JobAnalyticsView = ({ jobId }: JobAnalyticsViewProps) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Pagination & Filtering State
  const [applicants, setApplicants] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [scoreFilter, setScoreFilter] = useState<number | "">("");

  const fetchFilteredData = () => {
    setLoading(true);
    getApplicantsFiltered(
      jobId,
      statusFilter || undefined,
      scoreFilter || undefined,
      page,
      size,
    )
      .then((res: any) => {
        setApplicants(res.content || []);
        setTotalElements(res.totalElements || 0);
        setTotalPages(res.totalPages || 0);
      })
      .catch((err) => {
        console.error("Error fetching applicants:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (jobId) {
      getJob(jobId)
        .then((res) => {
          setJob(res);
        })
        .catch((err) => {
          console.error("Error fetching job details:", err);
        });
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchFilteredData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, page, size, statusFilter, scoreFilter]);

  const handleScan = (applicantId: string) => {
    setScanningId(applicantId);
    analyzeResume(jobId, applicantId)
      .then(() => {
        successNotification(
          "Scan Complete",
          "Resume successfully analyzed by AI ✨",
        );
        fetchFilteredData();
      })
      .catch(() => {
        errorNotification("Error", "Failed to scan resume with AI");
      })
      .finally(() => {
        setScanningId(null);
      });
  };

  const handleStatusChange = (applicantId: string, status: string) => {
    const payload = {
      id: jobId,
      applicantId: applicantId,
      applicationStatus: status,
      emailMessage: `Status updated to ${status}`,
    };

    changeAppStatus(payload)
      .then(() => {
        successNotification("Status Updated", `Applicant marked as ${status}`);
        fetchFilteredData();
      })
      .catch((err) => {
        errorNotification(
          "Error",
          err?.response?.data?.errorMessage || "Failed to update status",
        );
      });
  };

  if (!job && loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Loading analytics for this job...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">
          Job data not found.
        </p>
        <Link
          href="/employer/jobs"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Back Navigation */}
      <div className="mb-8 border-b border-border pb-6">
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 bg-muted/50 px-3 py-1.5 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              {job.jobTitle}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {job.jobStatus || "Active"}
              </span>
              <span>{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconMapPin size={16} />
                {job.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {job.applicants?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Total Applicants
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* LEFT SIDEBAR: Filters */}
        <div className="xl:w-64 shrink-0 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-5 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg mb-5 border-b border-border pb-3">
              <Filter size={20} className="text-primary" />
              Pipeline Filters
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Application Status
                </label>
                <select
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0); // Reset page on filter change
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered / Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  AI Match Score
                </label>
                <select
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                  value={scoreFilter}
                  onChange={(e) => {
                    setScoreFilter(
                      e.target.value === "" ? "" : Number(e.target.value),
                    );
                    setPage(0);
                  }}
                >
                  <option value="">Any Score</option>
                  <option value="80">&gt; 80% Match</option>
                  <option value="50">&gt; 50% Match</option>
                  <option value="30">&gt; 30% Match</option>
                </select>
              </div>

              {(statusFilter || scoreFilter !== "") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter("");
                    setScoreFilter("");
                    setPage(0);
                  }}
                  className="w-full text-muted-foreground hover:text-foreground text-xs h-8"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT: Applicant Pipeline List */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Applicant Review Pipeline</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {applicants.length} of {totalElements} filtered
                candidates
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border/50">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse">
                Loading applicants...
              </p>
            </div>
          ) : applicants.length > 0 ? (
            <div className="flex flex-col gap-6">
              {applicants.map((applicant: any, index: number) => {
                const initials = applicant.name
                  ? applicant.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";
                const isMatchScored =
                  applicant.matchScore !== undefined &&
                  applicant.matchScore !== null &&
                  applicant.matchScore > 0;

                return (
                  <div
                    key={index}
                    className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                  >
                    {/* Top Section: Profile Info */}
                    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                      {/* Left Col: Avatar & Basic Info */}
                      <div className="flex-1 space-y-6">
                        <div className="flex items-start gap-5">
                          <Avatar className="h-20 w-20 ring-4 ring-muted">
                            <AvatarImage
                              src={
                                applicant.picture
                                  ? `data:image/jpeg;base64,${applicant.picture}`
                                  : undefined
                              }
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground capitalize">
                              {applicant.name}
                            </h3>
                            <p className="text-lg text-muted-foreground capitalize mb-2">
                              {applicant.jobTitle || "Candidate"}
                            </p>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              {applicant.email && (
                                <span className="flex items-center gap-1">
                                  <IconMail size={16} /> {applicant.email}
                                </span>
                              )}
                              {applicant.website && (
                                <span className="flex items-center gap-1">
                                  <IconLink size={16} />{" "}
                                  <a
                                    href={applicant.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-primary hover:underline"
                                  >
                                    Portfolio
                                  </a>
                                </span>
                              )}
                              {applicant.location && (
                                <span className="flex items-center gap-1">
                                  <IconMapPin size={16} /> {applicant.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                              About Candidate
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                              {applicant.about ||
                                applicant.coverLetter ||
                                "No cover letter or about section provided."}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                              Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {applicant.candidateSkills?.length > 0 ? (
                                applicant.candidateSkills.map(
                                  (s: string, i: number) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="bg-muted px-2.5 py-1 text-sm font-medium"
                                    >
                                      {s}
                                    </Badge>
                                  ),
                                )
                              ) : (
                                <span className="text-muted-foreground italic text-sm">
                                  No specific skills listed
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button
                              variant="link"
                              onClick={() => openBase64PDF(applicant.resume)}
                              className="h-auto p-0 text-primary font-semibold text-base"
                            >
                              View Full Resume PDF Document &rarr;
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Right Col: AI Analysis & Status */}
                      <div className="lg:w-[350px] shrink-0 bg-muted/30 rounded-xl p-6 border border-border/40 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            ✨ AI Match
                          </h4>
                          {isMatchScored && (
                            <Badge
                              className={cn(
                                "text-sm px-3 py-1 font-bold",
                                applicant.matchScore >= 80
                                  ? "bg-green-500 hover:bg-green-600"
                                  : applicant.matchScore >= 50
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-red-500 hover:bg-red-600",
                              )}
                            >
                              {applicant.matchScore}%
                            </Badge>
                          )}
                        </div>

                        {isMatchScored ? (
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed text-foreground/80 mb-4 bg-background border border-border/50 p-4 rounded-lg">
                              {applicant.aiExplanation}
                            </p>
                            {applicant.interviewTime && (
                              <div className="mt-4 flex flex-col gap-1 text-primary font-medium bg-primary/10 p-3 rounded-lg border border-primary/20 text-sm">
                                <div className="flex items-center gap-2">
                                  <IconCalendarMonth size={18} /> Interview:
                                </div>
                                <div>
                                  {formatInterviewTime(applicant.interviewTime)}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-4">
                              Un-analyzed against requirements.
                            </p>
                            <Button
                              onClick={() => handleScan(applicant.applicantId)}
                              disabled={scanningId === applicant.applicantId}
                              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs py-1 h-8"
                            >
                              {scanningId === applicant.applicantId ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  Scanning
                                </>
                              ) : (
                                "Run Analysis"
                              )}
                            </Button>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Status
                          </div>
                          <div
                            className={cn(
                              "inline-flex justify-center w-full py-2.5 rounded-lg border font-bold text-sm",
                              applicant.applicationStatus === "APPLIED"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : applicant.applicationStatus === "INTERVIEWING"
                                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                  : applicant.applicationStatus === "OFFERED" ||
                                      applicant.applicationStatus === "HIRED"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-destructive/10 text-destructive border-destructive/20",
                            )}
                          >
                            {applicant.applicationStatus}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Action Controls */}
                    <div className="bg-muted px-6 py-4 md:px-8 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
                      {applicant.applicationStatus === "APPLIED" && (
                        <>
                          <Button
                            onClick={() =>
                              handleStatusChange(
                                applicant.applicantId,
                                "REJECTED",
                              )
                            }
                            variant="outline"
                            className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 font-bold"
                          >
                            Reject Candidacy
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusChange(
                                applicant.applicantId,
                                "INTERVIEWING",
                              )
                            }
                            className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
                          >
                            Schedule Interview
                          </Button>
                        </>
                      )}

                      {applicant.applicationStatus === "INTERVIEWING" && (
                        <>
                          <Button
                            onClick={() =>
                              handleStatusChange(
                                applicant.applicantId,
                                "REJECTED",
                              )
                            }
                            variant="outline"
                            className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 font-bold"
                          >
                            Reject Candidacy
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusChange(
                                applicant.applicantId,
                                "OFFERED",
                              )
                            }
                            className="w-full sm:w-auto font-bold bg-green-500 hover:bg-green-600 text-white min-w-[200px]"
                          >
                            Hire / Extend Offer
                          </Button>
                        </>
                      )}

                      {(applicant.applicationStatus === "OFFERED" ||
                        applicant.applicationStatus === "HIRED" ||
                        applicant.applicationStatus === "REJECTED") && (
                        <div className="text-sm text-muted-foreground font-medium flex-1 text-right">
                          Decision has been made for this candidate.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 mt-4 shadow-sm">
                  <div className="text-sm text-muted-foreground font-medium">
                    Page {page + 1} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      className="flex items-center gap-1"
                    >
                      <IconChevronLeft size={16} /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      className="flex items-center gap-1"
                    >
                      Next <IconChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card">
              <h3 className="text-xl font-bold mb-2">No Candidates Found</h3>
              <p className="text-muted-foreground">
                There are no applicants matching your current filters. Try
                changing the Match Score or Status filter on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};;
