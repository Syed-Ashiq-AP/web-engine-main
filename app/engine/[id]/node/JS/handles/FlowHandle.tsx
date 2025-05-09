import { Handle, Position, useNodeConnections } from "@xyflow/react";
import { cn } from "@/lib/utils";

export const FlowHandle = ({ left = false, className, id, ...props }: any) => {
    const connections = useNodeConnections({
        handleType: left ? "target" : "source",
        handleId: left ? "from" : "to",
    });

    return (
        <>
            <Handle
                type={left ? "target" : "source"}
                position={left ? Position.Left : Position.Right}
                id={id ? id : left ? "from" : "to"}
                className={cn("program-flow", className)}
                {...props}
                isConnectable={connections.length === 0}
            />
        </>
    );
};
