"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconBell, IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getNotifications, readNotifications } from "../server/notification-service";

export const NotificationMenu = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    getNotifications(user.id)
      .then((res) => setNotifications(res))
      .catch((err) => console.log(err));
  }, [user]);

  const unread = (index: number) => {
    const target = notifications[index];
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    readNotifications(target.id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <DropdownMenu open={opened} onOpenChange={setOpened}>
      <DropdownMenuTrigger asChild>
        <button className="relative bg-accent hover:bg-accent/80 p-2 rounded-lg transition-all duration-300 backdrop-blur-sm group border border-border hover:border-border/80 outline-none">
          {/* Hover glow */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

          <IconBell
            stroke={1.5}
            className="h-5 w-5 text-foreground relative z-10"
          />

          {/* Unread dot indicator */}
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse z-20" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[420px] p-0 backdrop-blur-xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-accent/50">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground font-semibold text-base">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-0 text-xs"
              >
                {notifications.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-2 p-2">
              {notifications.map((noti: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    router.push(noti.route);
                    unread(idx);
                    setOpened(false);
                  }}
                  className="group relative p-4 rounded-lg bg-accent/50 hover:bg-accent border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  {/* Dismiss button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unread(idx);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-md bg-accent hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <IconX size={14} stroke={2} />
                  </button>

                  <div className="flex gap-3 relative z-10">
                    {/* Icon */}
                    <div className="shrink-0 mt-1">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <IconCheck size={16} stroke={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-foreground font-medium text-sm mb-1">
                        {noti.action}
                      </h4>
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {noti.message}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-medium text-primary uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          New
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex p-4 rounded-full bg-accent/50 mb-4">
              <IconBell
                size={32}
                stroke={1.5}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No notifications yet
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              We'll notify you when something arrives
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
