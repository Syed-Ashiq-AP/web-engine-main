import { Handle, Position, useNodeConnections } from "@xyflow/react";

export type FlowHandleType = {
  position: "left" | "right";
  id?: "in" | "out" | string;
};

type InputOutputHandleType = {
  id: string;
  isOutput?: boolean;
};

export const handleTypes = {
  FlowHandle: ({ position, id }: FlowHandleType) => {
    const handleType = position === "left" ? "target" : "source";
    const handleID = id ? id : position === "left" ? "in" : "out";
    const connections = useNodeConnections({
      handleType: handleType,
      handleId: handleID,
    });
    const isConnected = connections.length !== 0;
    return (
      <Handle
        className={`we_flow_handle ${isConnected && "we_connected"}`}
        id={handleID}
        type={handleType}
        position={position === "left" ? Position.Left : Position.Right}
        isConnectable={!isConnected}
      />
    );
  },
  InputOutputHandle: ({ id, isOutput = false }: InputOutputHandleType) => {
    const connections = useNodeConnections({
      handleType: isOutput ? "source" : "target",
      handleId: id,
    });
    const isConnected = connections.length !== 0;
    return (
      <Handle
        className={`we_input_handle ${isConnected && "we_connected"}`}
        id={id}
        type={isOutput ? "source" : "target"}
        position={isOutput ? Position.Right : Position.Left}
        isConnectable={!isConnected}
      />
    );
  },
};
