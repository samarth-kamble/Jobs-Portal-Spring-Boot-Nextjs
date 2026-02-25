"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, Calendar } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { ExpInput } from "./exp-input";
import { formatDate } from "@/lib/format-date";
import { CompanyLogo } from "@/components/ui/company-logo";

export const ExpCard = (props: any) => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const profile = useSelector((state: any) => state.profile);

  const handleDelete = () => {
    const exp = [...profile.experiences];
    exp.splice(props.idx, 1);
    dispatch(changeProfile({ ...profile, experiences: exp }));
    successNotification("Success", "Experience deleted successfully");
  };

  return (
    <>
      {!edit ? (
        <div className="group relative bg-muted/20 backdrop-blur-sm border border-border/20 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Company Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4 items-start flex-1">
              {/* Company Logo */}
              <div className="p-3 bg-white rounded-xl shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                <CompanyLogo
                  company={props.company}
                  className="h-10 w-10"
                  fallbackClassName="h-10 w-10 rounded-lg"
                />
              </div>

              {/* Job Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {props.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">{props.company}</span>
                  <span className="text-border">•</span>
                  <span>{props.location}</span>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/30 px-3 py-1.5 rounded-lg border border-border/20">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(props.startDate)} -{" "}
                {props.working ? (
                  <span className="text-primary font-medium">Present</span>
                ) : (
                  formatDate(props.endDate)
                )}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-muted-foreground text-sm leading-relaxed mb-4 pl-[72px]">
            {props.description}
          </div>

          {/* Action Buttons */}
          {props.edit && (
            <div className="flex gap-3 pl-[72px]">
              <Button
                onClick={() => setEdit(true)}
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-400 hover:bg-green-400/10 hover:scale-105 transition-all"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all"
              >
                Delete
              </Button>
            </div>
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </div>
      ) : (
        <ExpInput {...props} setEdit={setEdit} />
      )}
    </>
  );
};
