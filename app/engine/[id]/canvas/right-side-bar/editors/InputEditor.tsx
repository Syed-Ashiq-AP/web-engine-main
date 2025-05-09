import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { cn } from "@/lib/utils";

type InputEditorType = {
  title: string;
  value: string;
  className: ClassDecorator;
  onInput: (val: string) => void;
  disabled: boolean;
  placeholder: string;
};
export const InputEditor = ({
  title,
  value,
  className,
  onInput,
  disabled = false,
  placeholder = "",
}: any) => {
  return (
    <div className={cn("flex justify-between gap-4", className)}>
      {title && <Label htmlFor="unitinputeditor">{title}</Label>}

      <Input
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target?.value;
          onInput(val);
        }}
        className={"p-1 w-34"}
      />
    </div>
  );
};
