import React from "react";
import { FaTrash } from "react-icons/fa6";
import { RiHome2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
type PageItemType = {
  item: {
    value: String;
    label: String | React.ReactElement;
  };
  active: Boolean;
  onClick: Function;
  onDelete: Function;
  homePage: boolean;
  setHomePage: Function;
};
export const PageItem = ({
  item,
  active,
  onClick,
  onDelete,
  homePage,
  setHomePage,
}: PageItemType) => {
  return (
    <div className={"flex justify-between"}>
      <span
        className={cn(
          "bg-muted rounded-md border flex-1 p-1 px-2 font-medium text-neutral-400 cursor-pointer ",
          active && "bg-white text-muted"
        )}
        onClick={() => onClick(item.value)}
      >
        {item.label}
      </span>
      <span
        className={cn(
          "size-8 flex justify-center items-center mx-2 border rounded",
          homePage && "bg-white text-black"
        )}
        onClick={() => setHomePage(item.value)}
      >
        <RiHome2Line />
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
