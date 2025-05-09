import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
export const BlockItem = ({
  icon,
  title,
  blockData,
  fakeIt,
  isDragBlock = false,
}: any) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: title,
    data: { overlay: { icon, title }, blockData, type: "add-block" },
  });

  return (
    <div
      className={cn(
        "flex gap-2 p-2 rounded-lg border bg-accent cursor-grab items-center",
        isDragBlock &&
          "flex gap-2 items-center p-1 px-2 rounded bg-blue-500 text-xs font-medium z-50 tracking-wider",
        fakeIt && "size-10 translate-x-1/2 pointer-events-none we-drag-overlay"
      )}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <span className={`${!isDragBlock && "text-xl"}`}>{icon}</span>
      {!fakeIt && <span className={"we-item-block-text"}>{title}</span>}
    </div>
  );
};
