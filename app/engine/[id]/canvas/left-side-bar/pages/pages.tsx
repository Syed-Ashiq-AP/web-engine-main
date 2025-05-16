import { usePage } from "@/app/providers/page-provirder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { PageItem } from "./page-item";
import { useData } from "@/app/providers/data-provider";

export const Pages = () => {
  const pageContext = usePage();
  if (!pageContext) return;
  const {
    pages,
    addPage,
    setActivePage,
    removePage,
    activePage,
    homePage,
    setHomePage,
  } = pageContext;

  const dataContext = useData();
  if (!dataContext) return;
  const { loadPage, saveCurrentPage } = dataContext;
  const pageNameRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={cn("flex-col items-stretch gap-2 p-2 w-full flex")}>
      <div className="flex gap-2 w-full">
        <Input placeholder="Enter Page Name" ref={pageNameRef} />

        <Button
          variant={"ghost"}
          onClick={() => {
            if (!pageNameRef.current) return;
            const value = pageNameRef.current.value;
            if (!value || value.length === 0) return;
            addPage(value);
            pageNameRef.current.value = "";
          }}
        >
          <FaPlus />
        </Button>
      </div>
      {Object.keys(pages).map((pageName: string, index) => (
        <PageItem
          homePage={pageName === homePage}
          setHomePage={(page: string) => setHomePage(page)}
          key={index}
          item={{
            label: pageName,
            value: pageName,
          }}
          onClick={(val: string) => {
            setActivePage(val);
            saveCurrentPage();
            loadPage(val);
          }}
          active={pageName === activePage}
          onDelete={(val: string) => {
            removePage(val);
          }}
        />
      ))}
    </div>
  );
};
