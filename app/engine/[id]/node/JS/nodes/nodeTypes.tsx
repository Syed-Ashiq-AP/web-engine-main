import {
    Edge,
    Handle,
    Node,
    Position,
    useNodeConnections,
    useReactFlow,
} from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FlowHandle } from "../handles/FlowHandle";
import { DropdownEditor } from "../../../canvas/right-side-bar/editors/DropdownEditor";
import { useJS } from "@/app/providers/js-provider";
import { LabeledHandle } from "@/components/ui/labeled-handle";
import { useClassName } from "@/app/providers/class-provider";
import { useEditor } from "@/app/providers/editor-provider";
import { TagAttributes, TagNames, TagStyles } from "../../utils";
import { InputEditor } from "../../../canvas/right-side-bar/editors/InputEditor";
import { handleTypes, FlowHandleType } from "../handles/handleTypes";
import { ClassNameValue } from "tailwind-merge";
import { underscoreToSpaced } from "../util";
type NodeHeaderType = {
    heading: string;
    hideLeft?: boolean;
    leftID?: "in" | string;
    rightID?: "out" | string;
    hideRight?: boolean;
    className?: ClassNameValue;
};
const NodeHeader = ({
    heading,
    hideLeft = false,
    leftID = "in",
    rightID = "out",
    hideRight = false,
    className,
}: NodeHeaderType) => {
    return (
        <div
            className={cn(
                "w-full border-b py-2 px-4 text-sm font-medium bg-neutral-900 rounded-t-lg relative",
                className
            )}
        >
            {!hideLeft && (
                <handleTypes.FlowHandle position="left" id={leftID} />
            )}
            {heading}
            {!hideRight && (
                <handleTypes.FlowHandle position="right" id={rightID} />
            )}
        </div>
    );
};

const NodeInputOutput = ({
    children,
    inputId,
    hideInput = false,
    outputId,
    hideOutput = false,
    heading,
    hideOnConnect,
    className,
}: {
    children?: ReactNode;
    inputId?: string;
    outputId?: string;
    heading?: string;
    hideOnConnect?: boolean;
    hideInput?: boolean;
    hideOutput?: boolean;
    className?: ClassNameValue;
}) => {
    const InputConnections = inputId
        ? useNodeConnections({
              handleType: "target",
              handleId: inputId,
          })
        : [];
    const isInputConnected = InputConnections.length !== 0;
    return (
        <div
            className={cn(
                "flex flex-col gap-2 justify-around p-2 relative",
                className
            )}
        >
            {!hideInput && inputId && (
                <handleTypes.InputOutputHandle id={inputId} />
            )}
            {heading && <span>{heading}</span>}
            {hideOnConnect ? !isInputConnected && children : children}
            {!hideOutput && outputId && (
                <handleTypes.InputOutputHandle isOutput id={outputId} />
            )}
        </div>
    );
};

export const nodeTypes = {
    Default: () => {
        return (
            <div className="">
                <NodeHeader heading="Heading" />
            </div>
        );
    },
    Start: () => {
        return (
            <div className="we_node">
                <span className="px-4 py-2">Start</span>
                <handleTypes.FlowHandle position="right" />
            </div>
        );
    },
    VariableGet: ({ data }: { data: { [key: string]: string } }) => {
        const { name, dataType = "" } = data;
        return (
            <div className="we_node">
                <NodeHeader
                    hideLeft
                    hideRight
                    heading="Get"
                    className={`we_${dataType}`}
                />
                <NodeInputOutput
                    outputId="out-get"
                    heading={underscoreToSpaced(name)}
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
        const { name, dataType = "" } = data;

        const [value, setValue] = useState("");
        const onChange = useCallback((val: any) => {
            setValue(val);
        }, []);

        useEffect(() => {
            if (!value) return;
            updateNodeData(id, { value: value });
        }, [value]);

        return (
            <div className="we_node">
                <NodeHeader heading="Set" className={`we_${dataType}`} />
                <NodeInputOutput
                    inputId="in-get"
                    hideOnConnect
                    heading={underscoreToSpaced(name)}
                >
                    {dataType === "string" && (
                        <Input
                            placeholder="value"
                            className="nodrag"
                            value={value}
                            onChange={(e: any) => onChange(e.target.value)}
                        />
                    )}
                    {dataType === "number" && (
                        <Input
                            id={`string-${id}`}
                            name="Number"
                            type="number"
                            className="nodrag"
                            placeholder="String"
                            onChange={(e: any) => onChange(e.target.value)}
                            value={value}
                        />
                    )}
                    {dataType === "boolean" && (
                        <DropdownEditor
                            onSelect={(val) =>
                                onChange(parseInt(val) === 1 ? true : false)
                            }
                            values={{ 0: "False", 1: "True" }}
                            value={value ? 1 : 0}
                        />
                    )}
                </NodeInputOutput>
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

        const { value } = data;

        const [inputValue, setInputValue] = useState<string>(value);

        useEffect(() => {
            if (!value) updateNodeData(id, { value: "" });
        }, [value]);

        const onChange = useCallback((evt: any) => {
            const val = evt.target.value;
            setInputValue(val);
            updateNodeData(id, { value: val });
        }, []);

        return (
            <div className="we_node">
                <NodeHeader heading="Console Log" />
                <NodeInputOutput inputId="in-get" heading="Log" hideOnConnect>
                    <div className="flex gap-2 items-center">
                        <Input
                            id="log"
                            name="log"
                            className="nodrag"
                            placeholder="Log"
                            value={inputValue}
                            onChange={onChange}
                        />
                    </div>
                </NodeInputOutput>
            </div>
        );
    },
    IFBranch: () => {
        return (
            <div className="we_node">
                <NodeHeader heading="IF Branch" hideRight />
                <div className="grid grid-cols-2 gap-x-2">
                    <NodeInputOutput
                        inputId="in-get-boolean"
                        heading="Condition"
                    />
                    <div>
                        <div
                            className={
                                "flex flex-col gap-2 justify-around p-2 relative"
                            }
                        >
                            <span>True</span>
                            <handleTypes.FlowHandle
                                id="out-true"
                                position="right"
                            />
                        </div>

                        <div
                            className={
                                "flex flex-col gap-2 justify-around p-2 relative"
                            }
                        >
                            <span>False</span>
                            <handleTypes.FlowHandle
                                id="out-false"
                                position="right"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    Compare: ({
        id,
        data,
    }: {
        id: string;
        data: { [key: string]: string };
    }) => {
        const { updateNodeData } = useReactFlow();

        const operator = data.operator ?? "===";

        useEffect(() => {
            if (!operator) updateNodeData(id, { operator: "===" });
        }, [operator]);

        return (
            <div className="we_node">
                <div className="flex py-2 items-stretch">
                    <div className="flex flex-col">
                        <NodeInputOutput inputId="in-get-left" />
                        <NodeInputOutput inputId="in-get-right" />
                    </div>
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
                    <div className="flex flex-col h-full">
                        <NodeInputOutput
                            outputId="out-get-boolean"
                            className="static"
                        />
                    </div>
                </div>
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
            <div className="we_node">
                <div className="flex py-2 items-stretch">
                    <div className="flex flex-col">
                        <NodeInputOutput inputId="in-get-left" />
                        {gate !== "not" && (
                            <NodeInputOutput inputId="in-get-right" />
                        )}
                    </div>
                    <DropdownEditor
                        values={["and", "or", "xor", "nor", "not", "nand"]}
                        value={gate}
                        onSelect={(val) => {
                            updateNodeData(id, { gate: val });
                        }}
                    />
                    <div className="flex flex-col h-full">
                        <NodeInputOutput
                            outputId="out-get-boolean"
                            className="static"
                        />
                    </div>
                </div>
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
        const [value, setValue] = useState(data.value ?? "");

        const onChange = useCallback((evt: any) => {
            const val = evt.target.value;
            setValue(val);
            updateNodeData(id, { value: val });
        }, []);

        return (
            <div className="we_node">
                <NodeHeader
                    hideLeft
                    hideRight
                    heading="String"
                    className="we_string"
                />
                <NodeInputOutput outputId="out-get">
                    <Input
                        id={`string-${id}`}
                        name="string"
                        className="nodrag"
                        placeholder="String"
                        onChange={onChange}
                        value={value}
                    />
                </NodeInputOutput>
            </div>
        );
    },
    NumericInput: ({
        id,
        data,
    }: {
        id: string;
        data: { [key: string]: any };
    }) => {
        const { updateNodeData } = useReactFlow();
        const [value, setValue] = useState<number>(data.value ?? 0);

        const onChange = useCallback((evt: any) => {
            const val = parseInt(evt.target.value);
            setValue(val);
            updateNodeData(id, { value: val });
        }, []);

        return (
            <div className="we_node">
                <NodeHeader
                    hideLeft
                    hideRight
                    heading="Numeric"
                    className="we_number"
                />
                <NodeInputOutput outputId="out-get">
                    <Input
                        id={`string-${id}`}
                        name="Number"
                        type="number"
                        className="nodrag"
                        placeholder="String"
                        onChange={onChange}
                        value={value}
                    />
                </NodeInputOutput>
            </div>
        );
    },
    BooleanInput: ({
        id,
        data,
    }: {
        id: string;
        data: { [key: string]: any };
    }) => {
        const { updateNodeData } = useReactFlow();
        const [value, setValue] = useState(data.value ?? 0);

        const onChange = useCallback((val: any) => {
            setValue(val);
            updateNodeData(id, { value: val });
        }, []);

        useEffect(() => {
            if (!value) {
                setValue(true);
                updateNodeData(id, { value: true });
            }
        }, [value]);

        return (
            <div className="we_node">
                <NodeHeader
                    hideLeft
                    hideRight
                    heading="Boolean"
                    className="we_boolean"
                />
                <NodeInputOutput outputId="out-get">
                    <DropdownEditor
                        onSelect={(val) =>
                            onChange(parseInt(val) === 1 ? true : false)
                        }
                        values={{ 0: "False", 1: "True" }}
                        value={value ? 1 : 0}
                    />
                </NodeInputOutput>
            </div>
        );
    },
    ParameterGet: ({
        data,
    }: {
        id: string;
        data: { [key: string]: string };
    }) => {
        const { name, dataType } = data;
        return (
            <div className="we_node">
                <NodeHeader
                    hideLeft
                    hideRight
                    heading="Get"
                    className={`we_${dataType}`}
                />
                <NodeInputOutput
                    outputId="out-get"
                    heading={underscoreToSpaced(name)}
                />
            </div>
        );
    },
    Return: ({ id, data }: { id: string; data: { [key: string]: string } }) => {
        const { updateNodeData } = useReactFlow();

        const [inputValue, setInputValue] = useState(data?.value);

        const onChange = useCallback((evt: any) => {
            const val = evt.target.value;
            setInputValue(val);
            updateNodeData(id, { value: val });
        }, []);

        return (
            <div className="we_node">
                <NodeHeader heading="Return" hideRight />
                <NodeInputOutput heading="Value" inputId="in-get" hideOnConnect>
                    <Input
                        id="log"
                        name="log"
                        className="nodrag"
                        placeholder="Log"
                        value={inputValue}
                        onChange={onChange}
                    />
                </NodeInputOutput>
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

        const flowConnected = useNodeConnections({
            handleType: "source",
            handleId: "out",
        });
        const outputConnected = useNodeConnections({
            handleType: "source",
            handleId: "out-get",
        });

        const hideFlow = outputConnected.length > 0;
        const hideOutput = flowConnected.length > 0;

        return (
            <div className="we_node w-60">
                <NodeHeader
                    heading={name}
                    hideRight={hideFlow}
                    hideLeft={hideFlow}
                />
                <div className="flex">
                    <div className="flex-1">
                        {Object.keys(parameters).map((param, i) => (
                            <NodeInputOutput
                                heading={param}
                                key={i}
                                inputId={"in-get"}
                            />
                        ))}
                    </div>
                    <div className="flex-1">
                        {returns.length > 0 && (
                            <NodeInputOutput
                                heading={"Output"}
                                outputId="out-get"
                                hideOutput={hideOutput}
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
            const parent =
                canvas.current.shadowRoot.getElementById("we_canvas_root");
            const getID = (childs: HTMLCollection): string[] =>
                Array.from(childs)
                    .map((child) => {
                        if (child.children.length > 0) {
                            return [child.id, ...getID(child.children)];
                        }
                        return [child.id];
                    })
                    .flat()
                    .filter((id) => id.replace(/-we-(?!.*-we-).*$/, ""));
            if (!parent) return [];
            const childIds = getID(parent.children);

            return childIds;
        }, [canvas]);

        return (
            <div className="we_node">
                <NodeHeader
                    heading="Get Element"
                    hideLeft
                    hideRight
                    className="we_block"
                />
                <NodeInputOutput outputId="out-get-block">
                    <DropdownEditor
                        title="Method"
                        values={queryMenu}
                        value={qeuryMethod}
                        onSelect={(val) => {
                            updateNodeData(id, {
                                qeuryMethod: val,
                                queryFor: "",
                            });
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
                </NodeInputOutput>
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
            handleId: "in-get-block",
        });

        return (
            <div className="we_node">
                <NodeHeader heading="Get Attribute" hideLeft hideRight />
                <NodeInputOutput
                    outputId="out-get-string"
                    inputId="in-get-block"
                >
                    <div className="flex flex-col gap-2">
                        {Connections.length === 0 ? (
                            <>
                                <span>Connect an element</span>
                            </>
                        ) : (
                            <>
                                <DropdownEditor
                                    title="Attribute"
                                    values={TagAttributes}
                                    value={getAttribute}
                                    onSelect={(val) =>
                                        updateNodeData(id, {
                                            getAttribute: val,
                                        })
                                    }
                                />
                                {getAttribute === "style" && (
                                    <DropdownEditor
                                        title="Style"
                                        values={TagStyles}
                                        value={extras.style}
                                        onSelect={(val) =>
                                            updateNodeData(id, {
                                                extras: { style: val },
                                            })
                                        }
                                    />
                                )}
                                {getAttribute === "class" && (
                                    <InputEditor
                                        title="Class List Index"
                                        value={extras.index}
                                        onInput={(val: string) =>
                                            updateNodeData(id, {
                                                extras: { index: val },
                                            })
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
                </NodeInputOutput>
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
            handleId: "in-get-block",
        });

        return (
            <div className="we_node">
                <NodeHeader heading="Set Attribute" />

                <NodeInputOutput inputId="in-get-block">
                    <div className="flex flex-col gap-2">
                        {Connections.length === 0 ? (
                            <>
                                <span>Connect an element</span>
                            </>
                        ) : (
                            <>
                                <DropdownEditor
                                    title="Attribute"
                                    values={TagAttributes}
                                    value={setAttribute}
                                    onSelect={(val) =>
                                        updateNodeData(id, {
                                            setAttribute: val,
                                        })
                                    }
                                />
                                {setAttribute === "style" && (
                                    <DropdownEditor
                                        title="Style"
                                        values={TagStyles}
                                        value={extras.style}
                                        onSelect={(val) =>
                                            updateNodeData(id, {
                                                extras: { style: val },
                                            })
                                        }
                                    />
                                )}
                                {setAttribute === "class" && (
                                    <DropdownEditor
                                        title="Action"
                                        values={["add", "remove"]}
                                        value={extras.action}
                                        onSelect={(val: string) =>
                                            updateNodeData(id, {
                                                extras: { action: val },
                                            })
                                        }
                                    />
                                )}
                                <InputEditor
                                    title="Value"
                                    value={attributeValue}
                                    onInput={(val: string) =>
                                        updateNodeData(id, {
                                            attributeValue: val,
                                        })
                                    }
                                />
                            </>
                        )}
                    </div>
                </NodeInputOutput>
            </div>
        );
    },
};
