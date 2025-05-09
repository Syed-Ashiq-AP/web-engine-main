"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type GlobalStyleContextType = {
  globalStyles: { [key: string]: string };
  addStyle: (from: string, style: string) => void;
  removeStyle: (from: string) => void;
  setGlobalStyle: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
};
const GlobalStyleContext = createContext<GlobalStyleContextType | null>(null);

export const GlobalStyleContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [globalStyles, setGlobalStyle] = useState<{ [key: string]: string }>(
    {}
  );

  const value = useMemo(
    () => ({
      globalStyles,
      addStyle: (from: string, style: string) => {
        setGlobalStyle((prev) => ({
          ...prev,
          [from]: style,
        }));
      },
      removeStyle: (from: string) => {
        setGlobalStyle((prev) => {
          const cur = { ...prev };
          delete cur[from];
          return cur;
        });
      },
      setGlobalStyle,
    }),
    [globalStyles]
  );

  return (
    <GlobalStyleContext.Provider value={value}>
      {children}
    </GlobalStyleContext.Provider>
  );
};

export const useGlobalStyle = () => {
  const context = useContext(GlobalStyleContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalStyle must be used within a GlobalStyleContextProvider"
    );
  }
  return context;
};
