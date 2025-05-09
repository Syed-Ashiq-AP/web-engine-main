"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
export type activeMenuType = "blocks" | "layers" | "class" | "animation" | "js";
type pageType = {
  activeMenu: activeMenuType;
};

type pageContextType = {
  activeMenu: activeMenuType;
  setActiveMenu: (menu: activeMenuType) => void;
};
const pageContext = createContext<pageContextType | null>(null);

export const PageContextProvider = ({ children }: { children?: ReactNode }) => {
  const [page, setPage] = useState<pageType>({ activeMenu: "layers" });

  const value = useMemo(
    () => ({
      activeMenu: page.activeMenu,
      setActiveMenu: (menu: activeMenuType) => {
        setPage((curPage) => ({ ...curPage, activeMenu: menu }));
      },
    }),
    [page]
  );

  return <pageContext.Provider value={value}>{children}</pageContext.Provider>;
};

export const usePage = () => {
  const context = useContext(pageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a pageContextProvider");
  }
  return context;
};
