import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
type GroupToggleEditorType = {
  title?: string;
  onChange: (val: string) => void;
  value?: string;
  items?: [string, any][];
  className?: string;
};
export const GroupToggleEditor = ({
  title,
  onChange,
  value,
  items,
  className,
}: GroupToggleEditorType) => {
  return (
    <div className={cn("flex justify-between", className)}>
      <Label htmlFor="typographydropdown">{title}</Label>
      <ToggleGroup type={"single"} onValueChange={onChange} value={value}>
        {items &&
          items.map((item, index) => (
            <ToggleGroupItem
              value={item[0]}
              aria-label={`Toggle ${item[0]}`}
              key={index}
            >
              {item[1]}
            </ToggleGroupItem>
          ))}
      </ToggleGroup>
    </div>
  );
};
