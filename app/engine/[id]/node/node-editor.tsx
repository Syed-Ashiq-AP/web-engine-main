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

  const [nodes, setNodes, onNodesChange]: [Node[], any, any] = useNodesState(
    JSON.parse(JSFlow).nodes
  );
  const [edges, setEdges, onEdgesChange]: [Edge[], any, any] = useEdgesState(
    JSON.parse(JSFlow).edges
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((els: Edge[]) => addEdge(params, els)),
    []
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
                function ${name}(${parameters.join(",")}){
                    ${Compile(startEdge, funcEdges, funcNodes)}
                }
            `;
    }
  };

  const handleComplie = () => {
    const variablesJS = Object.entries(globalVariables).map(
      ([var_name, var_value]) => `let ${var_name} = '${var_value}'`
    );

    const FunctionsJS = Object.entries(globalFunctions).map(([name, data], _) =>
      CompileFunctions(name, data)
    );
    const startNode: Node | undefined = nodes.find(
      (node: Node) => node.type === "Start"
    );
    if (!startNode) return;
    const startEdge = edges.find((edge: Edge) => edge.source === startNode.id);
    if (!startEdge) return;
    const compileJS = Compile(startEdge, edges, nodes);

    const CompileJS = [...variablesJS, FunctionsJS, ...compileJS].join(";\n");
    setJS(CompileJS);
    // const originalLog = console.log;
    // console.log = function (...args) {
    //     setLogs((prev) => [...prev, args.join(" ")]);
    //     originalLog.apply(console, args);
    // };

    // const safeFunction = new Function(JS);
    // safeFunction();
    // console.log = originalLog;
  };

  const onConnectionEnd = useCallback(
    (event: any, connectionState: any) => {
      if (
        !connectionState.toHandle &&
        connectionState.fromPosition === "right"
      ) {
        const { fromHandle, fromNode } = connectionState;
        const { id: handleID } = fromHandle;
        const { id: nodeID } = fromNode;
        const addNode = nodes.find((node) => node.type === "addNode");
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        const { x, y } = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });
        if (addNode)
          setNodes((prev: Node[]) =>
            prev.map((node) =>
              node.id === addNode.id
                ? {
                    ...addNode,
                    position: { x, y },
                    data: { handleID, nodeID },
                  }
                : node
            )
          );
        else {
          const newNode = {
            id: nanoid(),
            type: "addNode",
            position: { x, y },
            measured: { width: 300, height: 100 },
            data: { handleID, nodeID },
          };

          setNodes((nds: Node[]) => nds.concat(newNode));
        }
      }
    },
    [screenToFlowPosition, nodes]
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
      const newNode = {
        id: nanoid(),
        type: "addNode",
        position: { x, y },
        measured: { width: 300, height: 100 },
        data: {},
      };

      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        setNodes((nds: Node[]) => nds.filter((n: Node) => !n.selected));
        setEdges((eds: Edge[]) => eds.filter((e: Edge) => !e.selected));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("flex flex-col flex-1 h-full", className)}>
      {/* <Button
        className="ml-20"
        onClick={() => {
          const flow = JSInstance.toObject();
          setJSFlow(JSON.stringify(flow));
          handleComplie();
        }}
      >
        Save
      </Button> */}
      <SideBar />
      <div style={{ height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setJSInstance}
          onPaneContextMenu={handleAddNode}
          nodeTypes={NodeTypes}
          onConnectEnd={onConnectionEnd}
          isValidConnection={(connection) => {
            if (
              connection.sourceHandle?.includes("bool") &&
              (connection.targetHandle?.includes("condition") ||
                connection.targetHandle?.includes("frombool"))
            )
              return true;
            if (
              (connection.sourceHandle?.includes("to") &&
                !connection.targetHandle?.includes("from")) ||
              (!connection.sourceHandle?.includes("to") &&
                connection.targetHandle?.includes("from"))
            )
              return false;
            return true;
          }}
        >
          <Controls />
          {/* <MiniMap /> */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};
