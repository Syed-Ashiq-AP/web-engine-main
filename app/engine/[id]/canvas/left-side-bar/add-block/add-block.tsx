import React from "react";
import { blocks } from "./blocks";
import { BlockItem } from "./block-item";

export const AddBlock = () => {
  return (
    <div className={"flex-col items-stretch gap-2 p-2 w-full"}>
      <span className="text-md font-medium">Blocks</span>
      <div className="flex flex-col flex-1  py-2 gap-2 tracking-wide ">
        {Object.entries(blocks).map(([head, bls], k1) => (
          <div key={k1} className="flex flex-col gap-2">
            <span className="text-neutral-400 text-sm">{head}</span>
            <div className="grid grid-cols-2 gap-2">
              {bls.map((block, k2) => (
                <BlockItem key={k2} {...block} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
