import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";
import { Input } from "@/components/ui/input";

export const Variable = () => {
  const logConnections = useNodeConnections({
    handleType: "target",
    handleId: "logValue",
  });
  const { data }: { data: any | null } = useNodesData(
    logConnections?.[0]?.source
  ) ?? { data: null };
  return (
    <div className="we_node">
      <Handle
        type={"target"}
        position={Position.Left}
        isConnectable
        id="logValue"
      />
      <div className="flex gap-2 items-center">
        <label htmlFor="log">Log:</label>

        {data ? (
          <span>{data.value}</span>
        ) : (
          <Input
            id="var"
            name="var"
            className="nodrag"
            placeholder="Variable Value"
          />
        )}
      </div>
    </div>
  );
};
