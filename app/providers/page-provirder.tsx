"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
export type activeMenuType =
  | "pages"
  | "blocks"
  | "layers"
  | "class"
  | "animation"
  | "js";
type pageType = { [key: string]: any };
type pagesType = { [key: string]: pageType };
export type activePageType = keyof pagesType | null;
type pageContextType = {
  pages: pagesType;
  getPage: (page: activePageType) => pageType;
  addPage: (page: activePageType) => void;
  removePage: (page: activePageType) => void;
  activePage: activePageType | null;
  setActivePage: (page: activePageType) => void;
  activeMenu: activeMenuType;
  setActiveMenu: (menu: activeMenuType) => void;
  setPages: React.Dispatch<React.SetStateAction<pagesType>>;
  homePage: string | null;
  setHomePage: (page: string) => void;
};
const pageContext = createContext<pageContextType | null>(null);

export const PageContextProvider = ({ children }: { children?: ReactNode }) => {
  const [pages, setPages] = useState<pagesType>({ home: {}, about: {} });
  const [activePage, setActivePage] = useState<activePageType>("home");
  const [activeMenu, setActiveMenu] = useState<activeMenuType>("pages");
  const [homePage, setHomePage] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      activeMenu: activeMenu,
      setActiveMenu: (menu: activeMenuType) => {
        setActiveMenu(menu);
      },
      pages,
      setPages,
      addPage: (page: activePageType) => {
        setPages((prev) => ({ ...prev, [page as any]: {} }));
      },
      removePage: (page: activePageType) => {
        setPages((prev) => {
          const { [page as any]: _, ...cur } = prev;
          return cur;
        });
      },
      activePage,
      setActivePage: (page: activePageType) => {
        setActivePage(page);
      },
      getPage: (page: activePageType) => {
        if (!page) return {};
        return pages[page];
      },
      homePage,
      setHomePage: (page: string) => setHomePage(page),
    }),
    [activeMenu, activePage, pages, homePage]
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
