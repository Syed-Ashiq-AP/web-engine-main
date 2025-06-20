import { BaseEdge, getStraightPath } from "@xyflow/react";

export const edgeTypes = {
  ProgramFlow: ({ id, sourceX, sourceY, targetX, targetY }: any) => {
    const [edgePath] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    return (
      <>
        <BaseEdge id={id} path={edgePath} />
      </>
    );
  },
};
