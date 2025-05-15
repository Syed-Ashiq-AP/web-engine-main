import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { underscoreToSpaced } from "../util";
import { cn } from "@/lib/utils";

type FunctionItemType = {
  name: string;
  isActive?: boolean;
  handleAddNode: (name: string, type: "call" | "edit") => void;
  handleDelete: (name: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
};

export const FunctionItem = ({
  name,
  handleAddNode,
  handleDelete,
  handleSave,
  handleCancel,
  isActive = false,
}: FunctionItemType) => {
  return (
    <div
      className={cn(
        `grid grid-cols-[220px_60px] items-center rounded-lg bg-neutral-900`,
        isActive && "bg-neutral-800"
      )}
    >
      <span>{underscoreToSpaced(name)}</span>
      {/* <span>{type}</span> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className=" justify-self-center"
            size={"icon"}
            variant={"ghost"}
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="border rounded-lg bg-background"
          align="end"
        >
          {isActive ? (
            <>
              <DropdownMenuItem onClick={() => handleSave()}>
                Save
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCancel()}>
                Cancel
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => handleAddNode(name, "edit")}>
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleAddNode(name, "call")}>
            Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(name)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
