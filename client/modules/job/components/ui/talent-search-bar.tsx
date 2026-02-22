"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { IconUser } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { updateFilter } from "@/modules/redux/filter-slice";
import { MultiInput } from "./multi-input";
import { searchFields } from "../data/find-talent";

const MIN_EXP = 0;
const MAX_EXP = 50;

export const SearchBar = () => {
  const dispatch = useDispatch();
  const [expRange, setExpRange] = useState<[number, number]>([1, MAX_EXP]);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    dispatch(updateFilter({ name: e.target.value }));
  };

  const handleExpChange = (vals: number[]) => {
    const next: [number, number] = [vals[0], vals[1]];
    setExpRange(next);
    dispatch(updateFilter({ exp: next }));
  };

  return (
    <div className="bg-mine-shaft-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/20 p-6 hover:border-border/40 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1 bg-linear-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-xl font-bold text-foreground">Find Talent</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* ── Name input — replaces Mantine Input variant="unstyled" ── */}
        <div className="relative">
          <div className="flex items-center gap-3 px-3 py-2 bg-input/20 hover:bg-input/30 transition-all rounded-lg group border border-border hover:border-primary/40">
            {/* Icon badge — replaces inline gradient div */}
            <div className="p-2 bg-linear-to-br from-primary to-primary/80 rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow shrink-0">
              <IconUser className="w-4 h-4 text-primary-foreground" stroke={2} />
            </div>
            <input
              type="text"
              placeholder="Talent Name"
              value={name}
              onChange={handleNameChange}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
            />
          </div>
        </div>

        {/* ── Dropdown multi-select filters ── */}
        {searchFields.map((item, index) => (
          <div key={index} className="relative">
            <MultiInput {...item} />
          </div>
        ))}

        {/* ── Experience Range Slider — replaces Mantine RangeSlider ── */}
        <div className="lg:col-span-1">
          <div className="px-3 py-3 bg-input/20 hover:bg-input/30 transition-all rounded-lg border border-border hover:border-primary/40 group">
            {/* Label + current range badge */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Experience
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                {expRange[0]}–{expRange[1] >= MAX_EXP ? `${MAX_EXP}+` : expRange[1]} Yrs
              </span>
            </div>

            {/* shadcn Slider in range mode (value array → dual thumb) */}
            <Slider
              min={MIN_EXP}
              max={MAX_EXP}
              step={1}
              value={expRange}
              onValueChange={handleExpChange}
              className="mt-1"
            />

            {/* Min / Max labels */}
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">{MIN_EXP} yr</span>
              <span className="text-xs text-muted-foreground">{MAX_EXP}+ yr</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
