import JobDescPage from "@/modules/job/components/views/job-desc-view";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <JobDescPage params={params} />;
}
