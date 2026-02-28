"use client";

import { useState } from "react";
import {MultiInput} from "./multi-input";
import { Slider } from "@/components/ui/slider";
import { IconCurrencyRupee, IconChevronDown } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { updateFilter } from "@/modules/redux/filter-slice";
import { dropdownData } from "../data/dropdownData";

const MIN_LPA = 0;
const MAX_LPA = 100;

export const SearchBar = () => {
  const dispatch = useDispatch();
  const [range, setRange] = useState<[number, number]>([MIN_LPA, MAX_LPA]);
  const [salaryOpen, setSalaryOpen] = useState(false);

  const handleRangeChange = (vals: number[]) => {
    const next: [number, number] = [vals[0], vals[1]];
    setRange(next);
    dispatch(updateFilter({ packageOffered: next }));
  };

  return (
    <div className="relative z-50 bg-popover/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/20 p-3 hover:border-border/40 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 items-stretch">
        {/* ── Dropdown filters ── */}
        {dropdownData.map((item, index) => (
          <div key={index} className="relative">
            <MultiInput {...item} />
            {/* Vertical divider between columns on large screens */}
            {index < dropdownData.length - 1 && (
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/30" />
            )}
          </div>
        ))}

        {/* ── Salary Range Column ── */}
        <div className="relative">
          {/* Vertical divider before salary */}
          <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/30" />

          <div className="">
            {/* Trigger row */}
            <button
              type="button"
              onClick={() => setSalaryOpen((v) => !v)}
              className="group w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer"
            >
              {/* Icon badge */}
              <div className="p-2 bg-linear-to-br from-primary to-primary/80 rounded-lg shadow-lg shadow-primary/20 shrink-0">
                <IconCurrencyRupee className="w-4 h-4 text-primary-foreground" />
              </div>

              {/* Label + current value */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs text-muted-foreground leading-none mb-0.5">
                  Package (LPA)
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {range[0] === MIN_LPA && range[1] === MAX_LPA
                    ? "Any"
                    : `${range[0]} – ${range[1]} LPA`}
                </p>
              </div>

              <IconChevronDown
                size={15}
                className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                  salaryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ── Expandable slider panel ── */}
            {salaryOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl p-4">
                {/* Range labels */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    Min salary
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Max salary
                  </span>
                </div>

                {/* Dual-handle slider — shadcn Slider with value array */}
                <Slider
                  min={MIN_LPA}
                  max={MAX_LPA}
                  step={1}
                  value={range}
                  onValueChange={handleRangeChange}
                  className="mb-4"
                />

                {/* Bubble values */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <IconCurrencyRupee size={13} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {range[0]} LPA
                    </span>
                  </div>

                  <div className="w-4 h-px bg-border/60 shrink-0" />

                  <div className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <IconCurrencyRupee size={13} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {range[1] >= MAX_LPA ? `${MAX_LPA}+` : `${range[1]} LPA`}
                    </span>
                  </div>
                </div>

                {/* Reset */}
                {(range[0] !== MIN_LPA || range[1] !== MAX_LPA) && (
                  <button
                    type="button"
                    onClick={() => {
                      setRange([MIN_LPA, MAX_LPA]);
                      dispatch(
                        updateFilter({ packageOffered: [MIN_LPA, MAX_LPA] }),
                      );
                    }}
                    className="w-full mt-3 py-1.5 text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
                  >
                    Reset range
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
