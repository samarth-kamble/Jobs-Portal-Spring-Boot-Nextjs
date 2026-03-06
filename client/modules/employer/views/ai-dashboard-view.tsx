"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobPostedBy } from "@/modules/job/server/job-service";
import { Loader2, BrainCircuit, ShieldCheck, TrendingUp, Users, BarChart3 } from "lucide-react";
import {
  MatchScoreDistributionChart,
  SkillGapChart,
  HiringSuccessChart,
} from "../components/dashboard-charts";

/* ═══════════════════════════════════════════════════════════════════
 * AI Accuracy Dashboard View
 * Aggregates AI-generated analytics across all employer jobs:
 *   - Match Score Distribution
 *   - Skill Gap Trends
 *   - Hiring Success Patterns
 * ═══════════════════════════════════════════════════════════════════ */

export default function AIDashboardView() {
  const user = useSelector((state: any) => state.user);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getJobPostedBy(user.id)
        .then((res) => setJobs(res || []))
        .catch((err) => console.error("Error fetching jobs:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  /* ── Collect all applicants across every job ── */
  const allApplicants: any[] = [];
  jobs.forEach((job) => {
    if (job.applicants && Array.isArray(job.applicants)) {
      job.applicants.forEach((app: any) => {
        allApplicants.push({
          ...app,
          jobSkillsRequired: job.skillsRequired || [],
        });
      });
    }
  });

  /* Only applicants that have been AI-scanned (have a matchScore) */
  const scannedApplicants = allApplicants.filter(
    (a) => a.matchScore !== undefined && a.matchScore !== null
  );

  /* ────────────────────────────────────────────────────────────────
   * KPI METRICS
   * ──────────────────────────────────────────────────────────────── */
  const totalScanned = scannedApplicants.length;
  const avgMatchScore =
    totalScanned > 0
      ? Math.round(
          scannedApplicants.reduce((sum: number, a: any) => sum + (a.matchScore || 0), 0) /
            totalScanned
        )
      : 0;

  /* Fairness compliance = % of scanned applicants with a fairness score */
  const fairnessCompliant = scannedApplicants.filter(
    (a) => a.fairnessScore !== undefined && a.fairnessScore !== null
  ).length;
  const fairnessRate =
    totalScanned > 0 ? Math.round((fairnessCompliant / totalScanned) * 100) : 0;

  /* Hired with high match (>=70) */
  const hiredHighMatch = scannedApplicants.filter(
    (a) =>
      (a.applicationStatus === "OFFERED" || a.applicationStatus === "HIRED") &&
      a.matchScore >= 70
  ).length;

  /* ────────────────────────────────────────────────────────────────
   * 1. MATCH SCORE DISTRIBUTION
   * Bucket applicants into score ranges with color coding.
   * ──────────────────────────────────────────────────────────────── */
  const scoreBuckets = [
    { range: "0–20", min: 0, max: 20, fill: "var(--color-chart-4)" },
    { range: "21–40", min: 21, max: 40, fill: "var(--color-chart-5)" },
    { range: "41–60", min: 41, max: 60, fill: "var(--color-chart-3)" },
    { range: "61–80", min: 61, max: 80, fill: "var(--color-chart-2)" },
    { range: "81–100", min: 81, max: 100, fill: "var(--color-chart-1)" },
  ];

  const matchScoreData = scoreBuckets.map((bucket) => ({
    range: bucket.range,
    count: scannedApplicants.filter(
      (a) => a.matchScore >= bucket.min && a.matchScore <= bucket.max
    ).length,
    fill: bucket.fill,
  }));

  /* ────────────────────────────────────────────────────────────────
   * 2. SKILL GAP TRENDS
   * Compare required skills (demand) vs candidate skills (supply).
   * ──────────────────────────────────────────────────────────────── */
  const requiredSkillsMap: Record<string, number> = {};
  const candidateSkillsMap: Record<string, number> = {};

  /* Count required skills across all jobs */
  jobs.forEach((job) => {
    if (job.skillsRequired && Array.isArray(job.skillsRequired)) {
      job.skillsRequired.forEach((skill: string) => {
        const normalized = skill.trim();
        requiredSkillsMap[normalized] = (requiredSkillsMap[normalized] || 0) + 1;
      });
    }
  });

  /* Count candidate skills from scanned applicants */
  scannedApplicants.forEach((app) => {
    if (app.candidateSkills && Array.isArray(app.candidateSkills)) {
      app.candidateSkills.forEach((skill: string) => {
        const normalized = skill.trim();
        candidateSkillsMap[normalized] = (candidateSkillsMap[normalized] || 0) + 1;
      });
    }
  });

  /* Merge into a single dataset, sorted by demand (required count) */
  const allSkills = new Set([
    ...Object.keys(requiredSkillsMap),
    ...Object.keys(candidateSkillsMap),
  ]);
  const skillGapData = Array.from(allSkills)
    .map((skill) => ({
      skill,
      required: requiredSkillsMap[skill] || 0,
      candidate: candidateSkillsMap[skill] || 0,
    }))
    .sort((a, b) => b.required - a.required)
    .slice(0, 10); // top 10 skills

  /* ────────────────────────────────────────────────────────────────
   * 3. HIRING SUCCESS PATTERNS
   * Cross-reference applicationStatus with matchScore ranges.
   * ──────────────────────────────────────────────────────────────── */
  const hiringRanges = [
    { range: "0–40 (Low)", min: 0, max: 40 },
    { range: "41–70 (Medium)", min: 41, max: 70 },
    { range: "71–100 (High)", min: 71, max: 100 },
  ];

  const hiringSuccessData = hiringRanges.map((r) => {
    const inRange = scannedApplicants.filter(
      (a) => a.matchScore >= r.min && a.matchScore <= r.max
    );
    return {
      range: r.range,
      interviewing: inRange.filter((a) => a.applicationStatus === "INTERVIEWING").length,
      hired: inRange.filter(
        (a) => a.applicationStatus === "OFFERED" || a.applicationStatus === "HIRED"
      ).length,
      rejected: inRange.filter((a) => a.applicationStatus === "REJECTED").length,
    };
  });

  /* ────────────────────────────────────────────────────────────────
   * RENDER
   * ──────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Loading AI analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Accuracy Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Analytics on AI match scoring, skill gaps, and hiring success
              patterns across all your job listings.
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Total AI Scans"
          value={totalScanned}
          accent="text-blue-500"
          bg="bg-blue-500/10"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Match Score"
          value={`${avgMatchScore}%`}
          accent="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <KPICard
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Fairness Compliance"
          value={`${fairnessRate}%`}
          accent="text-purple-500"
          bg="bg-purple-500/10"
        />
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="High-Score Hires"
          value={hiredHighMatch}
          accent="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      {totalScanned > 0 ? (
        <div className="space-y-8">
          {/* Row 1: Match Score Distribution (full width) */}
          <MatchScoreDistributionChart data={matchScoreData} />

          {/* Row 2: Skill Gap + Hiring Success */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillGapChart data={skillGapData} />
            <HiringSuccessChart data={hiringSuccessData} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BrainCircuit className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No AI Scan Data Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Run AI Resume Scans on applicants from the Job Analytics page. Once
            candidates are scanned, your AI accuracy charts and insights will
            appear here.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Reusable KPI Card ── */
function KPICard({
  icon,
  label,
  value,
  accent,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-xl">
      <div
        className={`p-3 rounded-lg ${bg} ${accent} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  );
}
