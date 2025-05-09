"use client";
import { ClassStyles, useClassName } from "@/app/providers/class-provider";
import { useEditor } from "@/app/providers/editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Ghost } from "lucide-react";
import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { filterKeys } from "../../right-side-bar/controls/utils";
import { useGlobalStyle } from "@/app/providers/style-provider";
import { ClassItem } from "./class-item";

export const Classes = () => {
  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;

  const classNameContext = useClassName();
  if (!classNameContext) return;

  const { removeStyle } = globalStyleContext;
  const { classes, removeClass, addClass, activeClass, setActiveClass } =
    classNameContext;

  const classNameInput = useRef<HTMLInputElement | null>(null);

  return (
    <div className={cn("flex-col items-stretch gap-2 p-2 w-full flex")}>
      <div className="flex gap-2 w-full">
        <Input placeholder="Enter Class Name" ref={classNameInput} />

        <Button
          variant={"ghost"}
          onClick={() => {
            if (!classNameInput.current) return;
            const value = classNameInput.current.value;
            if (!value || value.length === 0) return;
            addClass(value);
            classNameInput.current.value = "";
          }}
        >
          <FaPlus />
        </Button>
      </div>
      {Object.keys(classes).map((className: string, index) => (
        <ClassItem
          key={index}
          item={{
            label: className,
            value: className,
          }}
          onClick={(val: string) => setActiveClass(val)}
          active={className === activeClass}
          onDelete={(val: string) => {
            removeClass(val);
          }}
        />
      ))}
    </div>
  );
};
