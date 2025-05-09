import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaCopy, FaPaste } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";
import { ContextMenuItem } from "./ContextMenuItem";
type ContextMenuType = {
  anchor: string;
};

export const ContextMenu = ({ anchor }: ContextMenuType) => {
  if (!anchor) return;

  const [isOpen, setIsOpen] = useState(false);

  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [contextOn, setContextOn] = useState<HTMLElement | null>(null);

  const [contextData, setContextdata] = useState<{
    [key: string]: any;
  } | null>(null);

  const handleContextMenu = (event: MouseEvent) => {
    const target = event.composedPath()[0] as HTMLElement;
    const x = event.clientX;
    const y = event.clientY;

    if (!target) return;
    setIsOpen(true);
    setContextOn(target);
    event.stopPropagation();
    event.preventDefault();
    setPos({ x, y });
  };

  const handleHideMenu = () => {
    setIsOpen((prev) => prev && false);
  };

  const handleDeleteContext = () => {
    if (!contextOn) return;
    contextOn.remove();
    setContextOn(null);
    setIsOpen(false);
  };

  const handleCopyContext = () => {
    if (!contextOn) return;
    setContextdata({ copied: contextOn.cloneNode(true) });
    setIsOpen(false);
  };

  const handlePasteContext = () => {
    if (!contextOn) return;
    if (contextData && contextData.copied) {
      contextOn.appendChild(contextData.copied);
      setContextdata(null);
    }
    setIsOpen(false);
  };

  const handleDuplicateContext = () => {
    if (!contextOn) return;
    const parent = contextOn.parentElement;
    const nextSibling = contextOn.nextElementSibling;
    const duplicate = contextOn.cloneNode(true);
    if (nextSibling) {
      parent?.insertBefore(duplicate, nextSibling);
    } else {
      parent?.appendChild(duplicate);
    }
    setContextdata(null);
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: (
        <span className="text-sm flex gap-2 items-center">
          <FaTrash />
          Delete
        </span>
      ),
      onClick: handleDeleteContext,
      className: "text-red-500 hover:bg-red-600 hover:text-white",
    },
    {
      label: (
        <span className="text-sm flex gap-2 items-center">
          <FaCopy />
          Copy
        </span>
      ),
      onClick: handleCopyContext,
      className: "",
    },
    {
      label: (
        <span className="text-sm flex gap-2 items-center">
          <FaPaste />
          Paste
        </span>
      ),
      onClick: handlePasteContext,
      className: "",
    },
    {
      label: (
        <span className="text-sm flex gap-2 items-center">
          <IoDuplicate />
          Duplicate
        </span>
      ),
      onClick: handleDuplicateContext,
      className: "",
    },
  ];
  useEffect(() => {
    const element = document.getElementById(anchor);
    if (!element) return;
    element.addEventListener("contextmenu", handleContextMenu);
    element.addEventListener("mousedown", handleHideMenu);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          style={{
            top: pos.y,
            left: pos.x,
          }}
          className="absolute bg-neutral-800 rounded-lg p-1 flex flex-col gap-2 z-50 w-[200px]"
        >
          {menuItems.map((item, i) => (
            <ContextMenuItem
              onClick={item.onClick}
              key={i}
              className={item.className}
              label={item.label}
            />
          ))}
        </div>
      )}
    </>
  );
};
