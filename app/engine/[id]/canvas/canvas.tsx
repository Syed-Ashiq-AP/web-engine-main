import { useEditor } from "@/app/providers/editor-provider";
import { GoGrabber } from "react-icons/go";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useCallback, useEffect } from "react";
import mergeRefs from "merge-refs";
import { Timeline } from "./right-side-bar/editors/animation/Timeline";
import { useGlobalStyle } from "@/app/providers/style-provider";
import { ContextMenu } from "./ContextMenu";

const styleOverrides = `      
        @keyframes grow-width {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes grow-height {
          0% {
            height: 0%;
          }
          100% {
            height: 100%;
          }
        }
        #we_canvas_root *:not(#we-placeholder) {
          
          margin:4px;
        }
        *:not(#we-placeholder):hover {  
          outline:2px solid #2b7fff;
        }
        .we_relative{
          position:relative!important;
        }
        .we-active-element{
          outline:2px solid #155dfc 
        }  
        `;

export const Canvas = () => {
  const editorContext = useEditor();
  if (!editorContext) return;

  const { canvas } = editorContext;

  const globalstyleContext = useGlobalStyle();
  if (!globalstyleContext) return;
  const { globalStyles } = globalstyleContext;

  const { setNodeRef } = useDroppable({
    id: "we-canvas",
  });

  const {
    attributes,
    listeners,
    setNodeRef: anchor,
  } = useDraggable({
    id: "we-anchor",
    data: { type: "block-drag" },
  });

  const handleSetHTML = useCallback(
    (e: Event) => {
      const event = e as CustomEvent;
      const html = event.detail ?? "";

      if (!canvas.current || !canvas.current.shadowRoot) return;
      const root = canvas.current.shadowRoot.getElementById("we_canvas_root");
      if (!root) return;
      root.innerHTML = html;
    },
    [canvas]
  );

  useEffect(() => {
    if (!canvas.current) return;
    if (!canvas.current.shadowRoot) {
      const shadowRoot = canvas.current.attachShadow({ mode: "open" });

      shadowRoot.innerHTML = `
      <style id="shadow_styles">
        ${styleOverrides}
      </style>
      <div id="we_canvas_root" style="width:100%;">
      </div>
    `;
    }
    document.addEventListener("setHTML", handleSetHTML);
    return () => document.removeEventListener("setHTML", handleSetHTML);
  }, [canvas]);

  useEffect(() => {
    if (!canvas.current || !globalStyles) return;
    const shadowRoot = canvas.current.shadowRoot;
    if (!shadowRoot) return;
    const styleElement = shadowRoot.getElementById("shadow_styles");
    if (!styleElement) return;
    styleElement.innerHTML = `
      ${styleOverrides}
      ${Object.values(globalStyles).join("\n")}
    `;
  }, [globalStyles]);

  return (
    <>
      <div ref={anchor} id="we-floating-anchor" className="!hidden">
        <span>H1 - ID</span>
        <GoGrabber
          {...listeners}
          {...attributes}
          className="cursor-grab"
          size={24}
        />
      </div>
      <div className="we_viewport">
        <div
          id="we_canvas"
          className="relative text-black"
          style={{ color: "black" }}
          ref={mergeRefs(
            canvas,
            setNodeRef as (element: HTMLDivElement | null) => void
          )}
        ></div>
        <Timeline />
      </div>
      <ContextMenu anchor="we_canvas" />
    </>
  );
};
