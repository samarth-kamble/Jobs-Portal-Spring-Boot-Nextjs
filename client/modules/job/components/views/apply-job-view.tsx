"use client";

import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useSelector } from "react-redux";
import { getJob } from "@/modules/job/server/job-service";
import { getProfile } from "@/modules/profile/server/profile-service";
import ApplyJobCompany from "../ui/apply-job-company";

interface ApplyJobProps {
  params: Promise<{ id: string }>;
}

const ApplyJob = ({ params }: ApplyJobProps) => {
  const router = useRouter();
  const { id } = use(params);
  const user = useSelector((state: any) => state.user);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [profileComplete, setProfileComplete] = useState<boolean>(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  useEffect(() => {
    if (user?.id) {
      setLoadingProfile(true);
      getProfile(user.id)
        .then((profile: any) => {
          const missing = [];
          if (!profile?.name || !profile?.email)
            missing.push("Basic Profile Details");
          if (!profile?.about) missing.push("About section");
          if (!profile?.skills || profile.skills.length === 0)
            missing.push("Skills");
          if (!profile?.resumes || profile.resumes.length === 0)
            missing.push("Resume");

          if (missing.length > 0) {
            setProfileComplete(false);
            setMissingFields(missing);
          } else {
            setProfileComplete(true);
          }
          setLoadingProfile(false);
        })
        .catch(() => {
          setLoadingProfile(false);
        });
    } else {
      setLoadingProfile(false);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background relative mt-6">
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

      <div className="relative max-w-8xl mx-auto">
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
          {loading || loadingProfile ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Loading...</p>
              </div>
            </div>
          ) : !profileComplete ? (
            <div className="flex items-center justify-center py-20 px-4">
              <div className="text-center w-full max-w-2xl">
                <div className="p-8 bg-card border border-border rounded-2xl shadow-lg inline-block w-full">
                  <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconEdit size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Profile Incomplete
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Please complete your profile before applying for jobs. You
                    are missing the following details:
                  </p>
                  <ul className="text-sm font-medium text-destructive bg-destructive/5 rounded-lg px-6 py-4 mb-8 inline-block text-left list-disc list-inside">
                    {missingFields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                  <div className="flex justify-center">
                    <button
                      onClick={() => router.push("/profile")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200"
                    >
                      Complete My Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : job ? (
            <ApplyJobCompany {...job} />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="p-8 bg-card border border-border rounded-2xl shadow-lg inline-block">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Job Not Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    The job you're trying to apply for doesn't exist or has been
                    removed.
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
