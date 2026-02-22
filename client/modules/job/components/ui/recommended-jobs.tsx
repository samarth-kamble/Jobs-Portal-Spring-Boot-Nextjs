"use client";

import { useParams } from "next/navigation";
import { JobCard } from "./job-card";
import { useEffect, useState } from "react";
import { IconSparkles } from "@tabler/icons-react";
import { getAllJobs } from "@/modules/job/server/job-service";

const RecommendedJobs = () => {
    const params = useParams();
    const id = params?.id as string;
    const [jobList, setJobList] = useState<any>(null);

    useEffect(() => {
        getAllJobs()
            .then((res: any) => {
                console.log("getAllJobs response:", res);
                setJobList(res?.filter((job: any) => job.jobStatus === "ACTIVE") || []);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="w-full lg:w-1/3">
            <div className="sticky top-6">
                {/* Header */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <IconSparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Recommended Jobs
                        </h2>
                    </div>
                    <p className="text-muted-foreground text-sm pl-1">
                        Based on your profile and interests
                    </p>
                </div>

                {/* Job List */}
                <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1 flex-nowrap custom-scrollbar">
                    {jobList?.map(
                        (job: any, idx: any) =>
                            idx < 6 &&
                            id != job.id && <JobCard key={idx} {...job} />
                    )}

                    {(!jobList || jobList.length === 0) && (
                        <div className="text-center py-12 bg-card border border-border rounded-xl">
                            <p className="text-muted-foreground text-sm">
                                No recommended jobs available
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: hsl(var(--muted));
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.4);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.7);
                }
            `}</style>
        </div>
    );
};

export default RecommendedJobs;
