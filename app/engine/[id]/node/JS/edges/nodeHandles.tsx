export const nodeHandles = {
    Start: { left: [], right: ["to"] },
    VariableGet: { left: [], right: ["get"] },
    ParameterGet: { left: [], right: ["get"] },
    VariableSet: { left: ["from"], right: ["to"] },
    ConsoleLog: { left: ["from", "variable"], right: ["to"] },
    IFBranch: { left: ["from", "condition"], right: ["toTrue", "toFalse"] },
    Compare: { left: ["right", "right"], right: ["bool"] },
    Gate: { left: ["right", "right"], right: ["bool"] },
    StringInput: { left: [], right: ["source"] },
    Return: { left: ["from", "variable"], right: [] },
};
