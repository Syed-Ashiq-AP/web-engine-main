import { Button } from "@/components/ui/button";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import React, { createElement, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Combobox } from "@/components/ui/combobox";
import {
  StyleControllerKeys,
  styleControllers,
  Styles,
} from "./controls/styleControllers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAnimations } from "@/app/providers/animation-provider";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const AnimationProperty = ({
  className,
}: {
  className: ClassNameValue;
}) => {
  const AnimationsContext = useAnimations();
  if (!AnimationsContext) return;

  const { animations, setAnimations, activeAnimation, time, setTime } =
    AnimationsContext;

  const [animationStyles, setAnimationStyles] = useState<Styles | null>(null);

  const [animationStyleControlls, setAnimationStyleControlls] = useState<
    string[]
  >([]);

  const [styleControlls, setStyleControlls] = useState<string[]>([]);

  const handleSetAnimationStyles = (val: any) => {
    if (!activeAnimation || !animationStyles) return;
    const cur = val(animationStyles);

    setAnimations((prev: any) => ({
      ...prev,
      [activeAnimation]: { ...prev[activeAnimation], [time]: cur },
    }));

    setAnimationStyles(cur);
  };

  const handleSetKeyTo = (dir: number) => {
    if (!activeAnimation) return;
    const animation = animations[activeAnimation];
    if (!animation) return;
    const positions = Object.keys(animation).map((pos) => {
      return parseInt(pos);
    });
    const curPos = positions.indexOf(time);
    let nextPos = -1;
    if (curPos === -1) {
      let nearest = time;
      if (dir === 0) {
        positions.forEach((pos) => {
          if (pos < nearest) {
            nearest = pos;
          }
        });
      } else if (dir === 1) {
        positions.forEach((pos) => {
          if (pos > nearest) {
            nearest = pos;
          }
        });
      }
      nextPos = nearest;
    } else {
      nextPos =
        dir === 0
          ? curPos - 1
          : curPos + 1 === positions.length
          ? 0
          : curPos + 1;
    }
    const nexTime =
      nextPos === -1
        ? positions.at(nextPos)
        : positions.find((pos) => pos === nextPos);
    if (nexTime === undefined) return;
    setTime(nexTime);
  };

  const deepFilter = (l1: any, l2: any) => {
    let isTrue = false;
    l1.forEach((i1: any) => {
      l2.forEach((i2: any) => {
        if (i1.includes(i2)) {
          isTrue = true;
          return;
        }
      });
    });
    return isTrue;
  };
  const handleAnimationUpdate = (useData = animations) => {
    if (!useData || !activeAnimation) return;
    const animation = useData[activeAnimation];
    if (!animation) return;
    const styles = animation[time];
    if (!animation[time]) {
      setAnimationStyleControlls([]);
      setAnimationStyles({});
      return;
    }
    setAnimationStyleControlls(
      Object.keys(styleControllers).filter((clsx, _) => {
        return deepFilter(
          Object.keys(styles),
          styleControllers[clsx as StyleControllerKeys].Styles
        );
      })
    );
    setAnimationStyles(styles);
  };

  const handleAddKey = () => {
    if (!activeAnimation) return;
    const animation = animations[activeAnimation];
    if (animation && !animation[time]) {
      let cur = null;
      setAnimations((prev: any) => {
        cur = {
          ...prev,
          [activeAnimation]: { ...prev[activeAnimation], [time]: {} },
        };
        return cur;
      });
      if (!cur) return;
      handleAnimationUpdate(cur);
    }
  };
  const handleRemoveKey = () => {
    if (!activeAnimation) return;
    const animation = animations[activeAnimation];
    if (animation && animation[time]) {
      let cur = null;
      setAnimations((prev: any) => {
        cur = {
          ...prev,
          [activeAnimation]: Object.fromEntries(
            Object.entries(prev[activeAnimation]).filter(
              (data: any) => data[0] !== time.toString()
            )
          ),
        };
        return cur;
      });
      if (!cur) return;
      handleAnimationUpdate(cur);
    }
  };
  if (!activeAnimation) return <></>;
  return (
    <div className={cn(className)}>
      <div className="flex flex-col items-strech gap-2 pt-2 pb-4">
        <span className="text-sm font-medium">AT : {time}%</span>
        <div className="flex gap-2 justify-between">
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => handleSetKeyTo(0)}
          >
            <TiChevronLeft />
          </Button>
          {!animations[activeAnimation][time] ? (
            <Button variant={"ghost"} onClick={handleAddKey}>
              <FaPlus /> Add Keyframe
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={handleRemoveKey}>
              <FaTrash /> Remove Keyframe
            </Button>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => handleSetKeyTo(1)}
          >
            <TiChevronRight />
          </Button>
        </div>
      </div>
      {animations[activeAnimation][time] && (
        <>
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
                (x) =>
                  !styleControlls.includes(x.value) && x.value !== "Animation"
              )}
            onSelect={(val: string) =>
              setAnimationStyleControlls((prev) => [...prev, val])
            }
          />
          <Accordion type="single" collapsible>
            {animationStyleControlls.map((control, index) => (
              <AccordionItem value={control} key={index}>
                <AccordionTrigger>{control}</AccordionTrigger>
                <AccordionContent>
                  {createElement(
                    styleControllers[control as StyleControllerKeys].Root,
                    {
                      setStyles: handleSetAnimationStyles,
                      styles: animationStyles,
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
