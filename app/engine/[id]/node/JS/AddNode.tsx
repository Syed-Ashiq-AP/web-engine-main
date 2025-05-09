import { Fragment } from "react/jsx-runtime";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { nodeHandles } from "./edges/nodeHandles";

const nodes = {
  Sample: {
    Start: "Start",
    Return: "Return",
  },
  Element: {
    "Get Element": "GetElement",
    "Get Element Attribute": "GetElementAttribute",
    "Set Element Attribute": "SetElementAttribute",
  },
  Liertals: {
    "String Input": "StringInput",
  },
  Console: {
    "Log in Console": "ConsoleLog",
  },
  Branches: {
    "IF Condition": "IFBranch",
  },
  Operators: {
    Compare: "Compare",
    "Logic Gates": "Gate",
  },
};

type Handlekeys = keyof typeof nodeHandles;
export const AddNode = ({
  id,
  data,
  positionAbsoluteX,
  positionAbsoluteY,
}: any) => {
  const { setNodes, setEdges, getInternalNode } = useReactFlow();

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, draggable: true } : node
      )
    );
  }, [id, setNodes]);

  const { handleID, nodeID } = data;

  const [modifyEdge, setModifyEdge] = useState<[boolean, string, string]>([
    false,
    "",
    "",
  ]);

  const handleAddNode = (cls: string) => {
    const nodeID = nanoid();
    const newNode: Node = {
      id: nodeID,
      type: cls,
      position: { x: positionAbsoluteX, y: positionAbsoluteY },
      data: {},
    };
    setNodes((nodes) => [...nodes, newNode]);
    setModifyEdge([true, nodeID, cls]);
  };

  useEffect(() => {
    if (!modifyEdge[0]) return;
    if (handleID && nodeID) {
      const nodeId = modifyEdge[1];
      const node = getInternalNode(nodeId);
      if (!node) return;
      let targetHandle = handleID;
      let sourceHandle = "";
      if (sourceHandle.includes("to")) {
        targetHandle = nodeHandles[modifyEdge[2] as Handlekeys].left.find((h) =>
          h.includes("from")
        );
      } else {
        targetHandle = nodeHandles[modifyEdge[2] as Handlekeys].left[0];
      }

      if (targetHandle) {
        setEdges((eds) =>
          eds.concat({
            id,
            source: nodeID,
            sourceHandle: handleID,
            target: nodeId,
            targetHandle: targetHandle,
          })
        );
      }
    }
    setModifyEdge([false, "", ""]);
    handleClose();
  }, [modifyEdge, getInternalNode(modifyEdge[1])]);

  const handleClose = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };

  return (
    <div
      className={cn(
        "absolute bg-neutral-800 rounded-lg p-1 flex flex-col gap-2 z-50 w-[200px] nowheel"
      )}
    >
      <Command>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(nodes).map(([node_heading, node_list], i1) => (
            <Fragment key={i1}>
              <CommandGroup heading={node_heading}>
                {Object.entries(node_list).map(([key, value], i2) => (
                  <CommandItem onSelect={() => handleAddNode(value)} key={i2}>
                    {key}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </Fragment>
          ))}
        </CommandList>
      </Command>
      <Button onClick={handleClose}>Cancel</Button>
    </div>
  );
};
