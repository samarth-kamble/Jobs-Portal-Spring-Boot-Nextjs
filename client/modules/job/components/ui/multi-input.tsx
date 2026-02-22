"use client";

import { useState, useEffect, useRef } from "react";
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
import { IconSelector, IconX, IconCheck } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { updateFilter } from "@/modules/redux/filter-slice";

interface MultiInputProps {
  title: string;
  icon: React.ComponentType<any>;
  options: string[];
}

export const MultiInput: React.FC<MultiInputProps> = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string[]>(props.options || []);
  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const Icon = props.icon;

  useEffect(() => {
    setData(props.options);
  }, [props.options]);

  const lastDispatchedValue = useRef<string[]>([]);
  useEffect(() => {
    // Only dispatch if the content actually changed to stop Redux loop
    if (JSON.stringify(lastDispatchedValue.current) !== JSON.stringify(value)) {
      lastDispatchedValue.current = value;
      dispatch(updateFilter({ [props.title]: value }));
    }
  }, [value, props.title, dispatch]);

  const exactMatch = data.some(
    (item) => item.toLowerCase() === search.toLowerCase()
  );

  const filtered = data.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggle = (val: string) =>
    setValue((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const remove = (val: string) =>
    setValue((prev) => prev.filter((v) => v !== val));

  const handleSelect = (val: string) => {
    if (val === "__create__") {
      const trimmed = search.trim();
      setData((prev) => [...prev, trimmed]);
      setValue((prev) => [...prev, trimmed]);
    } else {
      toggle(val);
    }
    setSearch("");
  };

  /* Show first selected pill + overflow count */
  const firstSelected = value[0];
  const overflow = value.length - 1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Trigger — replaces PillsInput + Combobox.DropdownTarget */}
        <button
          type="button"
          className="group w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-mine-shaft-800/50 transition-all duration-200 cursor-pointer"
        >
          {/* Icon badge */}
          <div className="p-2 bg-linear-to-br from-primary to-primary/80 rounded-lg shadow-lg shadow-primary/20 shrink-0">
            <Icon className="w-4 h-4 text-primary-foreground" />
          </div>

          {/* Pills / placeholder */}
          <div className="flex-1 flex items-center gap-1.5 min-w-0 text-left">
            {value.length === 0 ? (
              <span className="text-muted-foreground text-sm truncate">
                {props.title}
              </span>
            ) : (
              <>
                {/* First pill */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-muted/40 border border-border/30 rounded-md text-foreground text-xs font-medium max-w-[110px] truncate">
                  {firstSelected}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      remove(firstSelected);
                    }}
                    className="text-muted-foreground hover:text-foreground ml-0.5 shrink-0"
                  >
                    <IconX size={10} />
                  </button>
                </span>

                {/* Overflow pill */}
                {overflow > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-muted/30 border border-border/20 rounded-md text-muted-foreground text-xs shrink-0">
                    +{overflow}
                  </span>
                )}
              </>
            )}
          </div>

          <IconSelector
            size={15}
            className={cn(
              "text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-64 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <Command className="bg-transparent">
          {/* Search — replaces Combobox.Search */}
          <div className="border-b border-border/30">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={`Search ${props.title}…`}
              className="h-9 bg-mine-shaft-900/50 text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          <CommandList className="max-h-[220px] py-1">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              {search.trim() ? "No match." : `Search ${props.title}`}
            </CommandEmpty>

            <CommandGroup>
              {filtered.map((item) => {
                const checked = value.includes(item);
                return (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2.5 mx-1 px-3 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                  >
                    {/* Checkbox — replaces Mantine Checkbox */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                        checked
                          ? "bg-primary border-primary"
                          : "border-border/60 bg-transparent"
                      )}
                    >
                      {checked && <IconCheck size={10} className="text-primary-foreground" stroke={3} />}
                    </div>
                    <span>{item}</span>
                  </CommandItem>
                );
              })}

              {/* Creatable option — replaces $create */}
              {!exactMatch && search.trim().length > 0 && (
                <CommandItem
                  value="__create__"
                  onSelect={() => handleSelect("__create__")}
                  className="mx-1 px-3 py-2 rounded-lg cursor-pointer text-sm text-primary font-medium hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                >
                  + Create &ldquo;{search.trim()}&rdquo;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>

          {/* Selected count footer */}
          {value.length > 0 && (
            <div className="border-t border-border/30 px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {value.length} selected
              </span>
              <button
                type="button"
                onClick={() => setValue([])}
                className="text-xs text-destructive hover:text-destructive/80 transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
