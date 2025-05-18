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
import { StepType, TourProvider } from "@reactour/tour";
import { PageContextProvider, usePage } from "@/app/providers/page-provirder";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorTour } from "./editor-tour";

export const EngineProvider = ({
  projectID,
  children,
}: {
  projectID: string;
  children: ReactNode;
}) => {
  const pageContext = usePage();
  if (!pageContext) return;
  const { setActiveMenu } = pageContext;

  const steps: StepType[] = [
    {
      selector: ".step-page",
      content: (
        <>
          <h5>Manage Your Pages</h5>
          <span className="text-sm">
            In this section, you can create new pages, delete existing ones, and
            set any page as your homepage. Use it to organize and control your
            website structure easily.
          </span>
        </>
      ),
      action: (elem) => {
        setActiveMenu("layers");
      },
    },
    {
      selector: ".step-blocks",
      content: (
        <>
          <h5>Element Layers Panel</h5>
          <span className="text-sm">
            This panel shows the hierarchical structure of all elements on the
            page. Use it to easily select, reorder, or manage nested elements.
          </span>
        </>
      ),
    },
  ];

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
