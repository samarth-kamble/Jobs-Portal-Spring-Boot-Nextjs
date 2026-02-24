

import { JobAnalyticsView } from "@/modules/employer/views/job-analytics-view";

export default async function JobAnalyticsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  return <JobAnalyticsView jobId={resolvedParams.jobId} />;
}
