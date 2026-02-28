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
import Image from "next/image";
import Banner from "@/public/banner.jpg"

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
          {/* Banner with gradient overlay */}
          <div className="relative h-72 rounded-2xl overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={Banner}
              alt="banner"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
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
