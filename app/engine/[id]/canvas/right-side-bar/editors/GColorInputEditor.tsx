import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReactGPicker from "react-gcolor-picker";

export const GColorInputEditor = ({
  title,
  disabled = false,
  value,
  triggerClassName = "",
  className = "",
  style = {},
  onChange = () => {},
  colorFor = "solid",
  setColorFor = () => {},
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
                [colorFor === "solid" ? "backgroundColor" : "backgroundImage"]:
                  value ?? "",
              }}
            ></div>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-transparent border-none -translate-x-2">
            <ReactGPicker
              value={value}
              onChange={(val) => {
                onChange(val);
              }}
              solid
              gradient
              format="rgb"
              defaultActiveTab={colorFor}
              onChangeTabs={(tab: any) => setColorFor(tab)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
