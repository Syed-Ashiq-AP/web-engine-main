"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { kebabCase } from "../engine/[id]/canvas/right-side-bar/utils";
import { useGlobalStyle } from "./style-provider";
import { ClassStyles } from "./class-provider";

export type AnimationStyles = { [key: string]: any };

export type AnimationPosition = {
  [postion: number]: AnimationStyles;
};

export type Animation = {
  [key: string]: AnimationPosition;
};

type AnimationsContextType = {
  animations: { [key: string]: ClassStyles };
  setAnimations: React.Dispatch<
    React.SetStateAction<{ [key: string]: AnimationStyles }>
  >;
  activeAnimation: string | null;
  setActiveAnimation: React.Dispatch<React.SetStateAction<string | null>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

export const AnimationsContext = createContext<AnimationsContextType | null>(
  null
);
export const AnimationsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [animations, setAnimations] = useState<Animation>({});
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const [time, setTime] = useState<number>(0);

  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;
  const { addStyle } = globalStyleContext;

  useEffect(() => {
    let animationCss: string[] = [];
    let animationStyles: { [key: string]: ClassStyles } = {};
    if (!activeAnimation) return;
    const animation = animations[activeAnimation];
    if (!animation) return;
    Object.entries(animation).forEach(([postion, styles], _) => {
      animationStyles = {};
      Object.entries(styles).forEach(([style, value]: any, _) => {
        animationStyles[kebabCase(style)] = value;
      });
      animationCss.push(`${postion}% {
            ${Object.entries(animationStyles)
              .map(([style, value]: any) => `${style}: ${value};`)
              .join("\n")}
        }`);
    });
    const finalCSS = `
                @keyframes ${activeAnimation.replace(/\s+/g, "_")} {
                     ${animationCss.join("\n")}
                }`;
    addStyle(activeAnimation + "-animation", finalCSS);
  }, [
    activeAnimation &&
      activeAnimation.length > 0 &&
      animations[activeAnimation],
  ]);
  const value = useMemo(
    () => ({
      animations,
      setAnimations,
      activeAnimation,
      setActiveAnimation,
      time,
      setTime,
    }),

    [animations, activeAnimation, time]
  );
  return (
    <AnimationsContext.Provider value={value}>
      {children}
    </AnimationsContext.Provider>
  );
};
export const useAnimations = () => {
  const context = useContext(AnimationsContext);
  if (context === undefined) {
    throw new Error(
      "useTypeFace must be used within a TypeFaceContextProvider"
    );
  }
  return context;
};
