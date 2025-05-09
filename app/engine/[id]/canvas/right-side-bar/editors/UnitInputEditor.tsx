import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type UnitInputType = {
  disabled: boolean;
  value: string;
  inputClassName: ClassNameValue;
  units: string[];
  unitClassName: ClassNameValue;
  onInput: (...args: any[]) => void;
  parameters: any[];
};
const splitUnit = (v: string) => {
  const match = /^(-?\d+(?:\.\d*|\.)?)([a-zA-Z%]+)?$/.exec(v);
  if (!match) return [null, null];
  return [match[1], match[2]];
};

const UnitInput = ({
  disabled,
  value,
  units,
  unitClassName,
  inputClassName,
  onInput,
  parameters,
}: UnitInputType) => {
  const [unitVal, setUnitVal] = useState(units[0]);
  const unitsOBJ = units;

  useEffect(() => {
    const unit = splitUnit(value)[1];
    if (!unit) return;
    if (units.includes(unit as string)) {
      setUnitVal(unit as string);
    }
  }, []);
  return (
    <>
      <Input
        disabled={disabled}
        value={splitUnit(value)[0] ?? ""}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          let val = e.target?.value;
          if (val.length !== 0) {
            onInput(...parameters, `${val}${unitVal}`);
          } else {
            onInput(...parameters, ``);
          }
        }}
        className={cn(
          "text-center p-1 border-0 !bg-transparent min-w-auto focus-visible:border",
          inputClassName
        )}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-min p-2 text-neutral-500">
            <span>{unitVal}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn("w-fit min-w-auto", unitClassName)}>
          {unitsOBJ.map((unit: any) => {
            return (
              <DropdownMenuItem
                onSelect={() => {
                  setUnitVal(unit);
                  if (value.length !== 0) {
                    onInput(...parameters, `${value}${unit}`);
                  } else {
                    onInput(...parameters, ``);
                  }
                }}
                key={unit}
              >
                {unit}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const UnitInputEditor = ({
  children,
  childrenclassName = "",
  childrenInputclassName = "",
  title,
  units = ["px", "rem", "em", "%"],
  value,
  parentClassName,
  className,
  titleClassName = "",
  inputClassName = "",
  unitClassName = "",
  onInput,
  parameters = [],
  disabled = false,
}: any) => {
  return (
    <div className={cn("flex flex-col gap-4", parentClassName)}>
      {title && (
        <Label htmlFor="unitinputeditor" className={titleClassName}>
          {title}
        </Label>
      )}

      <div className={cn("border rounded flex justify-between", className)}>
        {children ? (
          <>
            <div className={cn("", childrenInputclassName)}>
              <UnitInput
                disabled={disabled}
                value={value}
                inputClassName={inputClassName}
                units={units}
                unitClassName={unitClassName}
                onInput={onInput}
                parameters={parameters}
              />
            </div>
            <div className={cn("", childrenclassName)}>{children}</div>
          </>
        ) : (
          <UnitInput
            disabled={disabled}
            value={value}
            inputClassName={inputClassName}
            units={units}
            unitClassName={unitClassName}
            onInput={onInput}
            parameters={parameters}
          />
        )}
      </div>
    </div>
  );
};
