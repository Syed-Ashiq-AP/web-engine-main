import { Combobox } from "@/components/ui/combobox";
import React, { createElement, useCallback, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  StyleControllerKeys,
  styleControllers,
} from "./controls/styleControllers";
import { useClassName } from "@/app/providers/class-provider";
import { DropdownEditor } from "./editors/DropdownEditor";
import { classStates } from "./utils";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export const ClassProperty = ({ className }: { className: ClassNameValue }) => {
  const ClassNameContext = useClassName();
  if (!ClassNameContext) return;
  const {
    classes = {},
    setClass,
    activeClass = "",
    getClass,
    addClassProperty,
  } = ClassNameContext;

  const [classState, setClassState] = useState("default");

  const handleSetClassStyle = useCallback(
    (control: string, val: any) => {
      if (!activeClass) return;
      setClass(
        control,
        val(classes[activeClass][classState][control]),
        classState
      );
    },
    [activeClass && classes[activeClass]]
  );

  return (
    <div className={cn(className)}>
      {activeClass && (
        <>
          <div className="flex flex-col items-stretch p-2">
            <DropdownEditor
              title="Element State"
              values={Object.keys(classStates)}
              value={classState}
              onSelect={(val) => {
                setClassState(val);
              }}
            />
          </div>
          <Combobox
            placeholder="Add Property"
            value={null}
            checkbox={false}
            triggerClassName="w-full"
            notFound={"No Properties Found"}
            items={Object.keys(styleControllers)
              .map((controller) => ({
                value: controller,
                label: controller,
              }))
              .filter(
                (x) => !Object.keys(getClass(classState)).includes(x.value)
              )}
            onSelect={(val: string) => addClassProperty(val, classState)}
          />

          <Accordion type="single" collapsible>
            {Object.keys(getClass(classState)).map((control, index) => (
              <AccordionItem value={control} key={index}>
                <AccordionTrigger>{control}</AccordionTrigger>
                <AccordionContent>
                  {createElement(
                    styleControllers[control as StyleControllerKeys].Root,
                    {
                      setStyles: (val: any) =>
                        handleSetClassStyle(control, val),
                      styles: classes[activeClass][classState][control],
                    }
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
};
