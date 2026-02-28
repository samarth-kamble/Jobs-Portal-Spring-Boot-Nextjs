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
  const formValue = formInputProps.value;

  const [data, setData] = useState<string[]>(props.options || []);
  const [value, setValue] = useState<string>(formValue || "");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  /* Sync when parent form value changes (e.g. edit mode population) */
  useEffect(() => {
    setValue(formValue || "");
  }, [formValue]);

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

  const handleSelect = (val: string) => {
    // val === "__create__" means user typed a custom option
    const chosen = val === "__create__" ? search.trim() : val;
    if (val === "__create__") {
      setData((prev) => [...prev, chosen]);
    }
    setValue(chosen);
    // Support both Mantine-style setFieldValue AND the plain onChange used in Info/ExpInput/CertInput
    if (props.form.setFieldValue) {
      props.form.setFieldValue(props.name, chosen);
    } else {
      formInputProps.onChange?.(chosen);
    }
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {props.label && (
        <Label className="text-foreground/80 font-medium">
          {props.label}
          {props.withAsterisk !== false && (
            <span className="text-primary ml-0.5">*</span>
          )}
        </Label>
      )}

      {/* Trigger button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full flex items-center justify-between gap-2",
              "h-10 px-3 rounded-md text-sm",
              "bg-input/20 border border-border",
              "hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
              "transition-all duration-200",
              !value && "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-2 flex-1 min-w-0">
              {LeftIcon && (
                <LeftIcon className="h-4 w-4 text-primary shrink-0" />
              )}
              <span className="truncate text-left">
                {value || props.placeholder || "Select option..."}
              </span>
            </span>
            <IconChevronDown
              size={16}
              className={cn(
                "text-muted-foreground shrink-0 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        {/* Error message */}
        {(props.error || formInputProps.error) && (
          <p className="text-xs text-destructive mt-1">
            {props.error || formInputProps.error}
          </p>
        )}

        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width] bg-popover border border-border/40 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden"
          align="start"
          sideOffset={6}
        >
          <Command className="bg-transparent" shouldFilter={false}>
            {/* Search input — replicates Mantine's Combobox search */}
            <div className="border-b border-border/30">
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder="Search..."
                className="h-9 bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <CommandList className="max-h-[200px]">
              <CommandEmpty className="py-3 px-3 text-sm text-muted-foreground">
                {search.trim().length > 0 ? (
                  <span>No match found.</span>
                ) : (
                  <span>Start typing to search.</span>
                )}
              </CommandEmpty>

              <CommandGroup>
                {filtered.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-foreground hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                  >
                    <span>{item}</span>
                    {value === item && (
                      <IconCheck size={14} className="text-primary shrink-0" />
                    )}
                  </CommandItem>
                ))}

                {/* Creatable option — replicates Mantine's $create */}
                {!exactMatch && search.trim().length > 0 && (
                  <CommandItem
                    value="__create__"
                    onSelect={() => handleSelect("__create__")}
                    className="px-3 py-2 rounded-lg cursor-pointer text-primary font-medium hover:bg-primary/10 aria-selected:bg-primary/10 transition-colors"
                  >
                    + Create &ldquo;{search}&rdquo;
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
