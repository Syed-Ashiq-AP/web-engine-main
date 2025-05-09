import {
  Edge,
  Handle,
  Node,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FlowHandle } from "../handles/FlowHandle";
import { DropdownEditor } from "../../../canvas/right-side-bar/editors/DropdownEditor";
import { useJS } from "@/app/providers/js-provider";
import { LabeledHandle } from "@/components/ui/labeled-handle";
import { useClassName } from "@/app/providers/class-provider";
import { useEditor } from "@/app/providers/editor-provider";
import { TagAttributes, TagNames, TagStyles } from "../../utils";
import { InputEditor } from "../../../canvas/right-side-bar/editors/InputEditor";

export const nodeTypes = {
  Start: () => {
    return (
      <div className="we_node">
        <span>Start</span>
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="to"
          className="program-flow"
        />
      </div>
    );
  },
  VariableGet: ({ data }: { data: { [key: string]: string } }) => {
    const { name } = data;
    return (
      <div className="we_node">
        <span>{name}</span>
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="getVariable"
        />
      </div>
    );
  },
  VariableSet: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string };
  }) => {
    const { updateNodeData } = useReactFlow();
    const logConnections = useNodeConnections({
      handleType: "target",
      handleId: "variable",
    });
    const { name } = data;

    const [value, setValue] = useState("");
    const onChange = useCallback((evt: any) => {
      const val = evt.target.value;
      setValue(val);
    }, []);

    useEffect(() => {
      if (!value) return;
      updateNodeData(id, { value: value });
    }, [value]);

    return (
      <div className="we_node">
        <FlowHandle style={{ top: 10 }} left />
        <Handle type={"target"} position={Position.Left} id="variable" />
        <FlowHandle style={{ top: 10 }} />
        <div>
          <span>{name}</span>
          {logConnections.length === 0 && (
            <Input
              placeholder="value"
              className="nodrag"
              value={value}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    );
  },
  ConsoleLog: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string };
  }) => {
    const { updateNodeData } = useReactFlow();
    const logConnections = useNodeConnections({
      handleType: "target",
      handleId: "variable",
    });

    const [inputValue, setInputValue] = useState<string>(
      data ? data.value : ""
    );

    const onChange = useCallback((evt: any) => {
      const val = evt.target.value;
      setInputValue(val);
      updateNodeData(id, { value: val });
    }, []);

    return (
      <div className="we_node">
        <FlowHandle left style={{ top: 10 }} />
        <Handle type={"target"} position={Position.Left} id="variable" />
        <div className="flex gap-2 items-center">
          <label htmlFor="log">Log:</label>

          {logConnections.length === 0 && (
            <Input
              id="log"
              name="log"
              className="nodrag"
              placeholder="Log"
              value={inputValue}
              onChange={onChange}
            />
          )}
        </div>
        <FlowHandle style={{ top: 10 }} />
      </div>
    );
  },
  IFBranch: () => {
    return (
      <div className="we_node h-20 w-60">
        <FlowHandle left className="!top-5" />
        <Handle
          type={"target"}
          position={Position.Left}
          isConnectable
          id="condition"
          className={cn("mt-3 !size-3 !left-4")}
        />
        <span className="absolute top-1/2 left-10">Condition</span>
        <span>IF</span>
        <FlowHandle id="toTrue" className={"!top-5"} />
        <span className="absolute top-2 right-5">True</span>
        <FlowHandle id="toFalse" className={"!top-3/4"} />
        <span className="absolute !bottom-[10%] right-5">Flase</span>
      </div>
    );
  },
  Compare: ({ id, data }: { id: string; data: { [key: string]: string } }) => {
    const { updateNodeData } = useReactFlow();

    const operator = data.operator ?? "===";

    useEffect(() => {
      if (!operator) updateNodeData(id, { operator: "===" });
    }, [operator]);

    return (
      <div className="we_node h-15">
        <Handle
          type={"target"}
          position={Position.Left}
          isValidConnection={(edge) => false}
          id="left"
          className="!top-5"
        />
        <Handle
          type={"target"}
          position={Position.Left}
          isConnectable
          id="right"
          className={cn("mt-2")}
        />
        <DropdownEditor
          values={{
            "===": "Equal",
            "!==": "Not Equal",
            "<=": "Less Than or Equal",
            ">=": "Greater Than or Equal",
            "<": "Less Than",
            ">": "Greater Than",
          }}
          value={operator}
          onSelect={(val) => {
            updateNodeData(id, { operator: val });
          }}
        />
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="bool"
        />
      </div>
    );
  },
  Gate: ({ id, data }: { id: string; data: { [key: string]: string } }) => {
    const { updateNodeData } = useReactFlow();

    const gate = data.gate ?? "and";

    useEffect(() => {
      if (!gate) updateNodeData(id, { gate: "and" });
    }, [gate]);

    return (
      <div className="we_node h-15">
        <Handle
          type={"target"}
          position={Position.Left}
          id="fromboolleft"
          className="!top-5"
        />
        {gate !== "not" && (
          <Handle
            type={"target"}
            position={Position.Left}
            isConnectable
            id="fromboolright"
            className={cn("mt-2")}
          />
        )}
        <DropdownEditor
          values={["and", "or", "xor", "nor", "not", "nand"]}
          value={gate}
          onSelect={(val) => {
            updateNodeData(id, { gate: val });
          }}
        />
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="bool"
        />
      </div>
    );
  },
  StringInput: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string };
  }) => {
    const { updateNodeData } = useReactFlow();
    const [value, setValue] = useState(data.value);

    const onChange = useCallback((evt: any) => {
      const val = evt.target.value;
      setValue(val);
      updateNodeData(id, { value: val });
    }, []);

    return (
      <div className="we_node">
        <div>{data.label}</div>
        <Input
          id={`string-${id}`}
          name="string"
          className="nodrag"
          placeholder="Log"
          onChange={onChange}
          value={value}
        />
        <Handle type="source" position={Position.Right} />
      </div>
    );
  },
  ParameterGet: ({ data }: { id: string; data: { [key: string]: string } }) => {
    const { name } = data;
    return (
      <div className="we_node">
        <span>{name}</span>
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="get"
        />
      </div>
    );
  },
  Return: ({ id, data }: { id: string; data: { [key: string]: string } }) => {
    const { updateNodeData } = useReactFlow();
    const logConnections = useNodeConnections({
      handleType: "target",
      handleId: "variable",
    });

    const [inputValue, setInputValue] = useState(data?.value);

    const onChange = useCallback((evt: any) => {
      const val = evt.target.value;
      setInputValue(val);
      updateNodeData(id, { value: val });
    }, []);

    return (
      <div className="we_node">
        <FlowHandle left style={{ top: 10 }} />
        <Handle type={"target"} position={Position.Left} id="variable" />
        <div className="flex gap-2 items-center">
          <label htmlFor="log">Return </label>

          {logConnections.length === 0 && (
            <Input
              id="log"
              name="log"
              className="nodrag"
              placeholder="Log"
              value={inputValue}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    );
  },
  FunctionCall: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string };
  }) => {
    const { name } = data;

    const JSContext = useJS();
    if (!JSContext) return;

    const { getFunction } = JSContext;

    const parameters: string[] = useMemo(
      () => getFunction(name, "parameters"),
      [getFunction]
    );
    const returns: Node[] = useMemo(() => {
      const { nodes }: { nodes: Node[] } = JSON.parse(
        getFunction(name, "instance")
      );
      const returnNodes = nodes.filter((node) => node.type === "Return");
      if (returnNodes) return returnNodes;
      return [];
    }, [getFunction]);

    return (
      <div className="we_node w-60">
        <FlowHandle left style={{ top: 10 }} />
        <FlowHandle style={{ top: 10 }} />
        <span>{name}</span>
        <div className="flex">
          <div className="flex-1">
            {parameters.map((param) => (
              <LabeledHandle
                title={param}
                type={"target"}
                position={Position.Left}
                id={param}
              />
            ))}
          </div>
          <div className="flex-1">
            {returns.length > 0 && (
              <LabeledHandle
                title={`return`}
                type={"source"}
                position={Position.Right}
                id={`return`}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
  GetElement: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string };
  }) => {
    const editorContext = useEditor();
    if (!editorContext) return;

    const { canvas } = editorContext;

    const { updateNodeData } = useReactFlow();
    const { qeuryMethod = "", queryFor = "" } = data;
    const queryMenu = { ".": "Class Name", "#": "ID", "": "Name" };

    const ClassNameContext = useClassName();
    if (!ClassNameContext) return;
    const { classes = {} } = ClassNameContext;

    const getCanvasIDs = useCallback((): string[] => {
      if (!canvas.current || !canvas.current?.shadowRoot) return [];
      const parent = canvas.current.shadowRoot.getElementById("we_canvas_root");
      if (!parent) return [];
      const childIds = Array.from(parent.children)
        .map((child) => child.id)
        .filter((id) => id);

      return childIds;
    }, [canvas]);

    return (
      <div className="we_node">
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable
          id="getElement"
        />
        <DropdownEditor
          title="Method"
          values={queryMenu}
          value={qeuryMethod}
          onSelect={(val) => {
            updateNodeData(id, { qeuryMethod: val, queryFor: "" });
          }}
        />
        {qeuryMethod === "" && (
          <DropdownEditor
            title="Name"
            values={TagNames}
            value={queryFor}
            onSelect={(val) => {
              updateNodeData(id, { queryFor: val });
            }}
          />
        )}

        {qeuryMethod === "." && (
          <DropdownEditor
            title="Class"
            values={Object.keys(classes)}
            value={queryFor}
            onSelect={(val) => {
              updateNodeData(id, { queryFor: val });
            }}
          />
        )}

        {qeuryMethod === "#" && (
          <DropdownEditor
            title="ID"
            values={getCanvasIDs()}
            value={queryFor}
            onSelect={(val) => {
              updateNodeData(id, { queryFor: val });
            }}
          />
        )}
      </div>
    );
  },
  GetElementAttribute: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string | any };
  }) => {
    const { getAttribute = "", extras = {} } = data;

    const { updateNodeData } = useReactFlow();
    const Connections = useNodeConnections({
      handleType: "target",
      handleId: "variable",
    });

    return (
      <div className="we_node">
        <Handle type={"target"} position={Position.Left} id="variable" />
        <div className="flex flex-col gap-2">
          {Connections.length === 0 ||
          !["getElement", "getVariable"].includes(
            Connections[0].sourceHandle ?? ""
          ) ? (
            <>
              <span>Connect an element</span>
            </>
          ) : (
            <>
              <DropdownEditor
                title="Attribute"
                values={TagAttributes}
                value={getAttribute}
                onSelect={(val) => updateNodeData(id, { getAttribute: val })}
              />
              {getAttribute === "style" && (
                <DropdownEditor
                  title="Style"
                  values={TagStyles}
                  value={extras.style}
                  onSelect={(val) =>
                    updateNodeData(id, { extras: { style: val } })
                  }
                />
              )}
              {getAttribute === "class" && (
                <InputEditor
                  title="Class List Index"
                  value={extras.index}
                  onInput={(val: string) =>
                    updateNodeData(id, { extras: { index: val } })
                  }
                />
              )}
            </>
          )}
          <Handle type={"source"} position={Position.Right} id="attribute" />
        </div>
      </div>
    );
  },
  SetElementAttribute: ({
    id,
    data,
  }: {
    id: string;
    data: { [key: string]: string | any };
  }) => {
    const { setAttribute = "", attributeValue = "", extras = {} } = data;

    const { updateNodeData } = useReactFlow();
    const Connections = useNodeConnections({
      handleType: "target",
      handleId: "variable",
    });

    return (
      <div className="we_node">
        <FlowHandle left style={{ top: 10 }} />
        <Handle type={"target"} position={Position.Left} id="variable" />
        <div className="flex flex-col gap-2">
          {Connections.length === 0 ||
          !["getElement", "getVariable"].includes(
            Connections[0].sourceHandle ?? ""
          ) ? (
            <>
              <span>Connect an element</span>
            </>
          ) : (
            <>
              <DropdownEditor
                title="Attribute"
                values={TagAttributes}
                value={setAttribute}
                onSelect={(val) => updateNodeData(id, { setAttribute: val })}
              />
              {setAttribute === "style" && (
                <DropdownEditor
                  title="Style"
                  values={TagStyles}
                  value={extras.style}
                  onSelect={(val) =>
                    updateNodeData(id, { extras: { style: val } })
                  }
                />
              )}
              {setAttribute === "class" && (
                <DropdownEditor
                  title="Action"
                  values={["add", "remove"]}
                  value={extras.action}
                  onSelect={(val: string) =>
                    updateNodeData(id, { extras: { action: val } })
                  }
                />
              )}
              <InputEditor
                title="Value"
                value={attributeValue}
                onInput={(val: string) =>
                  updateNodeData(id, { attributeValue: val })
                }
              />
            </>
          )}
          <Handle type={"source"} position={Position.Right} id="attribute" />
        </div>
        <FlowHandle style={{ top: 10 }} />
      </div>
    );
  },
};
