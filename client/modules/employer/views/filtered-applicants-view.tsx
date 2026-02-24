"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApplicantsByEmployer } from "@/modules/job/server/job-service";
import { Loader2, Users } from "lucide-react";
import { TalentCard } from "@/modules/job/components/ui/talent-card";

interface FilteredApplicantsViewProps {
  statusFilter: string | string[];
  title: string;
}

export const FilteredApplicantsView = ({ statusFilter, title }: FilteredApplicantsViewProps) => {
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(true);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getApplicantsByEmployer(user.id, statusFilter)
        .then((applicants) => {
          setFilteredApplicants(applicants || []);
        })
        .catch((err) => {
          console.error(`Error fetching ${title} applicants:`, err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, statusFilter, title]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading {title.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          A centralized list of all candidates currently marked as {Array.isArray(statusFilter) ? statusFilter.join(' or ') : statusFilter} across all your active job postings.
        </p>
      </div>

      {filteredApplicants.length > 0 ? (
        <div className="flex flex-col gap-5">
          {filteredApplicants.map((applicant, index) => (
            <div key={index} className="relative">
              {/* Optional: Add a small badge above to indicate which job this is for */}
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                Applied for: <span className="text-primary">{applicant.jobTitle}</span>
              </div>
              <TalentCard
                {...applicant}
                requiredSkills={applicant.skillsRequired}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Candidates Found</h3>
          <p className="text-muted-foreground max-w-md">
            You currently do not have any candidates in the "{title}" stage across your job postings.
          </p>
        </div>
      )}
    </div>
  );
};
