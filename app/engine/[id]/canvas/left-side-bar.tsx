"use client";
import React from "react";
import { Layers } from "./left-side-bar/layers/layers";
import { usePage } from "@/app/providers/page-provirder";
import { AddBlock } from "./left-side-bar/add-block/add-block";
import { Classes } from "./left-side-bar/classes/classes";
import { Animations } from "./left-side-bar/animations/animations";
import { Pages } from "./left-side-bar/pages/pages";
import { useData } from "@/app/providers/data-provider";

export const LeftSideBar = () => {
  const pageContext = usePage();

  if (!pageContext) return;

  const { activeMenu } = pageContext;

  return (
    <div className="we_side_bar we_left_side_bar">
      {activeMenu === "pages" && <Pages />}
      {activeMenu === "blocks" && <AddBlock />}
      {activeMenu === "layers" && <Layers />}
      {activeMenu === "class" && <Classes />}
      {activeMenu === "animation" && <Animations />}
    </div>
  );
};
