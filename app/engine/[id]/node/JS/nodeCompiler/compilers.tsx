import { Edge, Node } from "@xyflow/react";
import { Compile, underCase } from "../../utils";

type CompilerKeys = keyof typeof compilers;
export const compilers = {
  VariableGet: (node: any) => {
    return underCase(node.data.name);
  },
  StringInput: (node: any) => {
    return `'${node.data.value}'`;
  },
  VariableSet: (node: any, nodes: any[], edges: any[]): string => {
    const { data, id } = node;
    const variableEdge = edges.find(
      (edge) => edge.target === id && edge.targetHandle === "variable"
    );
    if (!variableEdge) return `${underCase(data.name)} = '${data.value}'`;

    const variableNode = nodes.find((node) => node.id === variableEdge.source);
    return `${underCase(data.name)} = ${compilers[
      variableNode.type as CompilerKeys
    ](variableNode, nodes, edges)}`;
  },
  ConsoleLog: (node: Node, nodes: any[], edges: any[]): string => {
    const { data, id } = node;
    const variableEdge = edges.find(
      (edge) => edge.target === id && edge.targetHandle === "variable"
    );
    if (!variableEdge)
      return `console.log(${data.value && "'" + data.value + "'"})`;

    const variableNode = nodes.find((node) => node.id === variableEdge.source);
    return `console.log(${compilers[variableNode.type as CompilerKeys](
      variableNode,
      nodes,
      edges
    )})`;
  },
  IFBranch: (node: any, nodes: any[], edges: any[]): string => {
    const branches: {
      condition: string | string[] | null;
      toTrue: string | string[] | null;
      toFalse: string | string[] | null;
    } = { condition: null, toTrue: null, toFalse: null };
    const toTrue = edges.find(
      (edge) => edge.source === node.id && edge.sourceHandle === "toTrue"
    );
    if (toTrue) branches.toTrue = Compile(toTrue, edges, nodes);
    const toFalse = edges.find(
      (edge) => edge.source === node.id && edge.sourceHandle === "toFalse"
    );
    if (toFalse) branches.toFalse = Compile(toFalse, edges, nodes);

    const fromCondition = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === "condition"
    );
    if (fromCondition) {
      const fromConditionNode = nodes.find(
        (node) => node.id === fromCondition.source
      );
      branches.condition = compilers[fromConditionNode.type as CompilerKeys](
        fromConditionNode,
        nodes,
        edges
      );
    }
    if (!branches.condition) return "";
    if (branches.toFalse && !branches.toTrue)
      return `if(!${branches.condition}){${branches.toFalse}}`;
    if (branches.toTrue && !branches.toFalse)
      return `if(${branches.condition}){${branches.toTrue}}`;
    return `if(${branches.condition}){${branches.toTrue}}else{${branches.toFalse}}`;
  },
  Compare: (node: any, nodes: any[], edges: any[]): string => {
    const { operator } = node.data;
    const branches: { left: string | null; right: string | null } = {
      left: null,
      right: null,
    };
    const left = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === "left"
    );
    if (left) {
      const leftNode = nodes.find((node) => node.id === left.source);
      branches.left = compilers[leftNode.type as CompilerKeys](
        leftNode,
        nodes,
        edges
      );
    }
    const right = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === "right"
    );
    if (right) {
      const rightNode = nodes.find((node) => node.id === right.source);
      branches.right = compilers[rightNode.type as CompilerKeys](
        rightNode,
        nodes,
        edges
      );
    }
    if (!branches.left || !branches.right) return "";
    return `${branches.left} ${operator} ${branches.right}`;
  },
  Gate: (node: any, nodes: any[], edges: any[]): string => {
    const { gate } = node.data;
    const branches: { left: string | null; right: string | null } = {
      left: null,
      right: null,
    };
    const left = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === "fromleft"
    );
    if (left) {
      const leftNode = nodes.find((node) => node.id === left.source);
      branches.left = compilers[leftNode.type as CompilerKeys](
        leftNode,
        nodes,
        edges
      );
    }
    const right = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === "fromright"
    );
    if (right) {
      const rightNode = nodes.find((node) => node.id === right.source);
      branches.right = compilers[rightNode.type as CompilerKeys](
        rightNode,
        nodes,
        edges
      );
    }
    if (!branches.left) return "";
    switch (gate) {
      case "and":
        return `(${branches.left}) && (${branches.right})`;
      case "or":
        return `(${branches.left}) || (${branches.right})`;
      case "xor":
        return `(${branches.left} && !${branches.right}) || (!${branches.left} && ${branches.right})`;
      case "nor":
        return `!((${branches.left}) || (${branches.right}))`;
      case "not":
        return `!${branches.left}`;
      case "nand":
        return `!((${branches.left}) && (${branches.right}))`;
      default:
        return "";
    }
  },
  ParameterGet: (node: any) => {
    return underCase(node.data.name);
  },
  Return: (node: Node, nodes: any[], edges: any[]): string => {
    const { data, id } = node;
    const variableEdge = edges.find(
      (edge) => edge.target === id && edge.targetHandle === "variable"
    );
    if (!variableEdge) return `return ${data.value && "'" + data.value + "'"}`;

    const variableNode = nodes.find((node) => node.id === variableEdge.source);
    return `return ${compilers[variableNode.type as CompilerKeys](
      variableNode,
      nodes,
      edges
    )}`;
  },
  FunctionCall: (node: Node, nodes: Node[], edges: Edge[]) => {
    const { data, id } = node;
    const { name } = data;
    const parameterEdges: Edge[] = edges.filter(
      (edge) => edge.target === id && edge.targetHandle !== "from"
    );
    const compiledArgs: string[] = parameterEdges.map((edge) => {
      const EdgeNode: Node | undefined = nodes.find(
        (node) => node.id === edge.source
      );
      if (!EdgeNode) return "";
      return compilers[EdgeNode.type as CompilerKeys](EdgeNode, nodes, edges);
    });
    return `${name}(${compiledArgs.join(",")})`;
  },
  GetElement: (node: Node, nodes: Node[], edges: Edge[]) => {
    const { data } = node;
    const { qeuryMethod = "", queryFor = "" } = data;
    return `document.querySelector('${qeuryMethod}${queryFor}')`;
  },
  GetElementAttribute: (node: Node, nodes: Node[], edges: Edge[]): string => {
    const { id, data } = node;
    const { getAttribute, extras } = data as {
      getAttribute: string;
      extras: {
        style: string;
        index: string;
      };
    };
    const fromElementEdge: Edge | undefined = edges.find(
      (edge) => edge.target === id && edge.targetHandle === "variable"
    );
    if (!fromElementEdge) return "";
    const fromElementNode: Node | undefined = nodes.find(
      (node) => node.id === fromElementEdge.source
    );
    if (!fromElementNode) return "";
    const compiledGetElement: string | undefined = compilers[
      fromElementNode.type as CompilerKeys
    ](fromElementNode, nodes, edges);
    switch (getAttribute) {
      case "style":
        return `${compiledGetElement}.style.${extras.style}`;
      case "class":
        return `${compiledGetElement}.classList[${extras.index}]`;
      default:
        return `${compiledGetElement}.${getAttribute}`;
    }
  },
  SetElementAttribute: (node: Node, nodes: Node[], edges: Edge[]): string => {
    const { id, data } = node;
    const { setAttribute, extras, attributeValue } = data as {
      setAttribute: string;
      extras: {
        style: string;
        action: string;
      };
      attributeValue: string;
    };
    const fromElementEdge: Edge | undefined = edges.find(
      (edge) => edge.target === id && edge.targetHandle === "variable"
    );
    if (!fromElementEdge) return "";
    const fromElementNode: Node | undefined = nodes.find(
      (node) => node.id === fromElementEdge.source
    );
    if (!fromElementNode) return "";
    const compiledGetElement: string | undefined = compilers[
      fromElementNode.type as CompilerKeys
    ](fromElementNode, nodes, edges);
    switch (setAttribute) {
      case "style":
        return `${compiledGetElement}.style.${extras.style} = '${attributeValue}'`;
      case "class":
        return `${compiledGetElement}.classList.${extras.action}('${attributeValue}')`;
      default:
        return `${compiledGetElement}.${setAttribute} = '${attributeValue}'`;
    }
  },
};
