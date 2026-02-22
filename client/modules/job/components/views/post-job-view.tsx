"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  IconBriefcase,
  IconSend,
  IconDeviceFloppy,
  IconX,
  IconSparkles,
  IconMapPin,
  IconCode,
} from "@tabler/icons-react";
import {SelectInput} from "../ui/select-input";
import { content, fields } from "../data/post-job";
import RichTextEditor from "../ui/rich-text-editor";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";
import { getJob, postJob } from "../../server/job-service";

/* ── Section header component ── */
export const SectionHeader = ({
  accent,
  icon: Icon,
  title,
  subtitle,
}: {
  accent: string;
  icon: any;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={`p-2.5 rounded-xl ${accent} shrink-0`}>
      <Icon size={20} className="text-primary" />
    </div>
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  </div>
);

/* ── Card wrapper ── */
const FormCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 shadow-lg hover:border-border/50 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

/* ── Custom TagsInput — replaces Mantine TagsInput ── */
const TagsField = ({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "|"].includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-foreground/80 font-medium text-sm">
        Required Skills <span className="text-primary">*</span>
      </Label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[44px] flex flex-wrap gap-2 p-2.5 rounded-lg bg-input/20 border cursor-text transition-all focus-within:ring-1 focus-within:ring-primary focus-within:border-primary ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 border border-primary/25 text-primary text-xs rounded-md font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-primary/50 hover:text-primary transition-colors"
            >
              <IconX size={11} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue.trim() && addTag(inputValue)}
          placeholder={value.length === 0 ? "Type a skill and press Enter, comma or space…" : ""}
          className="flex-1 min-w-[180px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter, comma, or space to add each skill
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

/* ═══════════════════════════════ */
/*        Main PostJob page        */
/* ═══════════════════════════════ */

export const PostJobView = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const select = fields;

  const [editorData, setEditorData] = useState(content);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    experience: "",
    jobType: "",
    location: "",
    packageOffered: "",
    skillsRequired: [] as string[],
    about: "",
    description: content,
  });

  /* Mantine-compatible form adapter — SelectInput & MyRichTextEditor call these */
  const formAdapter = {
    getInputProps: (name: string) => ({
      value: (form as any)[name],
      onChange: (val: any) => {
        setForm((f) => ({ ...f, [name]: val }));
        setErrors((e) => ({ ...e, [name]: "" }));
      },
      error: errors[name],
    }),
    setFieldValue: (name: string, val: any) => {
      setForm((f) => ({ ...f, [name]: val }));
      setErrors((e) => ({ ...e, [name]: "" }));
    },
    setValues: (vals: any) => {
      setForm((f) => ({ ...f, ...vals }));
    },
    reset: () => {
      setForm({
        jobTitle: "",
        company: "",
        experience: "",
        jobType: "",
        location: "",
        packageOffered: "",
        skillsRequired: [],
        about: "",
        description: content,
      });
      setErrors({});
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id !== "0") {
      getJob(id)
        .then((res: any) => {
          formAdapter.setValues(res);
          setEditorData(res.description);
        })
        .catch((err: any) => console.log(err));
    } else {
      formAdapter.reset();
      setEditorData(content);
    }
  }, [id]);

  /* Validation */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.jobTitle) e.jobTitle = "Job title is required";
    if (!form.company) e.company = "Company name is required";
    if (!form.experience) e.experience = "Experience level is required";
    if (!form.jobType) e.jobType = "Job type is required";
    if (!form.location) e.location = "Location is required";
    if (!form.packageOffered) e.packageOffered = "Package is required";
    if (!form.skillsRequired.length) e.skillsRequired = "At least one skill is required";
    if (!form.about) e.about = "Job summary is required";
    if (!form.description) e.description = "Job description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (status: "ACTIVE" | "DRAFT") => {
    if (status === "ACTIVE" && !validate()) return;
    postJob({
      ...form,
      id: id !== "0" ? id : undefined,
      postedBy: user.id,
      jobStatus: status,
    })
      .then((res: any) => {
        successNotification(
          "Success",
          status === "ACTIVE" ? "Job posted successfully" : "Job drafted successfully"
        );
        router.push(`/posted-jobs/${res.id}`);
      })
      .catch((err: any) => {
        errorNotification("Something went wrong", err.response?.data);
      });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-mine-shaft-950 via-mine-shaft-900 to-mine-shaft-950 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-11/12 max-w-5xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-start gap-5">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl shadow-lg shadow-primary/10">
            <IconBriefcase size={32} className="text-primary" />
          </div>
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <IconSparkles size={11} />
                {id !== "0" ? "Editing Listing" : "New Listing"}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {id !== "0" ? "Edit Job Posting" : "Post a New Job"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill in the details below to {id !== "0" ? "update your" : "create a"} job posting
            </p>
          </div>
        </div>

        {/* ── Section 1: Basic Information ── */}
        <FormCard>
          <SectionHeader
            accent="bg-primary/10"
            icon={IconBriefcase}
            title="Basic Information"
            subtitle="Core details about the role and company"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectInput form={formAdapter} name="jobTitle" {...select[0]} />
            <SelectInput form={formAdapter} name="company" {...select[1]} />
          </div>
        </FormCard>

        {/* ── Section 2: Job Details ── */}
        <FormCard>
          <SectionHeader
            accent="bg-primary/10"
            icon={IconMapPin}
            title="Job Details"
            subtitle="Experience, type, location and compensation"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectInput form={formAdapter} name="experience" {...select[2]} />
            <SelectInput form={formAdapter} name="jobType" {...select[3]} />
            <SelectInput form={formAdapter} name="location" {...select[4]} />

            {/* Replaces Mantine NumberInput */}
            <div className="space-y-1.5">
              <Label className="text-foreground/80 font-medium text-sm">
                Salary Package (LPA) <span className="text-primary">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                max={300}
                value={form.packageOffered}
                onChange={(e) => {
                  formAdapter.setFieldValue("packageOffered", e.target.value);
                }}
                placeholder="Enter salary in LPA"
                className={`bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground ${
                  errors.packageOffered ? "border-destructive" : ""
                }`}
              />
              {errors.packageOffered && (
                <p className="text-xs text-destructive">{errors.packageOffered}</p>
              )}
            </div>
          </div>
        </FormCard>

        {/* ── Section 3: Skills & Description ── */}
        <FormCard>
          <SectionHeader
            accent="bg-primary/10"
            icon={IconCode}
            title="Skills & Description"
            subtitle="Required skills and the full job description"
          />

          <div className="space-y-5">
            {/* Tags input — replaces Mantine TagsInput */}
            <TagsField
              value={form.skillsRequired}
              onChange={(v) => formAdapter.setFieldValue("skillsRequired", v)}
              error={errors.skillsRequired}
            />

            {/* About — replaces Mantine Textarea */}
            <div className="space-y-1.5">
              <Label className="text-foreground/80 font-medium text-sm">
                Job Summary <span className="text-primary">*</span>
              </Label>
              <Textarea
                value={form.about}
                onChange={(e) => formAdapter.setFieldValue("about", e.target.value)}
                placeholder="Write a brief summary about the job position..."
                rows={3}
                className={`bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground resize-none ${
                  errors.about ? "border-destructive" : ""
                }`}
              />
              <p className="text-xs text-muted-foreground">
                A concise overview that will appear in job listings
              </p>
              {errors.about && <p className="text-xs text-destructive">{errors.about}</p>}
            </div>

            {/* Rich text editor */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-foreground/80 font-medium text-sm">
                  Detailed Job Description <span className="text-primary">*</span>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Provide comprehensive information about the role, responsibilities, and requirements
              </p>
              <RichTextEditor form={formAdapter} data={editorData} />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </FormCard>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-between gap-4 pb-8">
          <p className="text-xs text-muted-foreground hidden sm:block">
            All fields marked <span className="text-primary">*</span> are required
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={() => submit("DRAFT")}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-border/40 hover:border-border transition-all"
            >
              <IconDeviceFloppy size={17} />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => submit("ACTIVE")}
              className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 font-semibold"
            >
              <IconSend size={17} />
              Publish Job
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
