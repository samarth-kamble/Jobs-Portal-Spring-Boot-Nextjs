"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { getJob } from "@/modules/job/server/job-service";
import ApplyJobCompany from "../ui/apply-job-company";

interface ApplyJobProps {
  params: Promise<{ id: string }>;
}

const ApplyJob = ({ params }: ApplyJobProps) => {
  const router = useRouter();
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      getJob(id)
        .then((res) => {
          setJob(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background relative mt-16">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="px-6 pt-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-accent hover:border-primary/40 transition-all duration-200 backdrop-blur-sm shadow-sm z-10 relative"
          >
            <IconArrowLeft size={18} stroke={1.5} />
            Back to Job
          </button>
        </div>

        {/* Main Content */}
        <div className="relative">
          {loading ? (
             <div className="flex items-center justify-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Loading job details...</p>
              </div>
            </div>
          ) : job ? (
            <ApplyJobCompany {...job} />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="p-8 bg-card border border-border rounded-2xl shadow-lg inline-block">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Job Not Found</h3>
                  <p className="text-muted-foreground mb-6">
                    The job you're trying to apply for doesn't exist or has been removed.
                  </p>
                  <button
                    onClick={() => router.push("/find-jobs")}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200"
                  >
                    Browse Jobs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
