"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { IconAdjustments, IconCheck } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { updateSort } from "@/modules/redux/sort-slice";

const jobSortOptions = [
  "relevance",
  "most recent",
  "salary (low-high)",
  "salary (high-low)",
];

const talentSortOptions = [
  "relevance",
  "experience: low to high",
  "experience: high to low",
];

export const Sort = (props: any) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("relevance");

  const sortOptions = props.sort === "job" ? jobSortOptions : talentSortOptions;

  const filtered = sortOptions.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (val: string) => {
    setSelected(val);
    dispatch(updateSort(val));
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Trigger — replaces Combobox.Target */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-primary/30 rounded-lg transition-all duration-300 group backdrop-blur-sm"
        >
          <IconAdjustments
            className={cn(
              "w-5 h-5 text-primary transition-transform duration-300",
              open && "rotate-90"
            )}
          />
          <span className="text-foreground font-medium capitalize text-sm">
            {selected}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="p-0 w-72 bg-mine-shaft-800 border border-border/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        <Command className="bg-transparent">
          <div className="border-b border-border/30">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search options…"
              className="h-9 bg-mine-shaft-900/50 text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          <CommandList className="max-h-[200px] py-1">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              No options found
            </CommandEmpty>

            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between mx-1 px-3 py-2.5 rounded-lg cursor-pointer text-sm capitalize text-foreground hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                >
                  <span>{item}</span>
                  {selected === item && (
                    <IconCheck size={14} className="text-primary shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
