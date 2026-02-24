import { FilteredApplicantsView } from "@/modules/employer/views/filtered-applicants-view";

export default function InterviewingCandidatesPage() {
  return <FilteredApplicantsView statusFilter="INTERVIEWING" title="Interviewing Candidates" />;
}
