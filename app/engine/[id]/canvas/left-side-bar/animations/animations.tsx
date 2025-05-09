import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { ClassItem } from "../classes/class-item";
import { filterKeys } from "../../right-side-bar/controls/utils";
import { useGlobalStyle } from "@/app/providers/style-provider";
import { useAnimations } from "@/app/providers/animation-provider";

export const Animations = () => {
  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;
  const { removeStyle } = globalStyleContext;
  const AnimationsContext = useAnimations();
  if (!AnimationsContext) return;
  const {
    animations,
    setAnimations,
    activeAnimation,
    setActiveAnimation,
    setTime,
  } = AnimationsContext;

  const animationNameInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={"flex flex-col items-stretch gap-2 p-2 w-full"}>
      <div className="flex gap-2 w-full">
        <Input placeholder="Enter Animation Name" ref={animationNameInputRef} />

        <Button
          variant={"ghost"}
          onClick={() => {
            if (!animationNameInputRef.current) return;
            const value = animationNameInputRef.current.value;
            if (!value || value.length === 0) return;
            setAnimations((prev) => {
              if (Object.keys(prev).includes(value)) return prev;
              return {
                ...prev,
                [value]: {},
              };
            });
            animationNameInputRef.current.value = "";
          }}
        >
          <FaPlus />
        </Button>
      </div>
      {Object.keys(animations).map((animationName: string, index) => (
        <ClassItem
          key={index}
          item={{
            label: animationName,
            value: animationName,
          }}
          onClick={(val: string) => setActiveAnimation(val)}
          active={animationName === activeAnimation}
          onDelete={(val: string) => {
            setAnimations((prev: any) =>
              filterKeys(prev, (key: string) => key !== val)
            );
            removeStyle(val + "-animation");
            setActiveAnimation((prev: string | null) =>
              prev === val ? "" : prev
            );
            setTime(0);
          }}
        />
      ))}
    </div>
  );
};
