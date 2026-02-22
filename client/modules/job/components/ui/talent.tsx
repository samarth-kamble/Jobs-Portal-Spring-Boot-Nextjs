"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconMoodSad } from "@tabler/icons-react";
import { getAllProfiles } from "@/modules/profile/server/profile-service";
import { resetFilter } from "@/modules/redux/filter-slice";
import { Sort } from "./sort";
import { TalentCard } from "./talent-card";

/* ── Skeleton card — replaces Mantine Loader ── */
const SkeletonCard = () => (
  <div className="border border-border/20 rounded-2xl bg-muted/10 p-5 animate-pulse">
    <div className="flex gap-3 items-center mb-4">
      <div className="w-12 h-12 bg-muted/40 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted/40 rounded w-2/3" />
        <div className="h-3 bg-muted/40 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 bg-muted/40 rounded-lg w-16" />
      ))}
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-muted/40 rounded w-full" />
      <div className="h-3 bg-muted/40 rounded w-5/6" />
      <div className="h-3 bg-muted/40 rounded w-4/6" />
    </div>
    <div className="h-px bg-muted/30 my-4" />
    <div className="flex justify-between mb-4">
      <div className="h-4 bg-muted/40 rounded w-20" />
      <div className="h-4 bg-muted/40 rounded w-24" />
    </div>
    <div className="h-px bg-muted/30 my-4" />
    <div className="flex gap-3">
      <div className="h-9 bg-muted/40 rounded-lg flex-1" />
      <div className="h-9 bg-muted/40 rounded-lg flex-1" />
    </div>
  </div>
);

export const Talents = () => {
  const dispatch = useDispatch();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);
  const [filteredTalent, setFilteredTalent] = useState<any[]>([]);

  /* ── Fetch ── */
  useEffect(() => {
    dispatch(resetFilter());
    getAllProfiles()
      .then((res: any) => {
        setTalents(res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  /* ── Sort & Filter merged to prevent circular dependency loops ── */
  useEffect(() => {
    let result = [...talents];
    const currentFilter = filter || {};

    if (currentFilter.name)
      result = result.filter((t) =>
        t.name?.toLowerCase().includes(currentFilter.name.toLowerCase())
      );

    if (currentFilter["Job Title"]?.length)
      result = result.filter((t) =>
        currentFilter["Job Title"].some((title: string) =>
          t.jobTitle?.toLowerCase().includes(title.toLowerCase())
        )
      );

    if (currentFilter.Location?.length)
      result = result.filter((t) =>
        currentFilter.Location.some((loc: string) =>
          t.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );

    if (currentFilter.Skills?.length)
      result = result.filter((t) =>
        currentFilter.Skills.some((skill: string) =>
          t.skills?.some((s: string) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );

    if (currentFilter.exp?.length === 2)
      result = result.filter(
        (t) => t.totalExp >= currentFilter.exp[0] && t.totalExp <= currentFilter.exp[1]
      );

    // 2. Apply Sort to the filtered results
    if (sort === "experience: low to high") {
      result.sort((a, b) => a.totalExp - b.totalExp);
    } else if (sort === "experience: high to low") {
      result.sort((a, b) => b.totalExp - a.totalExp);
    }

    setFilteredTalent(result);
  }, [filter, sort, talents]);

  return (
    <div className="mt-12 pb-12">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-linear-to-b from-primary to-primary/60 rounded-full" />
            <h2 className="text-3xl font-bold text-foreground">
              Find Your Dream Talent
            </h2>
          </div>
          <p className="text-muted-foreground ml-5 text-sm">
            {loading
              ? "Loading talents…"
              : `${filteredTalent.length} talent${filteredTalent.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <Sort sort="talent" />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredTalent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTalent.map((talent: any, idx: number) => (
            <TalentCard key={idx} {...talent} />
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative p-8 bg-muted/10 backdrop-blur-xl rounded-2xl border border-border/20">
              <IconMoodSad
                className="w-16 h-16 text-primary/50 mx-auto mb-4"
                stroke={1.2}
              />
              <h3 className="text-2xl font-bold text-foreground text-center mb-2">
                No Talents Found
              </h3>
              <p className="text-muted-foreground text-center max-w-sm text-sm leading-relaxed">
                We couldn't find any talents matching your criteria. Try
                adjusting your filters or search terms.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
