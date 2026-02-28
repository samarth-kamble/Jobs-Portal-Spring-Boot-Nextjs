"use client";

import { Button } from "@/components/ui/button";
import { IconMenu2, IconSettings, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavLink from "./nav-link";
import {ProfileMenu} from "./profile-menu";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { RootState } from "@/modules/redux/store";
import { getProfile } from "../server/profile-service";
import { setProfile } from "../server/profile-slice";
import { NotificationMenu } from "./notification-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user);
  const profileId = useSelector((state: RootState) => state.user?.id);

  /* Prevent hydration mismatch — server has no user state */
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && user;

  /* Profile Fetch */
  useEffect(() => {
    if (!profileId) return;
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const data = await getProfile(profileId);
        dispatch(setProfile(data));
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Profile fetch error:", error);
        }
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [profileId, dispatch]);

  /* Hide on auth pages */
  if (pathname === "/signup" || pathname === "/login") return null;

  return (
    <header className="w-full backdrop-blur-md bg-background/70 px-4 md:px-6 lg:px-8 text-foreground border-b border-border">
      <div className="h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex gap-2 items-center group">
          <div className="p-2 rounded-lg">
            <Image src={Logo} alt="Joblify" width={28} height={28} />
          </div>
          <div className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Joblify
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex h-full items-center">
          <NavLink />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <ProfileMenu />
              <button className="bg-accent hover:bg-accent/80 p-2 rounded-lg transition-colors backdrop-blur-sm">
                <IconSettings stroke={1.5} className="h-5 w-5" />
              </button>
              <NotificationMenu />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-foreground hover:bg-accent hover:text-foreground"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden bg-accent backdrop-blur-sm p-2 rounded-lg"
        >
          {mobileMenuOpen ? (
            <IconX stroke={1.5} className="h-6 w-6" />
          ) : (
            <IconMenu2 stroke={1.5} className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border py-4 space-y-2 backdrop-blur-md">
          <div className="flex flex-col space-y-1">
            {[
              { label: "Find Job", href: "/find-jobs" },
              { label: "Find Talent", href: "/find-talent" },
              { label: "Post Job", href: "/post-job" },
              { label: "About us", href: "/about" },
            ]
              .filter(({ href }) => {
                if (
                  href === "/find-talent" &&
                  user?.accountType === "APPLICANT"
                )
                  return false;
                if (href === "/post-job" && user?.accountType !== "EMPLOYER")
                  return false;
                return true;
              })
              .map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
          </div>

          <div className="flex items-center justify-between px-4 pt-4 border-t border-border">
            {isLoggedIn ? (
              <>
                <ProfileMenu />
                <div className="flex gap-2">
                  <button className="bg-accent backdrop-blur-sm p-2 rounded-lg">
                    <IconSettings stroke={1.5} className="h-5 w-5" />
                  </button>
                  <NotificationMenu />
                </div>
              </>
            ) : (
              <div className="flex gap-3 w-full">
                <Link
                  href="/login"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full text-foreground hover:bg-accent hover:text-foreground"
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  href="/signup"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;