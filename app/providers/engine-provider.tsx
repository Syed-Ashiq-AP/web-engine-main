"use client";
import React, { ReactNode } from "react";
import { GlobalStyleContextProvider } from "@/app/providers/style-provider";
import { ClassNameContextProvider } from "@/app/providers/class-provider";
import { AnimationsContextProvider } from "@/app/providers/animation-provider";
import { TypeFaceContextProvider } from "@/app/providers/typography-provider";
import { JSContextProvider } from "@/app/providers/js-provider";
import { ReactFlowProvider } from "@xyflow/react";
import { DataContextProvider } from "@/app/providers/data-provider";
import { EditorContextProvider } from "@/app/providers/editor-provider";
import { PageContextProvider } from "@/app/providers/page-provirder";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorTour } from "./editor-tour";

export const EngineProvider = ({
  projectID,
  children,
}: {
  projectID: string;
  children: ReactNode;
}) => {
 

  return (
    <ReactFlowProvider>
      <TooltipProvider>
        <PageContextProvider>
          <EditorContextProvider>
            <GlobalStyleContextProvider>
              <ClassNameContextProvider>
                <TypeFaceContextProvider>
                  <AnimationsContextProvider>
                    <JSContextProvider>
                      <DataContextProvider id={projectID}>
                        <EditorTour>{children}</EditorTour>
                      </DataContextProvider>
                    </JSContextProvider>
                  </AnimationsContextProvider>
                </TypeFaceContextProvider>
              </ClassNameContextProvider>
            </GlobalStyleContextProvider>
          </EditorContextProvider>
        </PageContextProvider>
      </TooltipProvider>
    </ReactFlowProvider>
  );
};
