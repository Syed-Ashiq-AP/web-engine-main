"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { underCase } from "../engine/[id]/node/utils";

type JSContextType = {
  globalVariables: { [key: string]: string };
  setGlobalVariables: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  getVariable: (name: string) => any;
  setVariable: (name: string, value: any) => void;
  globalFunctions: {
    [name: string]: { [key: string]: any };
  };
  setGlobalFunctions: React.Dispatch<
    React.SetStateAction<{
      [name: string]: { [key: string]: any };
    }>
  >;
  getFunction: (name: string, key?: string) => any;
  setFunction: (name: string, key: string | null, value: any) => void;
  activeFunction: string | null;
  setActiveFunction: React.Dispatch<React.SetStateAction<string | null>>;
  JSInstance: any;
  setJSInstance: React.Dispatch<React.SetStateAction<any>>;
  JSFlow: string;
  setJSFlow: React.Dispatch<React.SetStateAction<string>>;
  JS: string;
  setJS: React.Dispatch<React.SetStateAction<string>>;
};

export const JSContext = createContext<JSContextType | null>(null);
export const JSContextProvider = ({ children }: { children: ReactNode }) => {
  const [JSFlow, setJSFlow] = useState<string>(
    `{"viewport":{"x":0,"y":0,"zoom":1},"nodes":[
    
    ],"edges":[]}`
  );

  const [globalVariables, setGlobalVariables] = useState<{
    [key: string]: string;
  }>({});
  const [JS, setJS] = useState<string>("");

  const [globalFunctions, setGlobalFunctions] = useState<{
    [name: string]: { [key: string]: any };
  }>({});

  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [JSInstance, setJSInstance] = useState(null);

  const value = useMemo(
    () => ({
      JS,
      setJS,
      globalVariables,
      setGlobalVariables,
      getVariable: (name: string) => {
        const vare = Object.entries(globalVariables).find(
          ([var_name, _]) => var_name === underCase(name)
        );
        if (vare) return vare[1];
      },
      setVariable: (name: string, value: any) => {
        setGlobalVariables((prev) => ({
          ...prev,
          [underCase(name)]: value,
        }));
      },
      globalFunctions,
      setGlobalFunctions,
      getFunction: (name: string, key?: string) => {
        const vare = Object.entries(globalFunctions).find(
          ([fun_name, _]) => fun_name === underCase(name)
        );
        if (vare) {
          if (key) return vare[1][key];
          else return vare[1];
        }
      },
      setFunction: (name: string, key: string | null, value: any) => {
        if (key)
          setGlobalFunctions((prev) => ({
            ...prev,
            [underCase(name)]: {
              ...prev[underCase(name)],
              [key]: value,
            },
          }));
        else
          setGlobalFunctions((prev) => ({
            ...prev,
            [underCase(name)]: value,
          }));
      },
      activeFunction,
      setActiveFunction,
      JSInstance,
      setJSInstance,
      JSFlow,
      setJSFlow,
    }),

    [JS, globalVariables, globalFunctions, activeFunction, JSInstance, JSFlow]
  );
  return <JSContext.Provider value={value}>{children}</JSContext.Provider>;
};
export const useJS = () => {
  const context = useContext(JSContext);
  if (context === undefined) {
    throw new Error(
      "useTypeFace must be used within a TypeFaceContextProvider"
    );
  }
  return context;
};
