export type classStateKeys = keyof typeof classStates;
export const classStates = {
  default: "",
  hover: ":hover",
  active: ":active",
  focus: ":focus",
  "focus visible": ":focus-visible",
  "focus within": ":focus-within",
  visited: ":visited",
  link: ":link",
  checked: ":checked",
  disabled: ":disabled",
  enabled: ":enabled",
  required: ":required",
  optional: ":optional",
  valid: ":valid",
  invalid: ":invalid",
  "read only": ":read-only",
  "read write": ":read-write",
  indeterminate: ":indeterminate",
};

export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const kebabToSpaced = (str: string) => {
  return str.replace(/-/g, " ");
};
