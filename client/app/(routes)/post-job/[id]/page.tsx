import { PostJobView } from '@/modules/job/components/views/post-job-view'
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard requireAuth allowedRoles={["EMPLOYER"]}>
      <PostJobView />
    </AuthGuard>
  );
}
