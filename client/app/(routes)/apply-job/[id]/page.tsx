import ApplyJob from "@/modules/job/components/views/apply-job-view";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <AuthGuard requireAuth allowedRoles={["APPLICANT"]}>
            <ApplyJob params={params} />
        </AuthGuard>
    );
}
