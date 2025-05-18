"use client";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { IoLayersOutline, IoTimerOutline } from "react-icons/io5";
import { VscSymbolClass } from "react-icons/vsc";
import { AiOutlineNodeIndex } from "react-icons/ai";
import { LuLayoutList } from "react-icons/lu";
import { LuFileStack } from "react-icons/lu";
import { MdOutlinePreview } from "react-icons/md";
import { Dock, DockIcon } from "./dock";
import { activeMenuType, usePage } from "@/app/providers/page-provirder";
import { useData } from "@/app/providers/data-provider";
import { redirect, useRouter } from "next/navigation";
import { useTour } from "@reactour/tour";

const menutoActive = {
  Pages: "pages",
  Blocks: "blocks",
  Layers: "layers",
  Classes: "class",
  Animations: "animation",
  Scripts: "js",
};
type MenuHeading =
  | "Pages"
  | "Blocks"
  | "Layers"
  | "Classes"
  | "Animations"
  | "Scripts";

const menu: { heading: MenuHeading; icon: React.ReactNode }[] = [
  {
    heading: "Pages",
    icon: <LuFileStack className="size-5" />,
  },
  {
    heading: "Blocks",
    icon: <LuLayoutList className="size-5" />,
  },
  {
    heading: "Layers",
    icon: <IoLayersOutline className="size-5" />,
  },
  {
    heading: "Classes",
    icon: <VscSymbolClass className="size-5" />,
  },
  {
    heading: "Animations",
    icon: <IoTimerOutline className="size-5" />,
  },
  {
    heading: "Scripts",
    icon: <AiOutlineNodeIndex className="size-5" />,
  },
];

export const Navbar = ({ id }: { id: string }) => {
  const { setIsOpen } = useTour();
  const router = useRouter();

  const pageContext = usePage();

  if (!pageContext) return;

  const { activeMenu, setActiveMenu, activePage } = pageContext;

  const dataContext = useData();
  if (!dataContext) return;

  const { saveData } = dataContext;
  const actionMenu: {
    heading: string;
    icon: React.ReactNode;
    onClick: Function;
  }[] = [
    {
      heading: "Tour",
      icon: <MdOutlinePreview className="size-5" />,
      onClick: () => {
        setIsOpen(true);
      },
    },
    {
      heading: "Save",
      icon: <CiSaveDown1 className="size-5" />,
      onClick: () => saveData(),
    },
    {
      heading: "Preview",
      icon: <MdOutlinePreview className="size-5" />,
      onClick: () => {
        router.push(`/preview/${id}/${activePage}`);
      },
    },
  ];

  const [show, setShow] = useState<boolean>(true);
  const [threshold, setTreshold] = useState<number>(10);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;

      if (clientX <= threshold) {
        setShow(true);
        setTreshold(90);
      } else {
        setShow(false);
        setTreshold(5);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [show, threshold]);
  return (
    <Dock show={show}>
      {actionMenu.map((item, i) => (
        <DockIcon key={i} heading={item.heading} onClick={item.onClick}>
          {item.icon}
        </DockIcon>
      ))}
      {menu.map((item, i) => (
        <DockIcon
          key={i}
          heading={item.heading}
          active={activeMenu === menutoActive[item.heading]}
          onClick={() =>
            setActiveMenu(menutoActive[item.heading] as activeMenuType)
          }
        >
          {item.icon}
        </DockIcon>
      ))}
    </Dock>
  );
};
