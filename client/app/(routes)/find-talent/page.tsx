import { FindTalentsView } from '@/modules/job/components/views/find-talent-view'
import { AuthGuard } from "@/modules/auth/components/AuthGuard";
import React from 'react'

const Page = () => {
  return (
    <AuthGuard allowedRoles={["EMPLOYER", "ADMIN"]}>
      <FindTalentsView />
    </AuthGuard>
  );
}

export default Page