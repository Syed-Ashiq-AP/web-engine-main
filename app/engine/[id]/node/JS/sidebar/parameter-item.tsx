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

type ParameterItemType = {
  name: string;
  type: string;
  handleAddNode: (name: string, type: "Get") => void;
  handleDelete: (name: string) => void;
};

export const ParameterItem = ({
  name,
  type,
  handleAddNode,
  handleDelete,
}: ParameterItemType) => {
  return (
    <div
      className={`grid grid-cols-[120px_100px_60px] items-center rounded-lg we_${type}`}
    >
      <span>{underscoreToSpaced(name)}</span>
      <span>{type}</span>
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
          <DropdownMenuItem onClick={() => handleAddNode(name, "Get")}>
            Get
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => handleAddNode(name, "Set")}>
            set
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => handleDelete(name)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
