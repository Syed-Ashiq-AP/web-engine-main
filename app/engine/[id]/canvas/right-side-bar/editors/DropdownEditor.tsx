import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";
type DropdownEditorType = {
  title?: string;
  values: string[] | { [key: string]: string };
  value: string;
  triggerclassName?: ClassNameValue;
  onSelect: (val: string) => void;
};
export const DropdownEditor = ({
  title,
  values,
  value,
  triggerclassName = "",
  onSelect = () => {},
}: DropdownEditorType) => {
  return (
    <div className="flex justify-between">
      {title && <Label htmlFor="dropdowneditor">{title}</Label>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn("flex justify-between", triggerclassName)}
          >
            <span className=" capitalize">
              {Array.isArray(values) ? value : values[value]}
            </span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Array.isArray(values)
            ? values.map((val: string, ind: number) => {
                return (
                  <DropdownMenuItem
                    onSelect={() => {
                      onSelect(val);
                    }}
                    key={ind}
                  >
                    {val}
                  </DropdownMenuItem>
                );
              })
            : Object.entries(values).map(([key, val]: any, ind: number) => {
                return (
                  <DropdownMenuItem
                    onSelect={() => {
                      onSelect(key);
                    }}
                    key={ind}
                  >
                    {val}
                  </DropdownMenuItem>
                );
              })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
