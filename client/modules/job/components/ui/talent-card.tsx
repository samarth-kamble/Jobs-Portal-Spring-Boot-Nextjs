"use client";

import {
  IconCalendarMonth,
  IconHeart,
  IconMapPin,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getProfile } from "@/modules/profile/server/profile-service";
import { changeAppStatus, analyzeResume } from "../../server/job-service";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";
import { formatInterviewTime } from "@/lib/format-interview-time";
import { openBase64PDF } from "@/lib/open-base64-pdf";

export const TalentCard = (props: any) => {
  const params = useParams();
  const id = (params?.jobId || params?.id || props.jobId) as string;

  /* replaces useDisclosure() × 2 */
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [profile, setProfile] = useState<any>({});
  const [isLiked, setIsLiked] = useState(false);
  const [scanning, setScanning] = useState(false);

  // New Custom States
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [pendingOfferStatus, setPendingOfferStatus] = useState("");
  const [aiResultsOpen, setAiResultsOpen] = useState(false);

  const handleScan = () => {
    setScanning(true);
    analyzeResume(id, props.applicantId)
      .then((res) => {
        setScanning(false);
        successNotification(
          "Scan Complete",
          "Resume successfully analyzed by AI ✨",
        );
        window.location.reload();
      })
      .catch((err) => {
        setScanning(false);
        errorNotification("Error", "Failed to scan resume with AI");
      });
  };

  useEffect(() => {
    if (props.applicantId) {
      getProfile(props.applicantId)
        .then((res) => setProfile(res))
        .catch((err) => console.log(err));
    } else {
      setProfile(props);
    }
  }, [props.applicantId, props.id, props.name]); // Avoid passing the entire `props` object to stop reference loops

  /* Avatar initials fallback */
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  /* Min date for date picker */
  const todayStr = new Date().toISOString().split("T")[0];

  const handleOfferClick = (status: string) => {
    setPendingOfferStatus(status);
    let defaultMsg = "";
    if (status === "INTERVIEWING") {
      defaultMsg = `Congratulations! You have been selected for an interview for the position of ${props.jobTitle || "the given role"} at ${props.company || "our company"}. We will be in touch shortly with more details.`;
    } else if (status === "OFFERED") {
      defaultMsg = `Congratulations! We are thrilled to offer you the position of ${props.jobTitle || "the given role"} at ${props.company || "our company"}. Welcome to the team!`;
    } else if (status === "REJECTED") {
      defaultMsg = `Thank you for your interest in ${props.company || "our company"}. Unfortunately, we will not be moving forward with your application for the ${props.jobTitle || "the given role"} position at this time. We wish you the best in your job search.`;
    }

    setEmailMessage(defaultMsg);

    if (status === "INTERVIEWING") {
      setInterviewOpen(true);
    } else {
      setEmailDialogOpen(true);
    }
  };

  const handleOfferSubmit = (status: string) => {
    let interview: any = {
      id,
      applicantId: profile?.id,
      applicationStatus: status,
      emailMessage: emailMessage,
    };

    if (status === "INTERVIEWING") {
      /* replaces Mantine date.setHours logic — combine native date + time */
      const combined = new Date(`${date}T${time}`);
      interview = { ...interview, interviewTime: combined };
    }

    changeAppStatus(interview)
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
        window.location.reload();
      })
      .catch((err: any) => {
        console.log(err);
        errorNotification(
          "Error",
          err?.response?.data?.errorMessage || "An error occurred",
        );
      });
  };

  return (
    <>
      {/* ══ Card ══ */}
      <div className="group relative border border-border/20 rounded-2xl bg-muted/10 backdrop-blur-xl p-5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

        <div className="relative">
          {/* ── Header ── */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center flex-1 min-w-0">
              {/* Avatar glow ring + shadcn Avatar — replaces Mantine Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/30 transition-colors" />
                <Avatar className="relative h-12 w-12 border-2 border-border/40 group-hover:border-primary/40 transition-colors">
                  <AvatarImage
                    src={
                      profile?.picture
                        ? `data:image/jpeg;base64,${profile.picture}`
                        : undefined
                    }
                    alt={props.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-foreground truncate capitalize">
                  {props.name}
                </div>
                <div className="text-sm text-muted-foreground truncate capitalize">
                  {profile?.jobTitle}
                  {profile?.company && ` · ${profile.company}`}
                </div>
              </div>
            </div>

            {/* Like button */}
            <button
              onClick={() => setIsLiked((v) => !v)}
              className="p-2 hover:bg-muted/30 rounded-lg transition-colors shrink-0"
            >
              <IconHeart
                className={cn(
                  "transition-all",
                  isLiked
                    ? "text-primary fill-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
                stroke={1.5}
                size={22}
              />
            </button>
          </div>

          {/* ── Skills tags ── */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile?.skills
              ?.slice(0, 4)
              .map((skill: string, index: number) => (
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 hover:border-primary/40 transition-all capitalize"
                >
                  {skill}
                </div>
              ))}
          </div>

          {/* ── Match Score Badge ── */}
          {props.matchScore !== undefined && props.matchScore !== null && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAiResultsOpen(true)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border hover:scale-105 transition-transform cursor-pointer shadow-sm shadow-black/20",
                  props.matchScore >= 80
                    ? "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                    : props.matchScore >= 50
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20",
                )}
              >
                ✨ AI Match Score: {props.matchScore}% (Click to Details)
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleScan}
                disabled={scanning}
                className="h-7 text-xs px-2 py-0"
              >
                {scanning ? "Scanning..." : "Rescan"}
              </Button>
            </div>
          )}

          {/* About — replaces Mantine Text lineClamp={3} */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 text-justify">
            {profile?.about}
          </p>

          {/* Divider — replaces Mantine Divider variant="dashed" */}
          <Separator className="my-4 opacity-20 border-dashed" />

          {/* ── Experience / Interview ── */}
          <div className="flex justify-between items-center mb-4">
            {props.invited ? (
              <div className="flex gap-2 items-center text-sm text-primary font-medium">
                <IconCalendarMonth size={18} stroke={1.5} />
                <span>
                  Interview: {formatInterviewTime(props.interviewTime)}
                </span>
              </div>
            ) : (
              <>
                <div className="text-foreground font-semibold">
                  {props.totalExp ?? 1}{" "}
                  {(props.totalExp ?? 1) > 1 ? "Years" : "Year"} Exp
                </div>
                <div className="flex text-muted-foreground items-center gap-1.5">
                  <IconMapPin className="h-5 w-5" stroke={1.5} />
                  <span className="text-sm">{profile?.location}</span>
                </div>
              </>
            )}
          </div>

          <Separator className="my-4 opacity-20 border-dashed" />

          {/* ── Action Buttons ── */}
          <div className="flex gap-3">
            {props.posted ? (
              // EMPLOYER VIEW
              <>
                {props.applicationStatus === "APPLIED" &&
                (props.matchScore === undefined ||
                  props.matchScore === null ||
                  props.matchScore === 0) ? (
                  <Button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all font-semibold"
                  >
                    {scanning ? "Scanning..." : "✨ Scan Resume with AI"}
                  </Button>
                ) : props.applicationStatus === "APPLIED" ? (
                  <>
                    <Button
                      onClick={() => handleOfferClick("INTERVIEWING")}
                      variant="outline"
                      className="flex-1 border-primary/50 text-primary hover:bg-primary/10 transition-all font-semibold"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleOfferClick("REJECTED")}
                      variant="ghost"
                      className="flex-1 bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all font-semibold"
                    >
                      Reject
                    </Button>
                  </>
                ) : props.applicationStatus === "INTERVIEWING" ? (
                  <>
                    <Button
                      onClick={() => handleOfferClick("OFFERED")}
                      variant="outline"
                      className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Hire
                    </Button>
                    <Button
                      onClick={() => handleOfferClick("REJECTED")}
                      variant="ghost"
                      className="flex-1 bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all font-semibold"
                    >
                      Reject
                    </Button>
                  </>
                ) : props.applicationStatus === "OFFERED" ? (
                  <div className="w-full text-center py-2 rounded-md bg-green-500/10 text-green-500 font-bold border border-green-500/20">
                    HIRED 🎉
                  </div>
                ) : props.applicationStatus === "REJECTED" ? (
                  <div className="w-full text-center py-2 rounded-md bg-destructive/10 text-destructive font-bold border border-destructive/20">
                    REJECTED
                  </div>
                ) : null}
              </>
            ) : (
              // GENERAL USER/PUBLIC VIEW
              <>
                <Link
                  href={`/talent-profile/${profile?.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-border/40 text-foreground hover:bg-muted/20 hover:border-primary/40 transition-all"
                  >
                    Profile
                  </Button>
                </Link>
                <div className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
                    Message
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* View Application */}
          {(props.invited || props.posted) && (
            <Button
              onClick={() => setAppOpen(true)}
              className="w-full mt-3 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all font-semibold"
            >
              View Application
            </Button>
          )}
        </div>
      </div>

      {/* ══ Schedule Interview Dialog — replaces Mantine Modal ══ */}
      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl sm:max-w-md">
          <DialogHeader className="border-b border-border/20 pb-4">
            <DialogTitle className="text-foreground font-bold text-lg">
              Schedule Interview
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            {/* Date — replaces Mantine DateInput */}
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

            {/* Time — replaces Mantine TimeInput + ref.current.showPicker() */}
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

      {/* ══ Application Details Dialog — replaces Mantine Modal size="lg" ══ */}
      <Dialog open={appOpen} onOpenChange={setAppOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl sm:max-w-xl">
          <DialogHeader className="border-b border-border/20 pb-4">
            <DialogTitle className="text-foreground font-bold text-lg">
              Application Details
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-2">
            {[
              {
                label: "Email",
                content: (
                  <a
                    href={`mailto:${props.email}`}
                    className="text-primary hover:text-primary/80 hover:underline text-sm transition-colors"
                  >
                    {props.email}
                  </a>
                ),
              },
              {
                label: "Website",
                content: (
                  <a
                    href={props.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary/80 hover:underline text-sm transition-colors"
                  >
                    {props.website}
                  </a>
                ),
              },
              {
                label: "Resume",
                content: (
                  <button
                    onClick={() => openBase64PDF(props.resume)}
                    className="text-primary hover:text-primary/80 hover:underline text-sm transition-colors text-left"
                  >
                    View Resume — {props.name}
                  </button>
                ),
              },
              {
                label: "Cover Letter",
                content: (
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {props.coverLetter}
                  </p>
                ),
              },
              ...(props.matchScore !== undefined && props.matchScore !== null
                ? [
                    {
                      label: "✨ AI Interview Suitability",
                      content: (
                        <p className="text-foreground/80 text-sm leading-relaxed italic">
                          {props.aiExplanation || "Evaluating candidate fit..."}
                        </p>
                      ),
                    },
                  ]
                : []),
            ].map(({ label, content }) => (
              <div
                key={label}
                className="p-4 bg-muted/20 rounded-xl border border-border/20"
              >
                <div className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
                  {label}
                </div>
                {content}
              </div>
            ))}
          </div>

          {/* ── Match Score Badge ── */}
          {props.matchScore !== undefined && props.matchScore !== null && (
            <div className="mb-4">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                  props.matchScore >= 80
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : props.matchScore >= 50
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20",
                )}
              >
                ✨ AI Match Score: {props.matchScore}%
              </div>
            </div>
          )}
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

      {/* ══ AI Scan Results Dialog ══ */}
      <Dialog open={aiResultsOpen} onOpenChange={setAiResultsOpen}>
        <DialogContent className="bg-background border border-border/30 shadow-2xl rounded-2xl w-[95vw] sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-border/20 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-foreground font-bold text-xl flex items-center gap-2">
                ✨ AI Resume Analysis
              </DialogTitle>
              {props.matchScore !== undefined && props.matchScore !== null && (
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-bold border",
                    props.matchScore >= 80
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : props.matchScore >= 50
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20",
                  )}
                >
                  {props.matchScore}% Match
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-6 pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                AI Explanation
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/20">
                {props.aiExplanation || "Evaluating candidate fit..."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary/80" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {props.requiredSkills && props.requiredSkills.length > 0 ? (
                    props.requiredSkills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-muted border border-border/50 text-muted-foreground text-xs font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No required skills specified
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500/80" />
                  Candidate Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {props.candidateSkills && props.candidateSkills.length > 0 ? (
                    props.candidateSkills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))
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
    </>
  );
};
