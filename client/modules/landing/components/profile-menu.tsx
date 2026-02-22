"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconMessageCircle,
  IconUserCircle,
  IconFileText,
  IconLogout2,
  IconChevronDown,
  IconHistory,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { removeUser } from "@/modules/auth/server/user-slice";

export const ProfileMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);

  const handleLogout = () => {
    dispatch(removeUser());
    if (pathname === "/profile") {
      router.push("/");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-all duration-300 cursor-pointer backdrop-blur-sm group border border-border hover:border-border/80 outline-none">
          <Avatar className="h-8 w-8 ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300">
            <AvatarImage
              src={
                profile?.picture
                  ? `data:image/jpeg;base64,${profile.picture}`
                  : undefined
              }
              alt={user?.name}
            />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:block text-foreground">
            {user?.name}
          </span>
          <IconChevronDown
            stroke={1.5}
            className="h-4 w-4 text-foreground transition-transform duration-300 group-hover:translate-y-0.5 hidden md:block"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 p-2 backdrop-blur-xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Profile Header */}
        <div className="px-3 py-3 mb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/30">
              <AvatarImage
                src={
                  profile?.picture
                    ? `data:image/jpeg;base64,${profile.picture}`
                    : undefined
                }
                alt={user?.name}
              />
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-foreground font-semibold text-sm">
                {user?.name}
              </div>
              <div className="text-muted-foreground text-xs truncate max-w-[160px]">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        <Link href="/profile">
          <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent focus:text-foreground rounded-lg transition-all duration-200 my-1 cursor-pointer gap-2">
            <IconUserCircle size={18} stroke={1.5} />
            <span className="font-medium">Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/jhistory">
          <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent focus:text-foreground rounded-lg transition-all duration-200 my-1 cursor-pointer gap-2">
            <IconHistory size={18} stroke={1.5} />
            <span className="font-medium">History</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="text-foreground hover:bg-accent focus:bg-accent focus:text-foreground rounded-lg transition-all duration-200 my-1 cursor-pointer gap-2">
          <IconFileText size={18} stroke={1.5} />
          <span className="font-medium">Resume</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border my-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive rounded-lg transition-all duration-200 my-1 cursor-pointer gap-2"
        >
          <IconLogout2 size={18} stroke={1.5} />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
