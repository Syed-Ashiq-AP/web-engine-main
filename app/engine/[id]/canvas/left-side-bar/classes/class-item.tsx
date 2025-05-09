import React from "react";
import { FaTrash } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type ClassItem = {
  item: {
    value: String;
    label: String | React.ReactElement;
  };
  active: Boolean;
  onClick: Function;
  onDelete: Function;
};
export const ClassItem = ({ item, active, onClick, onDelete }: ClassItem) => {
  return (
    <div className={"flex justify-between"}>
      <span
        className={cn(
          "bg-muted rounded-md border w-full p-1 px-2 font-medium text-neutral-400 cursor-pointer ",
          active && "bg-white text-muted"
        )}
        onClick={() => onClick(item.value)}
      >
        {item.label}
      </span>
      <span
        className={cn("p-2 cursor-pointer text-destructive hover:text-white")}
        onClick={() => {
          onDelete(item.value);
        }}
      >
        <FaTrash />
      </span>
    </div>
  );
};
