import React, { useCallback, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SideBarItem } from "./SideBarItem";
import { Node, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useJS } from "@/app/providers/js-provider";
export const SideBar = () => {
  const JSContext = useJS();
  if (!JSContext) return;

  const { setNodes, setEdges, setViewport, screenToFlowPosition } =
    useReactFlow();

  const {
    globalVariables,
    setVariable,
    globalFunctions,
    getFunction,
    activeFunction,
    setActiveFunction,
    JSInstance,
    JSFlow,
    setJSFlow,
    setFunction,
  } = JSContext;

  const handleAddVariable = useCallback(
    (name: string, type: "Get" | "Set") => {
      const nodeID = nanoid();
      const vx = window.innerWidth / 2;
      const vy = window.innerHeight / 2;
      const { x, y } = screenToFlowPosition({
        x: vx,
        y: vy,
      });
      const newNode: Node = {
        id: nodeID,
        type: `Variable${type}`,
        position: { x, y },
        data: { name },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [screenToFlowPosition]
  );

  const handleFunction = (name: string, type: "Call") => {
    const nodeID = nanoid();
    const vx = window.innerWidth / 2;
    const vy = window.innerHeight / 2;
    const { x, y } = screenToFlowPosition({
      x: vx,
      y: vy,
    });
    const newNode: Node = {
      id: nodeID,
      type: `Function${type}`,
      position: { x, y },
      data: { name },
    };

    setNodes((nodes) => [...nodes, newNode]);
  };

  const handleEditFunction = useCallback(
    (name: string) => {
      const getFunctionFlow = async () => {
        const funcFlow = getFunction(name, "instance");
        const func = funcFlow ? JSON.parse(funcFlow) ?? {} : {};

        if (func) {
          const { x = 0, y = 0, zoom = 1 } = func.viewport;
          setNodes(func.nodes || []);
          setEdges(func.edges || []);
          setViewport({ x, y, zoom });
        }
      };
      if (JSInstance) {
        const flow = JSInstance.toObject();
        if (!activeFunction) {
          setJSFlow(JSON.stringify(flow));
        } else {
          setFunction(name, "instance", JSON.stringify(flow));
        }
      }
      getFunctionFlow();
      setActiveFunction(name);
    },
    [setNodes, setViewport, setActiveFunction, JSInstance, activeFunction]
  );

  const restoreJS = () => {
    if (JSFlow) {
      const func = JSON.parse(JSFlow) ?? {};

      if (func) {
        const { x = 0, y = 0, zoom = 1 } = func.viewport;
        setNodes(func.nodes || []);
        setEdges(func.edges || []);
        setViewport({ x, y, zoom });
      }
    }
  };

  const handleSaveFunction = (name: string) => {
    if (JSInstance) {
      const flow = JSInstance.toObject();
      setFunction(name, "instance", JSON.stringify(flow));
      restoreJS();
      setActiveFunction(null);
    }
  };

  const handleCancelFunction = () => {
    setActiveFunction(null);
    restoreJS();
  };

  const handleAddParameter = (name: string, type: "Get") => {
    const nodeID = nanoid();
    const vx = window.innerWidth / 2;
    const vy = window.innerHeight / 2;
    const { x, y } = screenToFlowPosition({
      x: vx,
      y: vy,
    });
    const newNode: Node = {
      id: nodeID,
      type: `Parameter${type}`,
      position: { x, y },
      data: { name },
    };

    setNodes((nodes) => [...nodes, newNode]);
  };

  const globalVariableInputRef = useRef<HTMLInputElement | null>(null);
  const globalFunctionInputRef = useRef<HTMLInputElement | null>(null);
  const FunctionParameterInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "absolute left-0 top-0 bottom-0 w-[350px] bg-muted z-50 p-2 rounded-r-lg",
        !open && "-left-[350px]"
      )}
    >
      <div className="relative w-full">
        <span
          className={cn(
            "absolute -right-15 top-2 size-10 rounded-full bg-muted flex items-center justify-center cursor-pointer",
            !open && "rotate-180"
          )}
          onClick={() => setOpen(!open)}
        >
          <FaChevronLeft />
        </span>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="variables">
          <AccordionTrigger className=" cursor-pointer p-2 hover:bg-neutral-900">
            Global Variables
          </AccordionTrigger>
          <AccordionContent className="p-2 rounded-md border border-neutral-700 mt-2">
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Enter Variable Name"
                ref={globalVariableInputRef}
              />

              <Button
                variant={"outline"}
                onClick={() => {
                  if (!globalVariableInputRef.current) return;
                  const value = globalVariableInputRef.current.value;
                  if (!value || value.length === 0) return;
                  setVariable(value, "");

                  globalVariableInputRef.current.value = "";
                }}
              >
                <FaPlus />
              </Button>
            </div>
            {Object.entries(globalVariables).map(([name, value], i) => (
              <SideBarItem
                key={i}
                className={"hover:bg-neutral-900 items-center justify-between"}
              >
                <span>{name}</span>
                <span>{typeof value}</span>
                <Button
                  variant={"outline"}
                  className="p-2 text-xs"
                  onClick={() => handleAddVariable(name, "Get")}
                >
                  Get
                </Button>
                <Button
                  variant={"outline"}
                  className="p-2 text-xs"
                  onClick={() => handleAddVariable(name, "Set")}
                >
                  Set
                </Button>
              </SideBarItem>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="functions">
          <AccordionTrigger className=" cursor-pointer p-2 hover:bg-neutral-900">
            Global Functions
          </AccordionTrigger>
          <AccordionContent className="p-2 rounded-md border border-neutral-700 mt-2">
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Enter Function Name"
                ref={globalFunctionInputRef}
              />

              <Button
                variant={"outline"}
                onClick={() => {
                  if (!globalFunctionInputRef.current) return;
                  const value = globalFunctionInputRef.current.value;
                  if (!value || value.length === 0) return;
                  setFunction(value, null, {
                    parameters: [""],
                    instance:
                      '{"viewport":{"x":0,"y":0,"zoom":1},"nodes":[],"edges":[]}',
                  });

                  globalFunctionInputRef.current.value = "";
                }}
              >
                <FaPlus />
              </Button>
            </div>
            {Object.entries(globalFunctions).map(([name, _], i) => (
              <SideBarItem
                key={i}
                className={"hover:bg-neutral-900 items-center justify-between"}
              >
                <span>{name}</span>
                {activeFunction && activeFunction === name ? (
                  <>
                    <Button
                      variant={"outline"}
                      className="p-2 text-xs"
                      onClick={() => handleSaveFunction(name)}
                    >
                      Save
                    </Button>
                    <Button
                      variant={"outline"}
                      className="p-2 text-xs"
                      onClick={handleCancelFunction}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={"outline"}
                    className="p-2 text-xs"
                    onClick={() => handleEditFunction(name)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  className="p-2 text-xs"
                  onClick={() => handleFunction(name, "Call")}
                >
                  Call
                </Button>
              </SideBarItem>
            ))}
          </AccordionContent>
        </AccordionItem>
        {activeFunction && (
          <AccordionItem value="parameters">
            <AccordionTrigger className=" cursor-pointer p-2 hover:bg-neutral-900">
              Parameters
            </AccordionTrigger>
            <AccordionContent className="p-2 rounded-md border border-neutral-700 mt-2">
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="Enter Parameter Name"
                  ref={FunctionParameterInputRef}
                />

                <Button
                  variant={"outline"}
                  onClick={() => {
                    if (!FunctionParameterInputRef.current) return;
                    const value = FunctionParameterInputRef.current.value;
                    if (!value || value.length === 0) return;
                    const parameters: string[] = getFunction(
                      activeFunction,
                      "parameters"
                    );
                    setFunction(activeFunction, "parameters", [
                      ...parameters,
                      value,
                    ]);

                    FunctionParameterInputRef.current.value = "";
                  }}
                >
                  <FaPlus />
                </Button>
              </div>
              {getFunction(activeFunction, "parameters").map(
                (name: string, i: number) => (
                  <SideBarItem
                    key={i}
                    className={
                      "hover:bg-neutral-900 items-center justify-between"
                    }
                  >
                    <span>{name}</span>
                    <Button
                      variant={"outline"}
                      className="p-2 text-xs"
                      onClick={() => handleAddParameter(name, "Get")}
                    >
                      Get
                    </Button>
                  </SideBarItem>
                )
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
