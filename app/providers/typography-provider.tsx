"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGlobalStyle } from "./style-provider";

type FacesType = {
  value: string;
  label: string;
};

type TypeFaceContextType = {
  faces: FacesType[] | null;
  addFace: (value: string) => void;
};
const TypeFaceContext = createContext<TypeFaceContextType | null>(null);

export const TypeFaceContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [faces, setFaces] = useState<FacesType[] | null>(null);

  const [typeFaces, setTypeFaces] = useState({});

  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;
  const { addStyle } = globalStyleContext;

  useEffect(() => {
    const fetchFaces = async () => {
      const response = await fetch("/api/typefaces/?get=list");
      const data = await response.json();
      setFaces(data);
    };
    fetchFaces();
  }, []);

  const value = useMemo(
    () => ({
      faces,
      addFace: async (value: string) => {
        if (!faces) return;
        const faceValueList = faces.filter(
          (face: FacesType) => face.value === value
        );
        if (faceValueList.length > 0) {
          const faceValue = faceValueList[0].label;
          const response = await fetch(
            `/api/typefaces/?get=font&family=${faceValue}`
          );
          const data = await response.json();
          if (data) {
            setTypeFaces((prev) => {
              if (!Object.keys(prev).includes(value)) {
                return { ...prev, [value]: data };
              }
              return prev;
            });
            let css = "";
            const fontWeight = data.axes
              ? `${data.axes.start} ${data.axes.end}`
              : "500";
            Object.entries(data.files).map(([type, url], _) => {
              css += `@font-face {
                                    font-family: '${faceValue}';
                                    src: url('${url}') format('truetype');
                                    font-weight: ${fontWeight};
                                    font-style: ${
                                      type === "regular" ? "normal" : type
                                    };
                                    font-display: swap;
                                }`;
            });
            addStyle("Typeface" + faceValue, css);
          }
        }
      },
      getWeights: async (value: string) => {
        const response = await fetch(
          `/api/typefaces/?get=weight&family=${value}`
        );
        const data = await response.json();
        return data;
      },
      getStyles: async (value: string) => {
        const response = await fetch(
          `/api/typefaces/?get=styles&family=${value}`
        );
        const data = await response.json();
        return data;
      },
    }),
    [faces, typeFaces]
  );

  return (
    <TypeFaceContext.Provider value={value}>
      {children}
    </TypeFaceContext.Provider>
  );
};

export const useTypeFace = () => {
  const context = useContext(TypeFaceContext);
  if (context === undefined) {
    throw new Error(
      "useTypeFace must be used within a TypeFaceContextProvider"
    );
  }
  return context;
};
