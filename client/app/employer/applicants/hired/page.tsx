import { FilteredApplicantsView } from "@/modules/employer/views/filtered-applicants-view";

export default function HiredCandidatesPage() {
  return <FilteredApplicantsView statusFilter={["OFFERED", "HIRED"]} title="Hired Candidates" />;
}
