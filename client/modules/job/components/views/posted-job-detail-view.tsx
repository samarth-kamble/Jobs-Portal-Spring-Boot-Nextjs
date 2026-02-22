"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  IconBriefcase,
  IconMapPin,
  IconClock,
  IconCurrencyRupee,
  IconChevronLeft,
  IconBuilding,
  IconUsers,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react";
import { getJob } from "../../server/job-service";
import { SectionHeader } from "./post-job-view"; // Reusing SectionHeader

export const PostedJobDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.jobId as string;
  const user = useSelector((state: any) => state.user);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getJob(id)
        .then((res: any) => {
          setJob(res);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background py-12 flex flex-col items-center justify-center text-center px-4">
        <IconBriefcase size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">The job you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-11/12 max-w-7xl mx-auto space-y-6">

        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
        >
          <div className="p-1 rounded-full bg-muted/20 group-hover:bg-muted/40 transition-colors">
            <IconChevronLeft size={16} />
          </div>
          Back to previous
        </button>

        {/* ── Page Header ── */}
        <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
            <div className="flex gap-5 items-start">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                 <IconBuilding size={32} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    {job.jobStatus || 'ACTIVE'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconClock size={12} />
                    Posted {new Date(job.postTime).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1">
                  {job.jobTitle}
                </h1>
                <p className="text-lg text-foreground/80 font-medium">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Actions for creator */}
            {user?.id === job.postedBy && (
              <Button
                onClick={() => router.push(`/post-job/${job.id}`)}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shrink-0 w-full md:w-auto"
              >
                Edit Listing
              </Button>
            )}
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <IconMapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <IconBriefcase size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Job Type</p>
                <p className="text-sm font-medium text-foreground">{job.jobType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <IconRosetteDiscountCheck size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium text-foreground">{job.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <IconCurrencyRupee size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Package Options</p>
                <p className="text-sm font-medium text-foreground">{job.packageOffered} LPA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 md:p-8 shadow-lg">
              <SectionHeader
                accent="bg-primary/10"
                icon={IconBriefcase}
                title="Job Description"
                subtitle="Detailed roles and responsibilities"
              />

              <div
                className="prose prose-sm md:prose-base prose-invert max-w-none text-muted-foreground marker:text-primary prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: job.description || '' }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Box */}
            <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 shadow-lg">
              <SectionHeader
                accent="bg-primary/10"
                icon={IconUsers}
                title="About Role"
                subtitle="Brief summary"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.about}
              </p>
            </div>

            {/* Skills Box */}
            <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 shadow-lg">
              <SectionHeader
                accent="bg-primary/10"
                icon={IconBriefcase}
                title="Required Skills"
                subtitle="Key competencies"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skillsRequired?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
