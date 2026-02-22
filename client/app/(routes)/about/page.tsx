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
   Animated counter hook
───────────────────────────────────────────── */
const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ─────────────────────────────────────────────
   Intersection observer hook
───────────────────────────────────────────── */
const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
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
   Stat card
───────────────────────────────────────────── */
const StatCard = ({
  target,
  suffix,
  label,
  icon: Icon,
  delay,
  started,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: any;
  delay: string;
  started: boolean;
}) => {
  const count = useCounter(target, 2000, started);
  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl border border-border/20 bg-muted/10 backdrop-blur-sm",
        "hover:border-primary/40 hover:bg-primary/5 transition-all duration-500",
        "opacity-0 translate-y-6",
        started && "animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards"
      )}
      style={{ animationDelay: delay, animationDuration: "0.6s" }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl w-fit mb-4">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="text-4xl font-black text-foreground tracking-tight mb-1">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Team member card
───────────────────────────────────────────── */
const TeamCard = ({
  name,
  role,
  bio,
  avatar,
  linkedin,
  twitter,
  delay,
  started,
}: {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  twitter?: string;
  delay: string;
  started: boolean;
}) => (
  <div
    className={cn(
      "group relative border border-border/20 rounded-2xl bg-muted/10 backdrop-blur-sm p-6 overflow-hidden",
      "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
      "opacity-0 translate-y-8",
      started && "animate-in fade-in slide-in-from-bottom-6 fill-mode-forwards"
    )}
    style={{ animationDelay: delay, animationDuration: "0.7s" }}
  >
    {/* Glow blob */}
    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative flex items-start gap-4">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-14 h-14 rounded-full ring-2 ring-border/30 group-hover:ring-primary/40 transition-colors overflow-hidden bg-primary/20">
          <img src={avatar} alt={name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-lg">
            {name.split(" ").map((n) => n[0]).join("")}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground text-base capitalize">{name}</div>
        <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">{role}</div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{bio}</p>

        {/* Social links */}
        <div className="flex gap-2 mt-3">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer"
              className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors">
              <IconBrandLinkedin size={16} />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noreferrer"
              className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors">
              <IconBrandTwitter size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Value card
───────────────────────────────────────────── */
const ValueCard = ({
  icon: Icon,
  title,
  desc,
  accent,
}: {
  icon: any;
  title: string;
  desc: string;
  accent: string;
}) => (
  <div className="group relative p-6 rounded-2xl border border-border/20 bg-muted/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${accent} rounded-2xl pointer-events-none`} />
    <div className="relative">
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Timeline item
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
  <div className={cn("flex gap-6 items-start", align === "right" && "flex-row-reverse")}>
    <div className={cn("flex-1 pb-8", align === "right" ? "text-left" : "text-right")}>
      <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-2">
        {year}
      </div>
      <h4 className="text-foreground font-bold text-base mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
    {/* Dot */}
    <div className="relative flex flex-col items-center shrink-0 w-4">
      <div className="w-4 h-4 rounded-full bg-primary border-4 border-mine-shaft-950 ring-2 ring-primary/30 z-10 mt-1" />
      <div className="w-px flex-1 bg-linear-to-b from-primary/40 to-border/20" />
    </div>
    <div className="flex-1" />
  </div>
);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Co-Founder & CEO",
    bio: "Former engineering lead at Infosys. Passionate about connecting talent with opportunity and building the future of work in India.",
    avatar: "/team/arjun.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & CTO",
    bio: "Full-stack architect with 10+ years building scalable platforms. Led tech at two YC-backed startups before founding Joblify.",
    avatar: "/team/priya.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Rahul Desai",
    role: "Head of Product",
    bio: "Product strategist focused on reducing friction between job seekers and employers. Former PM at Naukri and LinkedIn India.",
    avatar: "/team/rahul.jpg",
    linkedin: "#",
  },
  {
    name: "Sneha Iyer",
    role: "Head of Growth",
    bio: "Growth hacker who scaled three D2C brands to 10× revenue. Now obsessed with helping job seekers find their perfect role faster.",
    avatar: "/team/sneha.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Vikram Nair",
    role: "Lead Engineer",
    bio: "Systems engineer who believes great software is invisible. Built the recommendation engine powering Joblify's job matching.",
    avatar: "/team/vikram.jpg",
    linkedin: "#",
  },
  {
    name: "Ananya Bose",
    role: "Design Lead",
    bio: "UX designer with a background in cognitive psychology. Crafts experiences that feel effortless and delightfully clear.",
    avatar: "/team/ananya.jpg",
    linkedin: "#",
    twitter: "#",
  },
];

const VALUES = [
  {
    icon: IconTargetArrow,
    title: "Precision Matching",
    desc: "We don't just list jobs. Our intelligent matching surfaces the right opportunity for every candidate's unique profile and ambition.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
  {
    icon: IconShieldCheck,
    title: "Verified Listings",
    desc: "Every employer and job posting is manually reviewed. We maintain a zero-tolerance policy on fake listings and misleading roles.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
  {
    icon: IconHeart,
    title: "Candidate First",
    desc: "The job seeker is at the center of everything we build. From transparent salaries to employer ratings — power belongs to the talent.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
  {
    icon: IconWorld,
    title: "Opportunity for All",
    desc: "Geography, background, or educational pedigree should never be a barrier. We actively surface opportunities for emerging talent.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
  {
    icon: IconCode,
    title: "Built in Public",
    desc: "We share our roadmap, our mistakes, and our wins openly. Our community shapes what Joblify becomes.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
  {
    icon: IconRocket,
    title: "Always Iterating",
    desc: "Every week, we ship improvements driven by real user feedback. The best version of Joblify hasn't been built yet.",
    accent: "bg-linear-to-br from-primary/5 to-transparent",
  },
];

const TIMELINE = [
  { year: "2021", title: "The Idea", desc: "Frustrated by outdated job boards, Arjun and Priya sketched Joblify on a whiteboard in a Bengaluru café." },
  { year: "2022", title: "First Launch", desc: "Beta launched with 200 hand-curated job listings and 1,000 early-access users. Waitlist hit 10,000 in a week." },
  { year: "2023", title: "Seed Funding", desc: "Raised ₹4Cr seed round. Expanded team to 12 people and launched employer dashboard with ATS integrations." },
  { year: "2024", title: "100K Milestone", desc: "Crossed 100,000 active candidates and 5,000 verified employers. Launched AI-powered resume feedback." },
  { year: "2025", title: "Series A", desc: "Raised $3M Series A. Launched Find Talent for recruiters and expanded to 15 Indian cities plus remote-first roles." },
];

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
const AboutPage = () => {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const { ref: teamRef, inView: teamInView } = useInView(0.1);

  return (
    <div className="min-h-screen bg-linear-to-b from-mine-shaft-950 via-mine-shaft-900 to-mine-shaft-950 overflow-x-hidden">

      {/* ── Noise texture overlay ── */}
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
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">

          {/* Animated background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
            {/* Geometric lines */}
            <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left column */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <IconSparkles size={13} />
                  Our Story
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards">
                  We're
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Joblify.
                    </span>
                    {/* Underline accent */}
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/20 rounded-full" />
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-forwards">
                  We're on a mission to make finding the right job — and the right talent — feel
                  <em className="text-foreground not-italic font-semibold"> effortless</em>. Not exhausting. Not
                  overwhelming. Just clear, human, and fast.
                </p>

                <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
                  <Link href="/find-jobs">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all">
                      Explore Jobs
                      <IconArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link href="/find-talent">
                    <Button
                      variant="outline"
                      className="gap-2 border-border/40 text-foreground hover:border-primary/40 hover:bg-primary/5 px-6 py-5 text-base transition-all"
                    >
                      Hire Talent
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column — feature callouts */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  { icon: IconBriefcase, label: "Verified Jobs", val: "50K+" },
                  { icon: IconUsers, label: "Active Talent", val: "200K+" },
                  { icon: IconBuildingSkyscraper, label: "Companies", val: "5K+" },
                  { icon: IconStar, label: "Avg. Rating", val: "4.8★" },
                ].map(({ icon: Icon, label, val }, i) => (
                  <div
                    key={label}
                    className="p-5 rounded-2xl border border-border/20 bg-muted/10 backdrop-blur-sm hover:border-primary/30 transition-all animate-in fade-in slide-in-from-right-4 fill-mode-forwards"
                    style={{ animationDelay: `${0.2 + i * 0.1}s`, animationDuration: "0.6s" }}
                  >
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl w-fit mb-3">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-black text-foreground">{val}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            MISSION STATEMENT
        ════════════════════════════════════ */}
        <section className="py-24 border-y border-border/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">
              Our Mission
            </p>
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              "To{" "}
              <span className="text-primary">eliminate the friction</span>{" "}
              between great people and great opportunities — for everyone, everywhere."
            </blockquote>
          </div>
        </section>


        {/* ════════════════════════════════════
            VALUES
        ════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">What drives us</p>
                <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                  Our values,<br />not just words.
                </h2>
              </div>
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed md:text-right">
                These aren't posted on a wall. They show up in every product decision, every customer interaction, every line of code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v) => (
                <ValueCard key={v.title} {...v} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            TIMELINE
        ════════════════════════════════════ */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">How we got here</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Our journey</h2>
          </div>

          <div className="relative">
            {/* Central line (desktop) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/40 via-border/30 to-transparent" />

            {/* Mobile: simple vertical list */}
            <div className="md:hidden space-y-8">
              {TIMELINE.map(({ year, title, desc }) => (
                <div key={year} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 mt-1.5" />
                    <div className="w-px flex-1 bg-border/30 mt-1" />
                  </div>
                  <div className="pb-6">
                    <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-2">{year}</div>
                    <h4 className="text-foreground font-bold mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: alternating left/right */}
            <div className="hidden md:block">
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
          </div>
        </section>

        {/* ════════════════════════════════════
            OPEN ROLES BANNER
        ════════════════════════════════════ */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-10 md:p-14">
            {/* Decoration */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  We're hiring
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
                  Join us and build<br />
                  <span className="text-primary">the future of work.</span>
                </h2>
                <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                  We're a remote-first team that values autonomy, craft, and deep focus. If you care about meaningful
                  work and real impact, let's talk.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/find-jobs">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] transition-all">
                    View Open Roles
                    <IconArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="h-24" />

      </div>
    </div>
  );
};

export default AboutPage;