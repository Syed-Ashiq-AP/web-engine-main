import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rgbAObject = (rgbA: String) => {
  if (!rgbA) return;

  const RGBAExtract = rgbA.match(/[\d\.]+/g)?.map(Number);
  if (!RGBAExtract) return;
  return {
    r: RGBAExtract[0] ?? 255,
    g: RGBAExtract[1] ?? 255,
    b: RGBAExtract[2] ?? 255,
    a: RGBAExtract[3] ?? 1,
  };
};

export const rgbAString = ({
  r = 255,
  g = 255,
  b = 255,
  a = 1,
}: {
  r: Number;
  b: Number;
  g: Number;
  a: Number;
}) => `rgba(${r}, ${g}, ${b}, ${a})`;
