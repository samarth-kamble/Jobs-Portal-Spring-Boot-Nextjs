import { FilteredApplicantsView } from "@/modules/employer/views/filtered-applicants-view";

export default function AppliedCandidatesPage() {
  return <FilteredApplicantsView statusFilter="APPLIED" title="Applied Candidates" />;
}
