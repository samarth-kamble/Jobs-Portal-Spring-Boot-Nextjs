"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconEdit } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { getBase64 } from "@/lib/get-base64";
import { successNotification } from "@/modules/notifications/server/notification-service";
import {Info} from "../components/info";
import {About} from "../components/about";
import {Skills} from "../components/skills";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { Experience } from "../components/experience";
import { Certificate } from "../components/certificate";
import { ResumeSection } from "../components/resume-section";
export const ProfileView = (props: any) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.profile);
  const profile = props.id ? props : userProfile;
  const [fileInputKey, setFileInputKey] = useState(0);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;
    if (!profile?.id) {
      console.error("Profile ID is missing. Cannot update profile.");
      return;
    }
    try {
      const picture = (await getBase64(image)) as string;
      const updatedProfile = { ...profile, picture: picture.split(",")[1] };
      dispatch(changeProfile(updatedProfile));
      successNotification("success", "Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setFileInputKey((prev) => prev + 1);
    }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Banner & Avatar Section */}
        <div className="relative mb-24">
          {/* Banner with ultra-premium abstract design */}
          <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 group shadow-2xl">
            {/* Base glowing backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

            {/* Animated Aurora/Glows (Slow moving blobs) */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
            <div
              className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse"
              style={{ animationDelay: "1.5s", animationDuration: "5s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/15 rounded-full blur-[150px] mix-blend-screen" />

            {/* Grid Pattern Overlay (Tech feel) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />

            {/* Starry dust (static small particles) */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 50%, white 1px, transparent 1px), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.8) 1.5px, transparent 1.5px), radial-gradient(circle at 65% 80%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 35% 20%, white 2px, transparent 2px)",
                backgroundSize: "120px 120px",
              }}
            />

            {/* Floating glowing orbs / particles */}
            <div
              className="absolute top-12 left-1/3 w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_15px_3px_rgba(var(--primary),0.8)] animate-bounce"
              style={{ animationDuration: "3s" }}
            />
            <div
              className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-blue-400/80 shadow-[0_0_20px_4px_rgba(96,165,250,0.6)] animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div
              className="absolute top-24 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400/80 shadow-[0_0_10px_2px_rgba(192,132,252,0.6)] animate-bounce"
              style={{ animationDuration: "2.5s", animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-400/80 shadow-[0_0_12px_2px_rgba(129,140,248,0.6)] animate-pulse"
              style={{ animationDuration: "5s", animationDelay: "0.5s" }}
            />

            {/* Glowing horizontal line effect crossing the banner */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_2px_rgba(var(--primary),0.3)] opacity-50" />

            {/* Smooth bottom fade to blend with page */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>

          {/* Avatar Container */}
          <div className="absolute -bottom-20 left-8">
            <div
              className="relative w-40 h-40 cursor-pointer group"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="w-40 h-40 ring-8 ring-background group-hover:ring-primary/30 transition-all duration-300">
                <AvatarImage
                  src={
                    profile?.picture
                      ? `data:image/jpeg;base64,${profile.picture}`
                      : undefined
                  }
                  alt="profile img"
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold w-full h-full">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Hover overlay — replaces Mantine <Overlay> */}
              {hovered && (
                <div className="absolute inset-0 rounded-full bg-black/80 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-200">
                  <IconEdit className="w-12 h-12 text-primary" />
                </div>
              )}

              {/* Hidden file input — replaces Mantine <FileInput> */}
              <input
                key={fileInputKey}
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <Info profile={profile} edit={!props.id} />
          </div>

          <hr className="border-white/5" />

          {/* About Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <About profile={profile} edit={!props.id} />
          </div>

          <hr className="border-white/5" />

          {/* Skills Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <Skills profile={profile} edit={!props.id} />
          </div>

          <hr className="border-white/5" />

          {/* Resume Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <ResumeSection profile={profile} edit={!props.id} />
          </div>

          <hr className="border-white/5" />

          {/* Experience Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <Experience profile={profile} edit={!props.id} />
          </div>

          <hr className="border-white/5" />

          {/* Certificate Card */}
          <div className="backdrop-blur-xl bg-popover/60 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <Certificate profile={profile} edit={!props.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
