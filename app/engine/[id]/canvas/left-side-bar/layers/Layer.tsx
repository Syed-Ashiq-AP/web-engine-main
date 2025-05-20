import { useEditor } from "@/app/providers/editor-provider";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { FaHeading } from "react-icons/fa6";
import { MdOutlineArrowRight } from "react-icons/md";
type LayerType = {
    element?: Element;
    tag?: string;
    child?: ReactNode[];
};
export const Layer = ({ element, tag, child }: LayerType) => {
    const editorContext = useEditor();
    if (!editorContext) return;

    const { activeElement, setActiveElement } = editorContext;

    const [isOpen, setIsOpen] = useState(false);
    const hasChild = child && child?.length > 0;

    const [isActive, setIsActive] = useState(false);

    const handleSetActiveElement = () => {
        if (!element) return;
        const anchor = document.getElementById("we-floating-anchor");
        if (!anchor) return;
        setIsActive(true);
        anchor.classList.remove("!hidden");
        let yPos =
            element.getBoundingClientRect().top -
            parseInt(getComputedStyle(anchor).height) -
            10;
        if (yPos > 0) {
            anchor.style.top = yPos + "px";
        } else {
            anchor.style.top =
                element.getBoundingClientRect().bottom + 10 + "px";
        }

        anchor.style.left = element.getBoundingClientRect().left + "px";
        anchor.children[0].innerHTML = `${element.tagName} 
       - ${element.id.replace(/-we-(?!.*-we-).*$/, "")}`;

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
        setActiveElement(element as HTMLElement);
    };

    useEffect(() => {
        if (activeElement === element) {
            setIsActive(true);
        } else setIsActive(false);
    }, [activeElement]);

    return (
        <div className="flex flex-col gap-3 ">
            <div
                className={cn(
                    " rounded-lg flex gap-1 items-center text-md w-full cursor-pointer text-neutral-400 hover:bg-blue-500 hover:text-white",
                    `${isActive && "bg-blue-600 text-white"}`
                )}
            >
                {hasChild && (
                    <MdOutlineArrowRight
                        className={`${isOpen && "rotate-90"}`}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                )}
                <div
                    className="p-1.5 flex gap-1  items-center w-full"
                    onClick={() => handleSetActiveElement()}
                >
                    <FaHeading />
                    <span className="text-white">{tag}</span>
                </div>
            </div>
            {hasChild && isOpen && (
                <div className="px-2 ml-4 border-l border-neutral-500 flex flex-col gap-2">
                    {child}
                </div>
            )}
        </div>
    );
};
