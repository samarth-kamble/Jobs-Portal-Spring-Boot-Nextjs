"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { IconChevronDown, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const SelectInput = (props: any) => {
  const formInputProps = props.form.getInputProps(props.name);
  const formValue = formInputProps.value ?? "";

  const [data, setData] = useState<string[]>(props.options || []);
  const [value, setValue] = useState<string>(formValue);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  /* Sync when parent resets or sets values (edit mode) */
  useEffect(() => {
    setValue(formValue);
    setData(props.options || []);
  }, [formValue, props.options]);

  const LeftIcon = props.leftSection;

  const exactMatch = data.some(
    (item) => item.toLowerCase() === search.toLowerCase()
  );

  const filtered =
    search.trim() === ""
      ? data
      : data.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase().trim())
        );

  const commit = (chosen: string) => {
    setValue(chosen);
    /* Support both Mantine useForm (setFieldValue) and plain onChange */
    if (props.form.setFieldValue) {
      props.form.setFieldValue(props.name, chosen);
    } else {
      formInputProps.onChange?.(chosen);
    }
    setSearch("");
    setOpen(false);
  };

  const handleSelect = (val: string) => {
    if (val === "__create__") {
      const trimmed = search.trim();
      setData((prev) => [...prev, trimmed]);
      commit(trimmed);
    } else {
      commit(val);
    }
  };

  const error = props.error || formInputProps.error;

  return (
    <div className="space-y-1.5 w-full">
      {/* Label */}
      {props.label && (
        <Label className="text-foreground/80 font-medium text-sm">
          {props.label}
          <span className="text-primary ml-0.5">*</span>
        </Label>
      )}

      {/* Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full flex items-center justify-between gap-2 h-10 px-3 rounded-lg text-sm",
              "bg-input/20 border transition-all duration-200",
              error
                ? "border-destructive focus:ring-destructive"
                : "border-border hover:border-primary/50 focus:ring-primary focus:border-primary",
              "focus:outline-none focus:ring-1",
              !value && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2 flex-1 min-w-0">
              {LeftIcon && (
                <LeftIcon className="h-4 w-4 text-primary shrink-0" />
              )}
              <span className={cn("truncate text-left", value ? "text-foreground" : "text-muted-foreground")}>
                {value || props.placeholder || "Select..."}
              </span>
            </span>
            <IconChevronDown
              size={15}
              className={cn(
                "text-muted-foreground shrink-0 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 bg-mine-shaft-900 border border-border/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          align="start"
          sideOffset={6}
        >
          <Command className="bg-transparent">
            <div className="border-b border-border/30 px-1 pt-1">
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder="Search or type to create..."
                className="h-9 bg-transparent text-foreground placeholder:text-muted-foreground text-sm border-0 focus:ring-0"
              />
            </div>

            <CommandList className="max-h-[200px] py-1">
              <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                {search.trim() ? "No match." : "Type to search."}
              </CommandEmpty>

              <CommandGroup>
                {filtered.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center justify-between mx-1 px-3 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                  >
                    <span>{item}</span>
                    {value === item && (
                      <IconCheck size={14} className="text-primary shrink-0" />
                    )}
                  </CommandItem>
                ))}

                {/* Creatable option */}
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
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
