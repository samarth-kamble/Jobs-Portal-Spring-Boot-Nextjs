import { PostJobView } from '@/modules/job/components/views/post-job-view'
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

const Page = () => {
  return (
    <AuthGuard requireAuth allowedRoles={["EMPLOYER"]}>
      <PostJobView />
    </AuthGuard>
  );
}

export default Page