"use client";
import { useEditor } from "@/app/providers/editor-provider";
import React, { ReactNode } from "react";
import { Layer } from "./Layer";

export const Layers = () => {
  const editorContext = useEditor();
  if (!editorContext) return;

  const { canvas } = editorContext;
  const [layers, setLayers] = React.useState<ReactNode[]>([]);

  const getChildrenLayers = (childs: Element[]) => {
    return childs.map((child, i) => {
      let childChildrens: ReactNode[] = [];
      const childChilds = Array.from(child.children);
      if (childChilds) {
        childChildrens = getChildrenLayers(childChilds);
      }
      return (
        <Layer
          tag={child.tagName}
          child={childChildrens}
          element={child}
          key={i}
        />
      );
    });
  };
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  React.useEffect(() => {
    if (mounted && canvas.current?.shadowRoot) {
      const canvasRoot =
        canvas.current?.shadowRoot.getElementById("we_canvas_root");
      if (!canvasRoot) return;
      const childs = Array.from(canvasRoot?.children);
      if (!childs) return;
      setLayers(getChildrenLayers(childs));
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            if (!canvas.current || !canvas.current?.shadowRoot) return;
            const canvasRoot =
              canvas.current?.shadowRoot.getElementById("we_canvas_root");
            if (!canvasRoot) return;
            const childs = Array.from(canvasRoot?.children);
            if (!childs) return;
            setLayers(getChildrenLayers(childs));
          }
        });
      });

      observer.observe(canvasRoot, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [mounted]);

  return (
    <div className={"flex-col items-stretch gap-2 p-2 w-full"}>
      <span className="text-md font-medium">Layers</span>
      <div className="flex flex-col flex-1  py-2 gap-2 tracking-wide ">
        {layers}
      </div>
    </div>
  );
};
