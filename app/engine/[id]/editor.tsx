"use client";
import { usePage } from "@/app/providers/page-provirder";
import React from "react";
import { CanvasEditor } from "./canvas/canvas-editor";
import { NodeEditor } from "./node/node-editor";
import { Toaster } from "sonner";

export const Editor = () => {
  const pageContext = usePage();

  if (!pageContext) return;

  const { activeMenu } = pageContext;
  return (
    <>
      <Toaster />
      <CanvasEditor className={activeMenu === "js" && "hidden"} />
      <NodeEditor className={activeMenu !== "js" && "hidden"} />
    </>
  );
};
