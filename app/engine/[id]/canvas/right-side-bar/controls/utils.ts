export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const extractShadow = (shadow: string) =>
  Array.from(
    shadow.matchAll(
      /\s*(rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\))\s+(\d+(?:px|em|rem|%)?)\s+(\d+(?:px|em|rem|%)?)\s*(\d+(?:px|em|rem|%)?)?\s*(inset)?/gi
    )
  ).map((sh) => {
    const [, color = "", xOffset = "", yOffset = "", blur = "", inset = ""] =
      sh;
    return { color, xOffset, yOffset, blur, inset };
  });

export const filterKeys = (dict: Record<string, any>, f: Function) => {
  const filteredKeys = Object.keys(dict).filter((key) => {
    return f(key);
  });

  return Object.fromEntries(filteredKeys.map((x: string) => [x, dict[x]]));
};

export const semiKebabCase = (string: string) =>
  string.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[\s_]+/g, " ");

export const KebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
