import React from "react";
import { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Input } from "@/components/ui/input";
export const StringInput = ({ id, data }: any) => {
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
};
