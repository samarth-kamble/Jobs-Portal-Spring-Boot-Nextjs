"use client";

import { useState } from "react";
import { IconFileCv, IconTrash, IconUpload, IconFile } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { getBase64 } from "@/lib/get-base64";
import { uploadResume, deleteResume } from "../server/profile-service";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

interface ResumeItem {
  name: string;
  document: string;
  uploadedAt: string;
}

interface ResumeSectionProps {
  profile: any;
  edit: boolean;
}

export const ResumeSection = ({ profile, edit }: ResumeSectionProps) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resumes: ResumeItem[] = profile?.resumes || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      errorNotification("Error", "Only PDF files are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorNotification("Error", "File size must be less than 5MB.");
      return;
    }

    if (resumes.length >= 5) {
      errorNotification("Error", "You can upload a maximum of 5 resumes.");
      return;
    }

    setUploading(true);
    try {
      const base64 = (await getBase64(file)) as string;
      const document = base64.split(",")[1];
      const resumeName = file.name.replace(/\.[^/.]+$/, ""); // remove extension

      const updatedProfile = await uploadResume(profile.id, {
        name: resumeName,
        document,
      });
      dispatch(changeProfile(updatedProfile));
      successNotification("Success", "Resume uploaded successfully.");
    } catch (err: any) {
      errorNotification(
        "Error",
        err.response?.data?.errorMessage || "Failed to upload resume."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (resumeName: string) => {
    setDeleting(resumeName);
    try {
      const updatedProfile = await deleteResume(profile.id, resumeName);
      dispatch(changeProfile(updatedProfile));
      successNotification("Success", "Resume deleted successfully.");
    } catch (err: any) {
      errorNotification(
        "Error",
        err.response?.data?.errorMessage || "Failed to delete resume."
      );
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 bg-linear-to-b from-primary to-primary/60 rounded-full" />
          <h2 className="text-xl font-bold text-foreground">Resumes</h2>
          <span className="text-sm text-muted-foreground">
            ({resumes.length}/5)
          </span>
        </div>

        {edit && resumes.length < 5 && (
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-all duration-200">
            {uploading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <IconUpload size={16} />
                Upload Resume
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Resume List */}
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-muted rounded-2xl mb-4">
            <IconFileCv size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            No resumes uploaded yet
          </p>
          {edit && (
            <p className="text-muted-foreground/60 text-xs mt-1">
              Upload your resume to use when applying for jobs
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.name}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200"
            >
              <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                <IconFile size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {resume.name}
                </p>
                {resume.uploadedAt && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uploaded {formatDate(resume.uploadedAt)}
                  </p>
                )}
              </div>
              {edit && (
                <button
                  onClick={() => handleDelete(resume.name)}
                  disabled={deleting === resume.name}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {deleting === resume.name ? (
                    <div className="w-4 h-4 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" />
                  ) : (
                    <IconTrash size={16} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
