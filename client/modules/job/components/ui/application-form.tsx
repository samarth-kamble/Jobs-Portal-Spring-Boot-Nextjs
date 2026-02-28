"use client";

import {
  IconFileCv,
  IconEye,
  IconEdit,
  IconSend,
  IconFile,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { getBase64 } from "@/lib/get-base64";
import { applyJob } from "@/modules/job/server/job-service";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";
import { getProfile } from "@/modules/profile/server/profile-service";

interface ResumeItem {
  name: string;
  document: string;
  uploadedAt: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  website: string;
  coverLetter: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  resume?: string;
}

const ApplicationForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const user = useSelector((state: any) => state.user);
  const [preview, setPreview] = useState(false);
  const [submit, setSubmit] = useState(false);

  // Saved resumes state
  const [savedResumes, setSavedResumes] = useState<ResumeItem[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null);
  const [resumeMode, setResumeMode] = useState<"saved" | "upload">("saved");
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    resume: null,
    website: "",
    coverLetter: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch saved resumes on mount
  useEffect(() => {
    if (user?.id) {
      getProfile(user.id)
        .then((profile: any) => {
          const resumes = profile?.resumes || [];
          setSavedResumes(resumes);
          if (resumes.length === 0) {
            setResumeMode("upload");
          }
          setLoadingResumes(false);
        })
        .catch(() => {
          setLoadingResumes(false);
          setResumeMode("upload");
        });
    } else {
      setLoadingResumes(false);
      setResumeMode("upload");
    }
  }, [user?.id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.phone.trim()) newErrors.phone = "Phone is required";
    if (resumeMode === "upload" && !values.resume)
      newErrors.resume = "Resume is required";
    if (resumeMode === "saved" && !selectedResume)
      newErrors.resume = "Please select a resume";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePreview = () => {
    if (!validate()) return;
    setPreview(!preview);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmit(true);
    let resumeBase64: string;

    if (resumeMode === "saved" && selectedResume) {
      resumeBase64 = selectedResume.document;
    } else {
      const base64 = (await getBase64(values.resume as File)) as string;
      resumeBase64 = base64.split(",")[1];
    }

    let applicant = {
      ...values,
      applicantId: user.id,
      resume: resumeBase64,
    };
    applyJob(id, applicant)
      .then(() => {
        setSubmit(false);
        successNotification("Success", "Application submitted successfully");
        router.push("/jhistory");
      })
      .catch((err: any) => {
        setSubmit(false);
        errorNotification(
          "Error",
          err.response?.data?.errorMessage || "Something went wrong",
        );
      });
  };

  const getResumeDisplayName = () => {
    if (resumeMode === "saved" && selectedResume) {
      return selectedResume.name;
    }
    if (resumeMode === "upload" && values.resume) {
      return (values.resume as File).name;
    }
    return null;
  };

  // Shared input styles
  const inputBase =
    "w-full rounded-lg border bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2.5 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
  const labelBase = "block text-sm font-semibold text-muted-foreground mb-1.5";
  const labelPreview = "block text-sm font-semibold text-foreground mb-1";
  const errorText = "mt-1 text-xs text-destructive";

  return (
    <>
      {/* Loading overlay */}
      {submit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-top-primary animate-spin" />
            <p className="text-muted-foreground text-sm font-medium">
              Submitting application...
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-8 mt-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-8 w-1.5 bg-linear-to-b from-destructive to-destructive/60 rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">
            {preview ? "Review Your Application" : "Submit Your Application"}
          </h2>
        </div>

        {/* Preview notice */}
        {preview && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/25 rounded-xl">
            <p className="text-sm text-primary flex items-center gap-2">
              <IconEye size={17} />
              Please review your information carefully before submitting
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={preview ? labelPreview : labelBase}>
                Full Name <span className="text-destructive">*</span>
              </label>
              {preview ? (
                <p className="text-foreground text-lg font-semibold">
                  {values.name || "—"}
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className={`${inputBase} ${errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"}`}
                  />
                  {errors.name && <p className={errorText}>{errors.name}</p>}
                </>
              )}
            </div>

            <div>
              <label className={preview ? labelPreview : labelBase}>
                Email ID <span className="text-destructive">*</span>
              </label>
              {preview ? (
                <p className="text-foreground text-lg font-semibold">
                  {values.email || "—"}
                </p>
              ) : (
                <>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                    className={`${inputBase} ${errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"}`}
                  />
                  {errors.email && <p className={errorText}>{errors.email}</p>}
                </>
              )}
            </div>
          </div>

          {/* Phone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={preview ? labelPreview : labelBase}>
                Phone/Mobile Number <span className="text-destructive">*</span>
              </label>
              {preview ? (
                <p className="text-foreground text-lg font-semibold">
                  {values.phone || "—"}
                </p>
              ) : (
                <>
                  <input
                    type="number"
                    value={values.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        val === "" ||
                        (Number(val) >= 0 && Number(val) <= 9999999999)
                      ) {
                        handleChange("phone", val);
                      }
                    }}
                    placeholder="9876543210"
                    min={0}
                    max={9999999999}
                    className={`${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.phone ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"}`}
                  />
                  {errors.phone && <p className={errorText}>{errors.phone}</p>}
                </>
              )}
            </div>

            <div>
              <label className={preview ? labelPreview : labelBase}>
                Personal Website
              </label>
              {preview ? (
                <p className="text-foreground text-lg font-semibold">
                  {values.website || "—"}
                </p>
              ) : (
                <input
                  type="text"
                  value={values.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="www.example.com"
                  className={`${inputBase} border-border`}
                />
              )}
            </div>
          </div>

          {/* Resume Selection */}
          <div>
            <label className={preview ? labelPreview : labelBase}>
              Attach Your CV <span className="text-destructive">*</span>
            </label>
            {preview ? (
              <p className="text-foreground text-lg font-semibold flex items-center gap-2">
                <IconFileCv size={20} className="text-primary" />
                {getResumeDisplayName() || "—"}
              </p>
            ) : (
              <>
                {/* Mode Toggle */}
                {!loadingResumes && savedResumes.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setResumeMode("saved");
                        setErrors((prev) => ({ ...prev, resume: undefined }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        resumeMode === "saved"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Choose Saved Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeMode("upload");
                        setSelectedResume(null);
                        setErrors((prev) => ({ ...prev, resume: undefined }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        resumeMode === "upload"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Upload New
                    </button>
                  </div>
                )}

                {resumeMode === "saved" && savedResumes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedResumes.map((resume) => (
                      <button
                        key={resume.name}
                        type="button"
                        onClick={() => {
                          setSelectedResume(resume);
                          setErrors((prev) => ({ ...prev, resume: undefined }));
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                          selectedResume?.name === resume.name
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:border-primary/40"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            selectedResume?.name === resume.name
                              ? "bg-primary/20"
                              : "bg-background"
                          }`}
                        >
                          <IconFile
                            size={16}
                            className={
                              selectedResume?.name === resume.name
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          />
                        </div>
                        <span
                          className={`text-sm font-medium flex-1 truncate ${
                            selectedResume?.name === resume.name
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {resume.name}
                        </span>
                        {selectedResume?.name === resume.name && (
                          <IconCheck
                            size={16}
                            className="text-primary shrink-0"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <label
                    className={`flex items-center gap-3 w-full rounded-lg border px-3 py-2.5 cursor-pointer transition-all duration-200 hover:border-primary/40 ${
                      errors.resume
                        ? "border-destructive bg-destructive/5"
                        : "border-border bg-muted"
                    }`}
                  >
                    <IconFileCv
                      size={20}
                      className="text-muted-foreground shrink-0"
                    />
                    <span
                      className={`text-sm flex-1 ${values.resume ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {values.resume
                        ? (values.resume as File).name
                        : "Only PDFs or DOCX are accepted"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleChange("resume", e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                )}
                {errors.resume && <p className={errorText}>{errors.resume}</p>}
              </>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className={preview ? labelPreview : labelBase}>
              Cover Letter
            </label>
            {preview ? (
              <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
                {values.coverLetter || "—"}
              </p>
            ) : (
              <textarea
                value={values.coverLetter}
                onChange={(e) => handleChange("coverLetter", e.target.value)}
                placeholder="Describe yourself to the hiring manager..."
                rows={5}
                className={`${inputBase} border-border resize-none`}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-2">
            {!preview ? (
              <button
                onClick={handlePreview}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 hover:scale-[1.01] transition-all duration-200 shadow-md shadow-destructive/20"
              >
                <IconEye size={20} />
                Preview Application
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handlePreview}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-semibold text-sm hover:bg-accent hover:border-primary/40 transition-all duration-200"
                >
                  <IconEdit size={20} />
                  Edit Application
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 hover:scale-[1.01] transition-all duration-200 shadow-md shadow-primary/20"
                >
                  <IconSend size={20} />
                  Submit Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};;

export default ApplicationForm;
