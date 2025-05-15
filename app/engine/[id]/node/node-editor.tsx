"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
  Edge,
  Node,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Compile } from "./utils";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { nodeTypes } from "./JS/nodes/nodeTypes";
import { useJS } from "@/app/providers/js-provider";
import { AddNode } from "./JS/AddNode";
import { ClassNameValue } from "tailwind-merge";
import { SideBar } from "./JS/SideBar";

const getNewAddNode = ({
  data = { handleID: null, nodeID: null },
  x,
  y,
}: {
  data?: { [key: string]: any };
  x: number;
  y: number;
}) => {
  return {
    id: nanoid(),
    type: "addNode",
    position: { x, y },
    measured: { width: 300, height: 100 },
    data: data,
  };
};

const NodeTypes = { ...nodeTypes, addNode: AddNode };
export const NodeEditor = ({ className }: { className: ClassNameValue }) => {
  const JSContext = useJS();
  if (!JSContext) return;
  const {
    setJS,
    globalVariables,
    setJSInstance,
    JSInstance,
    globalFunctions,
    JSFlow,
    setJSFlow,
  } = JSContext;

  const [logs, setLogs] = useState<string[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange]: [Node[], any, any] = useNodesState([
    // {
    //   id: "node-1",
    //   type: "Start",
    //   position: { x: 0, y: 0 },
    //   data: {},
    // },
    // {
    //   id: "node-2",
    //   type: "ConsoleLog",
    //   position: { x: 100, y: 100 },
    //   data: {},
    // },
  ]);
  const [edges, setEdges, onEdgesChange]: [Edge[], any, any] = useEdgesState(
    JSON.parse(JSFlow).edges
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((els: Edge[]) => addEdge(params, els)),
    []
  );

  const handleAddNode = useCallback(
    (
      event: MouseEvent | React.MouseEvent<Element, MouseEvent> | TouchEvent
    ) => {
      event.preventDefault();
      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      const { x, y } = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      setNodes((nds: Node[]) => nds.concat(getNewAddNode({ x, y })));
    },
    [screenToFlowPosition]
  );

  const CompileFunctions = (name: string, data: any) => {
    const { parameters, instance } = data;
    const func = JSON.parse(instance);

    if (func) {
      const {
        edges: funcEdges,
        nodes: funcNodes,
      }: { edges: Edge[]; nodes: Node[] } = func || {};
      const startNode = funcNodes.find((node) => node.type === "Start");
      if (!startNode) return "";
      const startEdge = funcEdges.find((edge) => edge.source === startNode.id);
      if (!startEdge) return "";
      return `
                function ${name}(${Object.keys(parameters).join(",")}){
                    ${Compile(startEdge, funcEdges, funcNodes)}
                }
            `;
    }
  };

  const handleComplie = useCallback(() => {
    const variablesJS = Object.entries(globalVariables).map(
      ([var_name, _]) => `let ${var_name}`
    );

    const FunctionsJS = Object.entries(globalFunctions).map(([name, data], _) =>
      CompileFunctions(name, data)
    );
    const startNode = nodes.find((node) => node.type === "Start");
    if (!startNode) return;
    const startEdge = edges.find((edge: Edge) => edge.source === startNode.id);
    if (!startEdge) return;
    const compiledJS = Compile(startEdge, edges, nodes);
    setJS([...variablesJS, ...FunctionsJS, ...compiledJS].join(";\n"));
  }, [nodes, edges]);

  const onConnectionEnd = useCallback(
    (event: any, connectionState: any) => {
      const { isValid, fromHandle, fromNode, toHandle } = connectionState;
      if (!isValid && !toHandle) {
        const { id: handleID } = fromHandle;
        const { id: nodeID } = fromNode;
        const addNode = nodes.find((node) => node.type === "addNode");
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        const { x, y } = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });
        const data = { handleID, nodeID };
        if (addNode)
          setNodes((prev: Node[]) =>
            prev.map((node) =>
              node.id === addNode.id
                ? {
                    ...addNode,
                    position: { x, y },
                    data: data,
                  }
                : node
            )
          );
        else {
          setNodes((nds: Node[]) => nds.concat(getNewAddNode({ data, x, y })));
        }
      }
    },
    [screenToFlowPosition, nodes]
  );

  const validConnection = (connection: Edge | Connection) => {
    const { sourceHandle, targetHandle, source } = connection;
    if (!sourceHandle || !targetHandle) return false;
    if (
      ["out", "out-false", "out-true"].includes(sourceHandle) &&
      targetHandle === "in"
    )
      return true;
    const sourceHandles = sourceHandle.split("-").slice(1);
    const targetHandles = targetHandle.split("-").slice(1);
    let isValid = false;
    for (
      let inIDind = 0;
      inIDind < sourceHandles.length && !isValid;
      inIDind++
    ) {
      for (
        let outIDind = 0;
        outIDind < targetHandles.length && !isValid;
        outIDind++
      ) {
        if (sourceHandles[inIDind] === targetHandles[outIDind]) {
          isValid = true;
        }
      }
    }
    return isValid;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNodes((nds: Node[]) =>
          nds.filter((n: Node) => n.type !== "addNode")
        );
      } else if (event.key === "Delete") {
        setNodes((nds: Node[]) => nds.filter((n: Node) => !n.selected));
        setEdges((eds: Edge[]) => eds.filter((e: Edge) => !e.selected));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges]);

  return (
    <div className={cn("flex flex-1 h-full", className)}>
      <SideBar />
      <div className="w-full h-full flex flex-col flex-1 items-stretch">
        <div className="flex gap-2 p-2">
          <Button
            variant={"outline"}
            onClick={() => {
              const flow = JSInstance.toObject();
              setJSFlow(JSON.stringify(flow));
              handleComplie();
            }}
          >
            Compile
          </Button>
        </div>
        <div className=" h-full border rounded-lg mb-2 ml-2">
          <ReactFlow
            onPaneContextMenu={handleAddNode}
            onConnectEnd={onConnectionEnd}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setJSInstance}
            nodeTypes={NodeTypes}
            isValidConnection={validConnection}
          >
            <Controls />
            {/* <MiniMap /> */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
