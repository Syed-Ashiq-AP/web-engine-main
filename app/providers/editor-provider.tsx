"use client";
import { cva } from "class-variance-authority";
import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EditorContextType = {
  canvas: RefObject<HTMLDivElement | null>;
  setCanvas: (elem: HTMLDivElement) => void;
  activeElement: HTMLElement | null;
  setActiveElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

const editorContext = createContext<EditorContextType | null>(null);

export const EditorContextProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const canvas = useRef<HTMLDivElement | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const value = useMemo(
    () => ({
      canvas,
      setCanvas: (element: HTMLDivElement) => {
        canvas.current = element;
      },
      activeElement,
      setActiveElement,
    }),
    [canvas, activeElement]
  );

  return (
    <editorContext.Provider value={value}>{children}</editorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within editorContextProvider");
  }
  return context;
};
