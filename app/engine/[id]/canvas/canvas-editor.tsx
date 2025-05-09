import React from "react";
import { LeftSideBar } from "./left-side-bar";
import { RightSideBar } from "./right-side-bar";
import { Canvas } from "./canvas";
import { DndContext, DragOverEvent, DragOverlay } from "@dnd-kit/core";
import { BlockItem } from "./left-side-bar/add-block/block-item";
import { useEditor } from "@/app/providers/editor-provider";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

interface SetCustomEventDetail {
  styles: { [key: string]: string };
  attributes: { [key: string]: string };
  listenerControlls: { [key: string]: string };
  className: string;
  isRemove: Boolean;
}

const placeholderVariants = {
  default: {
    position: "absolute",
    backgroundColor: "#155dfc",
    borderRadius: "4px",
  },
  horizontal: {
    left: "0px",
    right: "0px",
    height: "4px",
    marginInline: "auto",
    widht: "100%",
    animation: "grow-width 0.5s",
  },
  vertical: {
    bottom: "0px",
    top: "0px",
    width: "4px",
    marginBlock: "auto",
    height: "100%",
    animation: "grow-height 0.5s",
  },
};

export const CanvasEditor = ({ className }: { className: ClassNameValue }) => {
  const editorContext = useEditor();
  if (!editorContext) return;

  const { canvas, activeElement, setActiveElement } = editorContext;
  const [blockOverlay, setBlockOverlay] = React.useState<{
    isDragBlock: Boolean;
    icon: any;
    title: string;
  } | null>(null);

  const [blockData, setBlockData] = React.useState<any[] | null>(null);

  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  const [isDragging, setisDragging] = React.useState<boolean>(false);

  const [dragType, setDragType] = React.useState<
    "add-block" | "block-drag" | null
  >(null);

  const [dragBlock, setDragBlock] = React.useState<HTMLElement | null>(null);

  const handleDragStart = ({ active }: any) => {
    const data = active.data;
    const { type } = data.current;
    if (data) {
      setisDragging(true);
      setDragType(type);
      switch (type) {
        case "block-drag":
          if (!activeElement) return;
          setDragBlock(activeElement.cloneNode(true) as HTMLElement);
          activeElement.remove();
          setBlockOverlay({
            isDragBlock: true,
            icon: activeElement.tagName,
            title: "",
          });
          break;

        case "add-block":
          setBlockOverlay(data.current.overlay);
          setBlockData(data.current.blockData);
          break;

        default:
          break;
      }
    }
  };

  const WECreateElement = (
    tag = "",
    props: { [key: string]: any } = {},
    children = []
  ) => {
    const element = document.createElement(tag);
    if (props.style) {
      Object.entries(props.style as { [key: string]: string }).map(
        ([key, value], _) => {
          element.style[key as any] = value;
        }
      );
      delete props.style;
    }
    if (props.className) {
      element.classList.add(...props.className.split(" "));
      delete props.className;
    }
    Object.entries(props).map(([key, value], _) => {
      element.setAttribute(key, value);
    });
    children.forEach((child: any[]) => {
      if (typeof child === "string") {
        element.append(child);
      } else {
        element.appendChild(WECreateElement(...child));
      }
    });
    return element;
  };

  const getNearestBelowChild = (childrenArray: any[], x: number, y: number) => {
    let nearest = null;
    let minDistance = Infinity;
    const isHor = isHorizontal(childrenArray);
    for (const child of childrenArray) {
      const rect = child.getBoundingClientRect();

      if (isHor) {
        if (x <= rect.x) {
          if (rect.bottom >= y && rect.top <= y) {
            const distance = y - rect.bottom;
            if (distance < minDistance) {
              minDistance = distance;
              nearest = child;
            }
          }
        }
      } else if (y <= rect.y) {
        if (rect.right >= x && rect.left <= x) {
          const distance = x - rect.right;
          if (distance < minDistance) {
            minDistance = distance;
            nearest = child;
          }
        }
      }
    }
    return nearest;
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over) {
      if (!canvas.current) return;
      if (!canvas.current.shadowRoot) return;
      const existingPlaceholder =
        canvas.current.shadowRoot.getElementById("we-placeholder");
      if (existingPlaceholder) return;
      const placeholder = WECreateElement("div", {
        id: "we-placeholder",
        style: placeholderVariants.default,
      });
      if (!canvas.current.shadowRoot) return;
      canvas.current.shadowRoot.appendChild(placeholder);
      setPlaceholderOrientation(placeholder);
      return;
    }
    setTarget(null);
  };

  const isHorizontal = (unfilteredChilds: Element[]) => {
    let childs = unfilteredChilds;
    childs = childs.filter((child) => child.id !== "we-placeholder");
    if (childs.length < 2) {
      return false;
    }

    const freq = { hor: 0, ver: 0 };
    for (let i = 0; i < childs.length - 1; i++) {
      const first = childs[i].getBoundingClientRect();
      const second = childs[i + 1].getBoundingClientRect();
      if (second) {
        const horizontal =
          Math.abs(second.x - first.x) > Math.abs(second.y - first.y);
        if (horizontal) freq.hor++;
        else freq.ver++;
      }
    }
    if (freq.hor === freq.ver) return true;
    const isHor = freq.hor > freq.ver ? true : false;

    return isHor;
  };
  const setPlaceholderOrientation = (placeholder: HTMLElement) => {
    const parent = placeholder.parentElement;
    placeholder.style.left = "";
    placeholder.style.top = "";
    parent?.classList.add("we_relative");
    const childs = parent?.children;
    if (!childs) return;
    const isHor = isHorizontal(Array.from(childs));
    if (!isHor) {
      const styleVariant = {
        ...placeholderVariants.default,
        ...placeholderVariants.horizontal,
      };
      placeholder.removeAttribute("style");
      Object.entries(styleVariant).forEach(([style, value]) => {
        placeholder.style[style as any] = value;
      });
    } else {
      const styleVariant = {
        ...placeholderVariants.default,
        ...placeholderVariants.vertical,
      };
      placeholder.removeAttribute("style");
      Object.entries(styleVariant).forEach(([style, value]) => {
        placeholder.style[style as any] = value;
      });
      const before =
        placeholder.previousElementSibling?.getBoundingClientRect().right ?? 0;
      const after =
        placeholder.nextElementSibling?.getBoundingClientRect().left ?? 0;
      let mid = 0;
      if (after === 0) {
        mid = before;
      } else if (before === 0) {
        mid = after;
      } else {
        mid = (before + after) / 2;
      }
      const parentLeft = parent?.getBoundingClientRect().left ?? 0;
      let toSub = mid;
      if (mid !== 0) {
        if (mid > parentLeft) {
          toSub = mid - parentLeft;
        } else {
          toSub = parentLeft - mid;
        }
      }

      placeholder.style.left = toSub - 5 + "px";
    }
  };

  const setPlaceholderBefore = (
    placeholder: HTMLElement,
    target: HTMLElement
  ) => {
    if (target.id !== "we-placeholder") {
      const parent = target.parentElement;
      if (!parent) return;
      parent.insertBefore(placeholder, target);
    }
  };

  const setStyles = (event: Event) => {
    setActiveElement((prev) => {
      if (!prev) return prev;
      const customEvent = event as CustomEvent<SetCustomEventDetail>;
      const { styles } = customEvent.detail;
      if (!styles) return prev;
      Object.entries(styles).forEach(([style, value], _) => {
        prev.style[style as any] = value;
      });
      return prev;
    });
  };

  const setAttributes = (event: Event) => {
    setActiveElement((prev) => {
      if (!prev) return prev;
      const customEvent = event as CustomEvent<SetCustomEventDetail>;
      const { attributes } = customEvent.detail;
      if (!attributes) return prev;
      Object.entries(attributes).forEach(([attr, value], _) => {
        prev.setAttribute(attr, value);
      });
      return prev;
    });
  };

  const setListeners = (event: Event) => {
    setActiveElement((prev) => {
      if (!prev) return prev;
      const customEvent = event as CustomEvent<SetCustomEventDetail>;
      const { listenerControlls } = customEvent.detail;
      if (!listenerControlls) return prev;
      Object.entries(listenerControlls).forEach(([lis, value], _) => {
        prev.setAttribute(`on${lis}`, `${value}()`);
      });
      return prev;
    });
  };

  const setClass = (event: Event) => {
    setActiveElement((prev) => {
      if (!prev) return prev;
      const customEvent = event as CustomEvent<SetCustomEventDetail>;
      const { className, isRemove } = customEvent.detail;
      if (!className) return prev;
      if (isRemove) {
        prev.classList.remove(className);
      } else {
        prev.classList.add(className);
      }
      return prev;
    });
  };

  const handleSetActiveElement = (element: HTMLElement) => {
    const anchor = document.getElementById("we-floating-anchor");
    if (!anchor) return;
    if (element.id === "we_canvas_root") {
      anchor.classList.add("!hidden");
      return;
    }
    anchor.classList.remove("!hidden");
    let yPos =
      element.getBoundingClientRect().top -
      parseInt(getComputedStyle(anchor).height) -
      10;
    if (yPos > 0) {
      anchor.style.top = yPos + "px";
    } else {
      anchor.style.top = element.getBoundingClientRect().bottom + 10 + "px";
    }

    anchor.style.left = element.getBoundingClientRect().left + "px";

    anchor.children[0].innerHTML = `${element.tagName} ${
      element.id && ` - ${element.id}`
    }`;

    setActiveElement((prev) => {
      if (prev) prev.classList.remove("we-active-element");
      return prev;
    });
    element.classList.add("we-active-element");

    if (element.id === "we-canvas") {
      anchor.classList.add("!hidden");
      setActiveElement(null);

      document.dispatchEvent(
        new CustomEvent("loadAttributes", {
          detail: { element: null },
        })
      );
      return;
    }

    document.dispatchEvent(
      new CustomEvent("loadAttributes", {
        detail: { element },
      })
    );
    setActiveElement(element);
  };

  React.useEffect(() => {
    const handleDragEvent = (event: MouseEvent) => {
      if (!isDragging) return;
      const path = event.composedPath();
      const target = path[0] as HTMLElement;
      if (!target) return;
      if (!canvas.current) return;
      if (canvas.current.shadowRoot?.contains(target)) {
        const placeholder = canvas.current.shadowRoot?.getElementById(
          "we-placeholder"
        ) as HTMLElement;
        if (placeholder) {
          if (target === placeholder) return;
          const x = event.clientX;
          const y = event.clientY;
          const targetChilds = Array.from(target.children).filter(
            (child) => child.id != "we-placeholder"
          );
          const nearestMouse = getNearestBelowChild(targetChilds, x, y);
          const endChild = Array.from(target.children).at(-1);
          let resetOrientation = false;
          if (!target.contains(placeholder)) {
            placeholder.parentElement?.classList.remove("we_relative");
            target.appendChild(placeholder);
            resetOrientation = true;
          }
          if (nearestMouse) {
            let forceAdd = true;
            if (
              nearestMouse.id !== "we-placeholder" &&
              nearestMouse.previousElementSibling &&
              nearestMouse.previousElementSibling.id === "we-placeholder"
            ) {
              forceAdd = false;
            }
            if (forceAdd) {
              setPlaceholderBefore(placeholder, nearestMouse);
              resetOrientation = true;
            }
          } else if (endChild && endChild.id !== "we-placeholder") {
            placeholder.parentElement?.classList.remove("we_relative");
            target.appendChild(placeholder);
            resetOrientation = true;
          }
          resetOrientation && setPlaceholderOrientation(placeholder);
        }
      } else {
        const isOverlay = Array.from(target.children).find((child) =>
          child.classList.contains("we-drag-overlay")
        );
        if (isOverlay) target.style.pointerEvents = "none";
      }
    };
    if (!canvas.current) return;

    document.addEventListener("mousemove", handleDragEvent);

    const handleClickEvent = (event: Event) => {
      const element = event.composedPath()[0] as HTMLElement;
      if (!element) return;
      handleSetActiveElement(element);
    };
    if (!canvas.current) return;
    canvas.current.addEventListener("click", handleClickEvent);

    return () => {
      if (canvas.current)
        canvas.current.removeEventListener("click", handleClickEvent);
      document.removeEventListener("mousemove", handleDragEvent);
    };
  }, [isDragging, canvas]);

  React.useEffect(() => {
    document.addEventListener("setStyles", setStyles);

    document.addEventListener("setAttributes", setAttributes);

    document.addEventListener("setListeners", setListeners);

    document.addEventListener("setClass", setClass);

    return () => {
      document.removeEventListener("setStyles", setStyles);
      document.removeEventListener("setAttributes", setAttributes);
      document.removeEventListener("setListeners", setListeners);
      document.removeEventListener("setClass", setClass);
    };
  }, []);

  const handleDragEnd = ({ over }: any) => {
    if (!canvas.current) return;
    if (!canvas.current.shadowRoot) return;
    const placeholder =
      canvas.current.shadowRoot.getElementById("we-placeholder");
    if (placeholder) {
      if (!over) {
        placeholder.remove();
        return;
      }
      placeholder.parentElement?.classList.remove("we_relative");
      if (!dragType) {
        placeholder.remove();
        return;
      }
      switch (dragType) {
        case "block-drag":
          if (!dragBlock) return;
          placeholder.replaceWith(dragBlock);
          handleSetActiveElement(dragBlock);
          break;

        case "add-block":
          if (!blockData) return;
          const element = WECreateElement(...blockData);
          placeholder.replaceWith(element);
          handleSetActiveElement(element);
          break;

        default:
          break;
      }
    }
    setDragBlock(null);
    setDragType(null);
    setBlockOverlay(null);
    setTarget(null);
    setisDragging(false);
  };

  return (
    <div
      className={cn("w-full h-full flex gap-2 items-stretch p-1", className)}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <LeftSideBar />
        <Canvas />
        <RightSideBar />
        <DragOverlay>
          {blockOverlay && (
            <BlockItem
              fakeIt
              isDragBlock={blockOverlay.isDragBlock}
              icon={blockOverlay.icon}
              title={blockOverlay.title}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
