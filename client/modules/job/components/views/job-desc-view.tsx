"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getJob } from "@/modules/job/server/job-service";
import JobDesc from "../ui/job-desc";
import RecommendedJobs from "../ui/recommended-jobs";

import { use } from "react";

interface JobDescPageProps {
    params: Promise<{ id: string }>;
}

const JobDescPage = ({ params }: JobDescPageProps) => {
    const { id } = use(params);
    const [job, setJob] = useState<any>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        getJob(id)
            .then((res) => {
                console.log("getJob response:", res);
                setJob(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/find-jobs">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-accent hover:scale-105 transition-all duration-200 shadow-sm">
                            <IconArrowLeft size={18} />
                            Back to All Jobs
                        </button>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <JobDesc {...job} />
                    <RecommendedJobs />
                </div>
            </div>
        </div>
    );
};

export default JobDescPage;
