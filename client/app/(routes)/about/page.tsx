"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconBriefcase,
  IconUsers,
  IconBuildingSkyscraper,
  IconRocket,
  IconShieldCheck,
  IconHeart,
  IconSparkles,
  IconArrowRight,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconStar,
  IconWorld,
  IconCode,
  IconTargetArrow,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Intersection observer hook
───────────────────────────────────────────── */
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

/* ─────────────────────────────────────────────
   Value card
───────────────────────────────────────────── */
const ValueCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="group relative p-5 rounded-xl border border-border/20 bg-muted/10 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 overflow-hidden">
    <div className="flex items-start gap-4">
      <div className="shrink-0 p-2.5 bg-primary/10 border border-primary/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Timeline item — alternating desktop, stacked mobile
───────────────────────────────────────────── */
const TimelineItem = ({
  year,
  title,
  desc,
  align,
}: {
  year: string;
  title: string;
  desc: string;
  align: "left" | "right";
}) => (
  <div
    className={cn(
      "flex gap-0 items-start",
      align === "right" && "flex-row-reverse",
    )}
  >
    {/* Content side */}
    <div
      className={cn(
        "flex-1 pb-10 px-8",
        align === "right" ? "text-left" : "text-right",
      )}
    >
      <span className="inline-block px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold tracking-widest mb-1.5">
        {year}
      </span>
      <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>

    {/* Dot + line */}
    <div className="flex flex-col items-center shrink-0 w-5">
      <div className="w-3.5 h-3.5 rounded-full bg-primary border-[3px] border-background ring-2 ring-primary/30 z-10 mt-1" />
      <div className="w-px flex-1 bg-linear-to-b from-primary/40 to-border/10 mt-1" />
    </div>

    {/* Empty side */}
    <div className="flex-1" />
  </div>
);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const VALUES = [
  {
    icon: IconTargetArrow,
    title: "Precision Matching",
    desc: "Our intelligent matching surfaces the right opportunity for every candidate's unique profile and ambition.",
  },
  {
    icon: IconShieldCheck,
    title: "Verified Listings",
    desc: "Every employer and job posting is manually reviewed. Zero-tolerance on fake listings and misleading roles.",
  },
  {
    icon: IconHeart,
    title: "Candidate First",
    desc: "Transparent salaries, employer ratings — the job seeker is at the center of everything we build.",
  },
  {
    icon: IconWorld,
    title: "Opportunity for All",
    desc: "Geography or background should never be a barrier. We actively surface opportunities for emerging talent.",
  },
  {
    icon: IconCode,
    title: "Built in Public",
    desc: "We share our roadmap, our mistakes, and our wins openly. Our community shapes what Joblify becomes.",
  },
  {
    icon: IconRocket,
    title: "Always Iterating",
    desc: "Every week we ship improvements driven by real user feedback. The best Joblify hasn't been built yet.",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "The Idea",
    desc: "Frustrated by outdated job boards, Arjun and Priya sketched Joblify on a whiteboard in a Bengaluru café.",
  },
  {
    year: "2022",
    title: "First Launch",
    desc: "Beta launched with 200 hand-curated listings and 1,000 early users. Waitlist hit 10,000 in a week.",
  },
  {
    year: "2023",
    title: "Seed Funding",
    desc: "Raised ₹4Cr seed round. Expanded to 12 people and launched employer dashboard with ATS integrations.",
  },
  {
    year: "2024",
    title: "100K Milestone",
    desc: "Crossed 100,000 active candidates and 5,000 verified employers. Launched AI-powered resume feedback.",
  },
  {
    year: "2025",
    title: "Series A",
    desc: "Raised $3M Series A. Launched Find Talent for recruiters and expanded to 15 cities plus remote-first roles.",
  },
];

const HERO_STATS = [
  { icon: IconBriefcase, label: "Verified Jobs", val: "50K+" },
  { icon: IconUsers, label: "Active Talent", val: "200K+" },
  { icon: IconBuildingSkyscraper, label: "Companies", val: "5K+" },
  { icon: IconStar, label: "Avg. Rating", val: "4.8★" },
];

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative z-10">
        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        <section className="relative flex items-center overflow-hidden pt-16 pb-12">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] animate-pulse" />
            <div
              className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-primary/6 rounded-full blur-[100px] animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — copy */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <IconSparkles size={12} />
                  Our Story
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.9] tracking-tight mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards">
                  We're{" "}
                  <span className="relative inline-block">
                    <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Joblify.
                    </span>
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-linear-to-r from-primary to-primary/20 rounded-full" />
                  </span>
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-forwards">
                  We're on a mission to make finding the right job and the right
                  talent feel{" "}
                  <em className="text-foreground not-italic font-semibold">
                    effortless
                  </em>
                  . Not exhausting. Not overwhelming. Just clear, human, and
                  fast.
                </p>

                <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
                  <Link href="/find-jobs">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-4 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all">
                      Explore Jobs
                      <IconArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link href="/find-talent">
                    <Button
                      variant="outline"
                      className="gap-2 border-border/40 hover:border-primary/40 hover:bg-primary/5 px-5 py-4 text-sm transition-all"
                    >
                      Hire Talent
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right — quick stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {HERO_STATS.map(({ icon: Icon, label, val }, i) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl border border-border/20 bg-muted/10 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all animate-in fade-in slide-in-from-right-4 fill-mode-forwards"
                    style={{
                      animationDelay: `${0.2 + i * 0.1}s`,
                      animationDuration: "0.6s",
                    }}
                  >
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg w-fit mb-2.5">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="text-2xl font-black text-foreground tracking-tight">
                      {val}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            MISSION
        ════════════════════════════════════ */}
        <section className="py-14 border-y border-border/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
              Our Mission
            </p>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-snug">
              "To <span className="text-primary">eliminate the friction</span>{" "}
              between great people and great opportunities for everyone,
              everywhere."
            </blockquote>
          </div>
        </section>

        {/* ════════════════════════════════════
            VALUES
        ════════════════════════════════════ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
                  What drives us
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                  Our values,
                  <br />
                  not just words.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VALUES.map((v) => (
                <ValueCard key={v.title} {...v} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            TIMELINE
        ════════════════════════════════════ */}
        <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
              How we got here
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Our journey
            </h2>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-6">
            {TIMELINE.map(({ year, title, desc }) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 mt-1" />
                  <div className="w-px flex-1 bg-border/30 mt-1" />
                </div>
                <div className="pb-4">
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold tracking-widest mb-1">
                    {year}
                  </span>
                  <h4 className="text-sm font-bold text-foreground mb-0.5">
                    {title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop — alternating */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/40 via-border/30 to-transparent" />
            {TIMELINE.map(({ year, title, desc }, i) => (
              <TimelineItem
                key={year}
                year={year}
                title={title}
                desc={desc}
                align={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
            WE'RE HIRING BANNER
        ════════════════════════════════════ */}
        <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
            {/* Decorations */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  We're hiring
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 leading-tight">
                  Join us and build
                  <br />
                  <span className="text-primary">the future of work.</span>
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  We're a remote-first team that values autonomy, craft, and
                  deep focus. If you care about meaningful work and real impact,
                  let's talk.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/find-jobs">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] transition-all">
                    View Open Roles
                    <IconArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;