"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/modules/redux/store";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ("APPLICANT" | "EMPLOYER" | "ADMIN")[];
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  allowedRoles,
}: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let currentUser = user;
    if (!currentUser && typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch (e) {}
      }
    }

    // If not authenticated and auth is required
    if (requireAuth && !currentUser) {
      router.push("/login");
      return;
    }

    // If authenticated but role doesn't match
    if (
      currentUser &&
      allowedRoles &&
      !allowedRoles.includes(currentUser.accountType)
    ) {
      if (currentUser.accountType === "APPLICANT") {
        router.push("/find-jobs");
      } else if (currentUser.accountType === "EMPLOYER") {
        router.push("/find-talent");
      } else if (currentUser.accountType === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      return;
    }

    // Authorized
    if (currentUser || !requireAuth) {
      setIsAuthorized(true);
    }
  }, [user, requireAuth, allowedRoles, router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
