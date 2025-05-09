import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export function Combobox({
  placeholder = "Select item...",
  value,
  onSelect,
  checkbox = true,
  triggerClassName = "",
  commandClassName = "",
  items,
  notFound = "Not found.",
}: any) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", triggerClassName)}
        >
          {value ?? placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", commandClassName)}>
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              <List
                height={200}
                itemCount={items.length}
                itemSize={35}
                width="100%"
              >
                {({ index, style }) => {
                  const item = items[index];
                  return (
                    <div style={style}>
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          onSelect(currentValue, item.label);
                          setOpen(false);
                        }}
                      >
                        {checkbox && (
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === item.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        )}
                        {item.label}
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
