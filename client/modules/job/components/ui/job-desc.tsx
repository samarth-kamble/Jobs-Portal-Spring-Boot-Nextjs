"use client";

import { IconBookmark, IconBookmarkFilled, IconBriefcase, IconClock, IconUsers, IconMapPin, IconCurrencyRupee } from "@tabler/icons-react";
import Link from "next/link";
import DOMPurify from 'isomorphic-dompurify';
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";
import { timeAgo } from "@/lib/time-ago";
import { postJob } from "@/modules/job/server/job-service";

const card = [
    { name: "Location", id: "location", icon: IconMapPin },
    { name: "Experience", id: "experience", icon: IconBriefcase },
    { name: "Salary", id: "packageOffered", icon: IconCurrencyRupee },
    { name: "Job Type", id: "jobType", icon: IconClock },
];

const JobDesc = (props: any) => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const user = useSelector((state: any) => state.user);

    const applied = useMemo(() => {
        return props.applicants?.some((applicant: any) => applicant.applicantId === user?.id) ?? false;
    }, [props.applicants, user?.id]);

    const handleSaveJob = () => {
        let savedJobs: any = [...(profile.savedJobs ?? [])];
        if (savedJobs?.includes(props.id)) {
            savedJobs = savedJobs?.filter((id: any) => id !== props.id);
        } else {
            savedJobs = [...savedJobs, props.id];
        }
        const updatedProfile = { ...profile, savedJobs: savedJobs };
        dispatch(changeProfile(updatedProfile));
    };

    const handleClose = () => {
        postJob({ ...props, jobStatus: "CLOSED" })
            .then(() => {
                successNotification("Closed", "Job closed Successfully");
            })
            .catch((err: any) => {
                errorNotification("Error", err.response?.data?.errorMessage || "Something went wrong");
            });
    };

    const data = DOMPurify.sanitize(props.description || "");

    return (
        <div className="w-full lg:w-2/3 space-y-6">
            {/* Main Job Header Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Company Info */}
                    <div className="flex gap-4 items-start flex-1">
                        {/* Company Logo */}
                        <div className="p-3 bg-background border border-border rounded-xl shadow shrink-0">
                            <img
                                className="h-16 w-16 object-contain"
                                src={`/icons/${props.company?.charAt(0).toUpperCase()}${props.company?.slice(1)}.png`}
                                alt={props.company}
                                onError={(e) => {
                                    e.currentTarget.src = '/icons/default.png';
                                }}
                            />
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground mb-2 capitalize">
                                {props.jobTitle}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1.5">
                                    <IconBriefcase className="w-4 h-4 text-primary" />
                                    <span className="font-medium capitalize">{props.company}</span>
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1.5">
                                    <IconClock className="w-4 h-4 text-primary" />
                                    <span>{timeAgo(props.postTime)}</span>
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1.5">
                                    <IconUsers className="w-4 h-4 text-primary" />
                                    <span>{props.applicants ? props.applicants.length : 0} applicants</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 items-end shrink-0">
                        {(props.edit || (!applied && user?.accountType !== 'EMPLOYER')) && (
                            <Link href={props.edit ? `/pjob/${props.id}` : `/apply-job/${props.id}`}>
                                <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-sm">
                                    {props.closed ? 'Reopen' : props.edit ? 'Edit Job' : 'Apply Now'}
                                </button>
                            </Link>
                        )}

                        {!props.edit && applied && (
                            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary/20 text-primary font-semibold text-sm border border-primary/30 cursor-default">
                                ✓ Applied
                            </button>
                        )}

                        {props.edit && !props.closed ? (
                            <button
                                onClick={handleClose}
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-destructive/10 text-destructive font-semibold text-sm border border-destructive/30 hover:bg-destructive/20 hover:scale-105 transition-all duration-200"
                            >
                                Close Job
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveJob}
                                className="p-2.5 rounded-lg border border-border bg-accent hover:bg-accent/80 hover:scale-110 transition-all duration-200"
                                aria-label="Save Job"
                            >
                                {profile.savedJobs?.includes(props.id) ? (
                                    <IconBookmarkFilled className="w-5 h-5 text-primary" />
                                ) : (
                                    <IconBookmark className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {card.map((mycard: any, idx: any) => (
                    <div
                        key={idx}
                        className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/40 hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex justify-center mb-3">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                <mycard.icon className="w-7 h-7 text-primary" stroke={1.5} />
                            </div>
                        </div>
                        <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">{mycard.name}</div>
                        <div className="text-foreground font-bold text-base capitalize">
                            {props ? props[mycard.id] : "NA"}
                            {mycard.id === "packageOffered" && <span className="text-xs ml-1 text-muted-foreground">LPA</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Required Skills Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span className="w-1 h-7 bg-primary rounded-full" />
                    Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {props?.skillsRequired?.map((jobSkill: any, idx: any) => (
                        <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-200 cursor-default"
                        >
                            {jobSkill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Job Description Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span className="w-1 h-7 bg-destructive rounded-full" />
                    Job Description
                </h2>
                <div
                    className="text-muted-foreground leading-relaxed
                    [&_h4]:text-lg [&_h4]:my-4 [&_h4]:font-semibold [&_h4]:text-foreground
                    [&_p]:text-justify [&_p]:mb-4
                    [&_li]:mb-2 [&_li]:ml-4
                    [&_ul]:mb-4 [&_ul]:list-disc
                    [&_ol]:mb-4 [&_ol]:list-decimal
                    [&_strong]:text-foreground [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: data }}
                />
            </div>

            {/* About Company Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span className="w-1 h-7 bg-linear-to-b from-primary to-destructive rounded-full" />
                    About Company
                </h2>

                {/* Company Card */}
                <div className="bg-accent border border-border rounded-xl p-5 mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-background border border-border rounded-xl shadow">
                                <img
                                    className="h-12 w-12 object-contain"
                                    src={`/icons/${props.company?.charAt(0).toUpperCase()}${props.company?.slice(1)}.png`}
                                    alt={props.company}
                                    onError={(e) => {
                                        e.currentTarget.src = '/icons/default.png';
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground capitalize mb-0.5">
                                    {props.company}
                                </h3>
                                <p className="text-muted-foreground text-sm">10K+ Employees</p>
                            </div>
                        </div>

                        <Link href={`/company/${props.company}`}>
                            <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-accent hover:scale-105 transition-all duration-200">
                                Company Page
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Company Description */}
                <p className="text-muted-foreground text-justify leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae accusantium nobis magnam aut laborum commodi natus vero sequi aliquam voluptas perspiciatis amet est velit corporis, consequuntur dolores dolorum ducimus autem, provident officia, assumenda eos vel voluptatem cum. Magnam, excepturi quae?
                </p>
            </div>
        </div>
    );
};

export default JobDesc;
