"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  KebabCase,
  semiKebabCase,
} from "../engine/[id]/canvas/right-side-bar/controls/utils";
import { useGlobalStyle } from "./style-provider";
import {
  classStateKeys,
  classStates,
} from "../engine/[id]/canvas/right-side-bar/utils";

export type ClassStyles = {
  [key: string]: { [style: string]: any };
};
export type classStateType = { [state: string]: ClassStyles };
type ClassNameContextType = {
  classes: { [key: string]: classStateType };
  addClass: (name: string) => void;
  addClassProperty: (val: string, state: string) => void;
  removeClass: (name: string) => void;
  setClass: (key: string, data: ClassStyles, state: string) => void;
  getClass: (state: string) => ClassStyles;
  setClasses: React.Dispatch<
    React.SetStateAction<{ [key: string]: classStateType }>
  >;
  activeClass: string | null;
  setActiveClass: React.Dispatch<React.SetStateAction<string | null>>;
};

const ClassNameContext = createContext<ClassNameContextType | null>(null);
export const ClassNameContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [classes, setClasses] = useState<{ [key: string]: classStateType }>({});
  const [activeClass, setActiveClass] = useState<string | null>(null);

  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;
  const { addStyle, removeStyle } = globalStyleContext;

  useEffect(() => {
    if (!activeClass) return;
    let finalClassCSS = "";
    Object.entries(classes[activeClass]).forEach(([state, controls]) =>
      Object.entries(controls).forEach(([control, styleEntry], _) => {
        let classStyles: { [key: string]: ClassStyles } = {};
        Object.entries(styleEntry).forEach(([style, value]: any, _) => {
          classStyles[KebabCase(style)] = value;
        });
        finalClassCSS += `.${activeClass.replace(/\s+/g, "_")}${
          classStates[state as classStateKeys]
        } {
            ${Object.entries(classStyles)
              .map(([style, value]: any) => `${style}: ${value};`)
              .join("\n")}
        }\n`;
      })
    );
    addStyle(activeClass + "-class", finalClassCSS);
  }, [activeClass && activeClass.length > 0 && classes[activeClass]]);

  const value = useMemo(
    () => ({
      classes,
      addClass: (name: string) => {
        setClasses((prev) => ({ ...prev, [name]: { default: {} } }));
      },
      addClassProperty: (val: string, state: string) => {
        if (!activeClass) return;
        setClasses((prev) => ({
          ...prev,
          [activeClass]: {
            ...prev[activeClass],
            [state]: { ...prev[activeClass][state], [val]: {} },
          },
        }));
      },
      removeClass: (name: string) => {
        setClasses((prev) => {
          const cur = { ...prev };
          delete cur[name];
          return cur;
        });
        removeStyle(name + "-class");
        setActiveClass((prev) => (prev === name ? "" : prev));
      },
      setClass: (key: string, data: ClassStyles, state: string) => {
        if (!activeClass) return;
        setClasses((prev) => ({
          ...prev,
          [activeClass]: {
            ...prev[activeClass],
            [state]: { ...prev[activeClass][state], [key]: data },
          },
        }));
      },
      getClass: (state: string) => {
        if (!activeClass) return {};
        return classes[activeClass][state] ?? {};
      },
      setClasses,
      activeClass,
      setActiveClass,
    }),

    [classes, activeClass]
  );
  return (
    <ClassNameContext.Provider value={value}>
      {children}
    </ClassNameContext.Provider>
  );
};
export const useClassName = () => {
  const context = useContext(ClassNameContext);
  if (context === undefined) {
    throw new Error(
      "useClassName must be used within a ClassNameContextProvider"
    );
  }
  return context;
};
