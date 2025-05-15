import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VariableItem } from "./sidebar/variable-item";
import { useJS } from "@/app/providers/js-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { useCallback, useRef, useState } from "react";
import { DropdownEditor } from "../../canvas/right-side-bar/editors/DropdownEditor";
import { nanoid } from "nanoid";
import { Node, useReactFlow } from "@xyflow/react";
import { FunctionItem } from "./sidebar/function-item";
import { ParameterItem } from "./sidebar/parameter-item";

type variableDataTypeState = "string" | "number" | "boolean" | "block";

export const SideBar = () => {
  const { setNodes, setEdges, setViewport, screenToFlowPosition } =
    useReactFlow();

  const JSContext = useJS();
  if (!JSContext) return;

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
  const globalVariableInputRef = useRef<HTMLInputElement | null>(null);
  const globalFunctionInputRef = useRef<HTMLInputElement | null>(null);
  const functionParameterInputRef = useRef<HTMLInputElement | null>(null);
  const [variableDataType, setVariableDataType] = useState<
    Record<"variable" | "parameter", variableDataTypeState>
  >({ parameter: "string", variable: "string" });

  const handleAddVariableNode = useCallback(
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
        data: { name, dataType: globalVariables[name] },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [screenToFlowPosition, globalVariables]
  );

  const handleAddFunctionNode = useCallback(
    (name: string, type: "call" | "edit") => {
      if (type === "edit") {
        const getFunctionFlow = async () => {
          const funcFlow = getFunction(name, "instance");
          const func = funcFlow ? JSON.parse(funcFlow) ?? null : null;
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
        return;
      }
      const nodeID = nanoid();
      const vx = window.innerWidth / 2;
      const vy = window.innerHeight / 2;
      const { x, y } = screenToFlowPosition({
        x: vx,
        y: vy,
      });
      const newNode: Node = {
        id: nodeID,
        type: `FunctionCall`,
        position: { x, y },
        data: { name },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [
      setNodes,
      setViewport,
      setActiveFunction,
      JSInstance,
      activeFunction,
      globalFunctions,
    ]
  );

  const handleAddParameterNode = useCallback(
    (name: string, type: "Get") => {
      if (!activeFunction) return;
      const nodeID = nanoid();
      const vx = window.innerWidth / 2;
      const vy = window.innerHeight / 2;
      const { x, y } = screenToFlowPosition({
        x: vx,
        y: vy,
      });
      const dataType = getFunction(activeFunction, "parameters")[name];
      const newNode: Node = {
        id: nodeID,
        type: `Parameter${type}`,
        position: { x, y },
        data: { name, dataType },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [activeFunction, globalFunctions]
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

  const handleSaveFunction = useCallback(() => {
    if (!activeFunction) return;
    if (JSInstance) {
      const flow = JSInstance.toObject();
      setFunction(activeFunction, "instance", JSON.stringify(flow));
      restoreJS();
      setActiveFunction(null);
    }
  }, [activeFunction]);

  const handleCancelFunction = () => {
    setActiveFunction(null);
    restoreJS();
  };

  const handleDelete = () => {};

  return (
    <div className="flex flex-col w-[300px] m-2 rounded-lg border px-2">
      <Accordion type="multiple">
        <AccordionItem value="variables">
          <AccordionTrigger>Global Variables</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-col gap-3 text-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Variable Name"
                  ref={globalVariableInputRef}
                />
                <DropdownEditor
                  values={["string", "number", "boolean", "block"]}
                  value={variableDataType.variable}
                  onSelect={(val) =>
                    setVariableDataType((prev) => ({ ...prev, variable: val }))
                  }
                />
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    if (!globalVariableInputRef.current) return;
                    const value = globalVariableInputRef.current.value;
                    if (!value || value.length === 0) return;
                    const exists = Object.keys(globalVariables).find(
                      (var_name) => var_name === value
                    );
                    if (exists) return;
                    setVariable(value, variableDataType.variable);

                    globalVariableInputRef.current.value = "";
                  }}
                >
                  <FaPlus />
                </Button>
              </div>
              <div className="grid grid-cols-[120px_100px_60px]">
                <span>Variable name</span>
                <span>Data Type</span>
                <span>Action</span>
              </div>
              {Object.entries(globalVariables).map(([name, type], i) => (
                <VariableItem
                  name={name}
                  type={type}
                  key={i}
                  handleAddNode={handleAddVariableNode}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="functions">
          <AccordionTrigger>Global Functions</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-col gap-3 text-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Function Name"
                  ref={globalFunctionInputRef}
                />
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    if (!globalFunctionInputRef.current) return;
                    const value = globalFunctionInputRef.current.value;
                    if (!value || value.length === 0) return;
                    const exists = Object.keys(globalVariables).find(
                      (var_name) => var_name === value
                    );
                    if (exists) return;
                    setFunction(value, null, {
                      parameters: {},
                      instance:
                        '{"viewport":{"x":0,"y":0,"zoom":1},"nodes":[],"edges":[]}',
                    });

                    globalFunctionInputRef.current.value = "";
                  }}
                >
                  <FaPlus />
                </Button>
              </div>
              <div className="grid grid-cols-[220px_60px]">
                <span>Function name</span>
                <span>Action</span>
              </div>
              {Object.entries(globalFunctions).map(([name, _], i) => (
                <FunctionItem
                  isActive={activeFunction === name}
                  handleSave={handleSaveFunction}
                  handleCancel={handleCancelFunction}
                  name={name}
                  key={i}
                  handleAddNode={handleAddFunctionNode}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        {activeFunction && (
          <AccordionItem value="parameters">
            <AccordionTrigger>Function Parameters</AccordionTrigger>
            <AccordionContent>
              <div className="w-full flex flex-col gap-3 text-center">
                <div className="flex gap-2">
                  <Input
                    placeholder="Variable Name"
                    ref={functionParameterInputRef}
                  />
                  <DropdownEditor
                    values={["string", "number", "boolean", "block"]}
                    value={variableDataType.parameter}
                    onSelect={(val) =>
                      setVariableDataType((prev) => ({
                        ...prev,
                        parameter: val,
                      }))
                    }
                  />
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => {
                      if (!functionParameterInputRef.current) return;
                      const value = functionParameterInputRef.current.value;
                      if (!value || value.length === 0) return;
                      const parameters: string[] = getFunction(
                        activeFunction,
                        "parameters"
                      );
                      setFunction(activeFunction, "parameters", {
                        ...parameters,
                        [value]: variableDataType.parameter,
                      });

                      functionParameterInputRef.current.value = "";
                    }}
                  >
                    <FaPlus />
                  </Button>
                </div>
                <div className="grid grid-cols-[120px_100px_60px]">
                  <span>Variable name</span>
                  <span>Data Type</span>
                  <span>Action</span>
                </div>
                {Object.entries(getFunction(activeFunction, "parameters")).map(
                  ([name, type], i) => (
                    <ParameterItem
                      name={name}
                      type={type as string}
                      key={i}
                      handleAddNode={handleAddParameterNode}
                      handleDelete={handleDelete}
                    />
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
