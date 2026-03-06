"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IconCalendarMonth,
  IconMapPin,
  IconMail,
  IconLink,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
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
  const [selectedAiApplicant, setSelectedAiApplicant] = useState<any | null>(
    null,
  );
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Status Action Dialog States
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [pendingOfferStatus, setPendingOfferStatus] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  /* Min date for date picker */
  const todayStr = new Date().toISOString().split("T")[0];

  // Pagination & Filtering State
  const [applicants, setApplicants] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [statusFilter, setStatusFilter] = useState<string>("APPLIED");
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

  const handleOfferClick = (applicant: any, status: string) => {
    setSelectedApplicant(applicant);
    setPendingOfferStatus(status);
    let defaultMsg = "";
    if (status === "INTERVIEWING") {
      defaultMsg = `Congratulations! You have been selected for an interview for the position of ${job.jobTitle || "the given role"} at ${job.company || "our company"}. We will be in touch shortly with more details.`;
    } else if (status === "OFFERED") {
      defaultMsg = `Congratulations! We are thrilled to offer you the position of ${job.jobTitle || "the given role"} at ${job.company || "our company"}. Welcome to the team!`;
    } else if (status === "REJECTED") {
      defaultMsg = `Thank you for your interest in ${job.company || "our company"}. Unfortunately, we will not be moving forward with your application for the ${job.jobTitle || "the given role"} position at this time. We wish you the best in your job search.`;
    }

    setEmailMessage(defaultMsg);

    if (status === "INTERVIEWING") {
      setInterviewOpen(true);
    } else {
      setEmailDialogOpen(true);
    }
  };

  const handleOfferSubmit = (status: string) => {
    if (!selectedApplicant) return;

    let payload: any = {
      id: jobId,
      applicantId: selectedApplicant.applicantId,
      applicationStatus: status,
      emailMessage: emailMessage,
    };

    if (status === "INTERVIEWING") {
      const combined = new Date(`${date}T${time}`);
      payload = { ...payload, interviewTime: combined };
    }

    changeAppStatus(payload)
      .then(() => {
        if (status === "INTERVIEWING")
          successNotification(
            "Interview Scheduled",
            "Interview scheduled & email sent successfully 👍",
          );
        else if (status === "OFFERED")
          successNotification("Hired", "Offer & email sent successfully 👏");
        else
          successNotification(
            "Rejected",
            "Application Rejected & email sent 🙏",
          );
        fetchFilteredData();
      })
      .catch((err: any) => {
        console.error(err);
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
          <div className="flex items-center gap-6">
            <div className="text-right flex flex-col items-end justify-center">
              <div className="text-3xl font-bold text-primary">
                {job.applicants?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Total Applicants
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block"></div>

            <Link
              href={`/post-job/${job.id}`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary/10 text-primary hover:bg-primary/20 h-10 px-5 shadow-xs border border-primary/20"
            >
              <IconEdit size={18} />
              Edit Job
            </Link>
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
          <div className="mb-6 flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold">Applicant Review Pipeline</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {applicants.length} of {totalElements} filtered
                candidates
              </p>
            </div>

            {/* Status Tab Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Applied", value: "APPLIED", color: "bg-blue-500" },
                {
                  label: "Interviewing",
                  value: "INTERVIEWING",
                  color: "bg-yellow-500",
                },
                { label: "Offered", value: "OFFERED", color: "bg-green-500" },
                { label: "Rejected", value: "REJECTED", color: "bg-red-500" },
                { label: "All", value: "", color: "bg-muted-foreground" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(0);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border",
                    statusFilter === tab.value
                      ? `${tab.color} text-white border-transparent shadow-md scale-105`
                      : "bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
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
              {/* 2-Column Grid of Compact Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-border transition-all duration-200 flex flex-col"
                    >
                      {/* Card Header: Avatar + Name + Status */}
                      <div className="p-5 flex items-start gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-muted shrink-0">
                          <AvatarImage
                            src={
                              applicant.picture
                                ? `data:image/jpeg;base64,${applicant.picture}`
                                : undefined
                            }
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-base font-bold text-foreground capitalize truncate">
                              {applicant.name}
                            </h3>
                            <Badge
                              className={cn(
                                "text-[10px] px-2 py-0.5 font-bold shrink-0",
                                applicant.applicationStatus === "APPLIED"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : applicant.applicationStatus ===
                                      "INTERVIEWING"
                                    ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                    : applicant.applicationStatus ===
                                          "OFFERED" ||
                                        applicant.applicationStatus === "HIRED"
                                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                                      : "bg-destructive/10 text-destructive border-destructive/20",
                              )}
                            >
                              {applicant.applicationStatus}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground capitalize truncate mb-1.5">
                            {applicant.jobTitle || "Candidate"}
                          </p>

                          {/* Info Row */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {applicant.email && (
                              <span className="flex items-center gap-1 truncate">
                                <IconMail size={12} /> {applicant.email}
                              </span>
                            )}
                            {applicant.location && (
                              <span className="flex items-center gap-1">
                                <IconMapPin size={12} /> {applicant.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Match + Skills */}
                      <div className="px-5 pb-3">
                        {/* Match Score */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">
                              ✨ AI Match
                            </span>
                            {isMatchScored && (
                              <Badge
                                className={cn(
                                  "text-xs px-2 py-0.5 font-bold",
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
                            <div className="flex gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px] font-semibold text-primary"
                                onClick={() => {
                                  setSelectedAiApplicant(applicant);
                                  setAiDialogOpen(true);
                                }}
                              >
                                View Report
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px]"
                                onClick={() =>
                                  handleScan(applicant.applicantId)
                                }
                                disabled={scanningId === applicant.applicantId}
                              >
                                {scanningId === applicant.applicantId
                                  ? "…"
                                  : "Rescan"}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleScan(applicant.applicantId)}
                              disabled={scanningId === applicant.applicantId}
                              className="h-7 text-[11px] bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                            >
                              {scanningId === applicant.applicantId ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Scanning
                                </>
                              ) : (
                                "Run AI Scan"
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Short AI Explanation */}
                        {isMatchScored && applicant.aiExplanation && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 bg-muted/30 rounded-lg p-2.5 border border-border/30">
                            {applicant.aiExplanation}
                          </p>
                        )}

                        {/* Skills pills */}
                        {applicant.candidateSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {applicant.candidateSkills
                              .slice(0, 5)
                              .map((s: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded-md"
                                >
                                  {s}
                                </span>
                              ))}
                            {applicant.candidateSkills.length > 5 && (
                              <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
                                +{applicant.candidateSkills.length - 5}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Interview time */}
                        {applicant.interviewTime && (
                          <div className="flex items-center gap-2 text-primary text-xs font-medium bg-primary/10 p-2 rounded-lg border border-primary/20 mb-3">
                            <IconCalendarMonth size={14} />
                            {formatInterviewTime(applicant.interviewTime)}
                          </div>
                        )}

                        {/* Resume link */}
                        <Button
                          variant="link"
                          onClick={() => openBase64PDF(applicant.resume)}
                          className="h-auto p-0 text-primary font-semibold text-xs"
                        >
                          View Resume →
                        </Button>
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-muted/50 px-5 py-3 border-t border-border/50 flex items-center gap-2 mt-auto">
                        {applicant.applicationStatus === "APPLIED" && (
                          <>
                            <Button
                              onClick={() =>
                                handleOfferClick(applicant, "REJECTED")
                              }
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs border-destructive/50 text-destructive hover:bg-destructive/10 font-semibold"
                            >
                              Reject
                            </Button>
                            <Button
                              onClick={() =>
                                handleOfferClick(applicant, "INTERVIEWING")
                              }
                              size="sm"
                              className="flex-1 h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Schedule Interview
                            </Button>
                          </>
                        )}

                        {applicant.applicationStatus === "INTERVIEWING" && (
                          <>
                            <Button
                              onClick={() =>
                                handleOfferClick(applicant, "REJECTED")
                              }
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs border-destructive/50 text-destructive hover:bg-destructive/10 font-semibold"
                            >
                              Reject
                            </Button>
                            <Button
                              onClick={() =>
                                handleOfferClick(applicant, "OFFERED")
                              }
                              size="sm"
                              className="flex-1 h-8 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white"
                            >
                              Hire / Offer
                            </Button>
                          </>
                        )}

                        {(applicant.applicationStatus === "OFFERED" ||
                          applicant.applicationStatus === "HIRED" ||
                          applicant.applicationStatus === "REJECTED") && (
                          <div className="text-xs text-muted-foreground font-medium flex-1 text-center">
                            Decision made ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

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

      {/* ══ AI Scan Results Dialog ══ */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl w-[95vw] sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-border/20 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-foreground font-bold text-xl flex items-center gap-2">
                ✨ AI Resume Analysis - {selectedAiApplicant?.name}
              </DialogTitle>
              {selectedAiApplicant?.matchScore !== undefined &&
                selectedAiApplicant?.matchScore !== null && (
                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-bold border",
                      selectedAiApplicant.matchScore >= 80
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : selectedAiApplicant.matchScore >= 50
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20",
                    )}
                  >
                    {selectedAiApplicant.matchScore}% Match
                  </div>
                )}
              {selectedAiApplicant?.fairnessScore !== undefined &&
                selectedAiApplicant?.fairnessScore !== null && (
                  <div className="px-4 py-1.5 rounded-full text-sm font-bold border bg-purple-500/10 text-purple-500 border-purple-500/20 ml-2">
                    ⚖️ Fairness: {selectedAiApplicant.fairnessScore}%
                  </div>
                )}
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-6 pt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                Detailed Explanation
              </h4>
              <div className="text-sm text-foreground leading-relaxed bg-muted/20 p-5 rounded-xl border border-border/20">
                {selectedAiApplicant?.aiExplanation
                  ?.split("\n")
                  .map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-2 last:mb-0">
                      {paragraph || <br />}
                    </p>
                  ))}
              </div>
            </div>

            {/* AI Fairness Explanation */}
            {selectedAiApplicant?.fairnessScore !== undefined &&
              selectedAiApplicant?.fairnessScore !== null && (
                <div className="space-y-2 mt-2">
                  <h4 className="text-sm font-semibold text-purple-500 tracking-wide uppercase flex items-center gap-1.5">
                    ⚖️ Ethical AI / Fairness Report
                    <span className="bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded text-xs">
                      Score: {selectedAiApplicant.fairnessScore}%
                    </span>
                  </h4>
                  <div className="text-sm text-muted-foreground leading-relaxed bg-purple-500/5 p-4 rounded-xl border border-purple-500/20">
                    <p className="mb-2 text-xs font-medium text-purple-400">
                      ✅ GDPR Compliant · PII Redacted Before Analysis
                    </p>
                    <p>
                      {selectedAiApplicant.fairnessExplanation ||
                        "Candidate was evaluated objectively based purely on technical skills and experience without demographic bias."}
                    </p>
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500/80" />
                  Candidate Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAiApplicant?.candidateSkills &&
                  selectedAiApplicant.candidateSkills.length > 0 ? (
                    selectedAiApplicant.candidateSkills.map(
                      (skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium rounded-md"
                        >
                          {skill}
                        </span>
                      ),
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No candidate skills found
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Schedule Interview Dialog ══ */}
      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl sm:max-w-md">
          <DialogHeader className="border-b border-border/20 pb-4">
            <DialogTitle className="text-foreground font-bold text-lg">
              Schedule Interview
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-medium text-sm">
                Date
              </Label>
              <Input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-medium text-sm">
                Time
              </Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
              />
            </div>

            <div className="space-y-1.5 mt-2">
              <Label className="text-muted-foreground font-medium text-sm">
                Custom Email Message
              </Label>
              <Textarea
                rows={5}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground resize-none"
              />
            </div>

            <Button
              onClick={() => {
                handleOfferSubmit("INTERVIEWING");
                setInterviewOpen(false);
              }}
              disabled={!date || !time}
              className="w-full mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
            >
              Confirm Interview & Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Custom Email Action Dialog ══ */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl sm:max-w-xl">
          <DialogHeader className="border-b border-border/20 pb-4">
            <DialogTitle className="text-foreground font-bold text-lg">
              Review Email Message
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="space-y-1.5 mt-2">
              <Label className="text-muted-foreground font-medium text-sm">
                Custom Email Content
              </Label>
              <Textarea
                rows={6}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This email will be sent along with an in-app notification
                confirming your decision.
              </p>
            </div>
            <Button
              onClick={() => {
                handleOfferSubmit(pendingOfferStatus);
                setEmailDialogOpen(false);
              }}
              className={cn(
                "w-full mt-2 font-semibold",
                pendingOfferStatus === "REJECTED"
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground",
              )}
            >
              Update Status & Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};;
