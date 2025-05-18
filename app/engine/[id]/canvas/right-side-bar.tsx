import { usePage } from "@/app/providers/page-provirder";
import React from "react";
import { BlockProperty } from "./right-side-bar/block-property";
import { ClassProperty } from "./right-side-bar/class-property";
import { AnimationProperty } from "./right-side-bar/animation-property";

export const RightSideBar = () => {
  const pageContext = usePage();

  if (!pageContext) return;

  const { activeMenu } = pageContext;
  return (
    <div className="we_side_bar">
      <BlockProperty
        className={
          !["layers", "blocks", "pages"].includes(activeMenu) && "hidden"
        }
      />

      <ClassProperty className={activeMenu !== "class" && "hidden"} />
      <AnimationProperty className={activeMenu !== "animation" && "hidden"} />
    </div>
  );
};
