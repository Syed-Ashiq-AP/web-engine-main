import { Label } from "@/components/ui/label";
import { cn, rgbAString } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker, { themes } from "react-pick-color";

export const ColorInputEditor = ({
  title,
  disabled = false,
  value,
  triggerClassName = "",
  className = "",
  style = {},
  onChange = () => {},
}: any) => {
  return (
    <div className={cn("flex justify-between", className)} style={style}>
      <Label htmlFor="dropdowneditor">{title}</Label>
      <div
        className={cn(
          "border rounded p-1 flex gap-2 items-center w-max justify-between",
          triggerClassName
        )}
      >
        <Popover>
          <PopoverTrigger disabled={disabled}>
            <div
              className="size-8 rounded"
              style={{
                backgroundColor:
                  (typeof value === "object" ? rgbAString(value) : value) ??
                  "#000",
              }}
            ></div>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-transparent border-none -translate-x-2">
            <ColorPicker
              color={value}
              theme={themes.dark}
              onChange={(val) =>
                onChange(rgbAString({ ...val.rgb, a: val.alpha }))
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
