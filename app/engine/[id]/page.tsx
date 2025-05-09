import { PageContextProvider } from "@/app/providers/page-provirder";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "./navbar/navbar";
import { Editor } from "./editor";
import { GlobalStyleContextProvider } from "@/app/providers/style-provider";
import { ClassNameContextProvider } from "@/app/providers/class-provider";
import { AnimationsContextProvider } from "@/app/providers/animation-provider";
import { TypeFaceContextProvider } from "@/app/providers/typography-provider";
import { JSContextProvider } from "@/app/providers/js-provider";
import { ReactFlowProvider } from "@xyflow/react";
import { DataContextProvider } from "@/app/providers/data-provider";
import { EditorContextProvider } from "@/app/providers/editor-provider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const projectID = (await params).id;

  return (
    <>
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
                          <div className="relative w-full h-full">
                            <Navbar />
                            <Editor />
                          </div>
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
    </>
  );
}
