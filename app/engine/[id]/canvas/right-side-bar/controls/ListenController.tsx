import React from "react";
import { DropdownEditor } from "../editors/DropdownEditor";

export const ListenController = ({
  functions,
  listen,
  funcName,
  handler,
}: {
  functions: string[];
  listen: string;
  funcName: string;
  handler: (event: string, val: string) => void;
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className=" font-medium">{listen}</span>
      <DropdownEditor
        title="Function"
        values={functions}
        value={funcName}
        onSelect={(val: string) => handler(listen, val)}
      />
    </div>
  );
};
