import { JobHistoryView } from "@/modules/job/components/views/job-history-view";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

export default function Page() {
    return (
        <AuthGuard requireAuth allowedRoles={["APPLICANT"]}>
            <JobHistoryView />
        </AuthGuard>
    );
}
