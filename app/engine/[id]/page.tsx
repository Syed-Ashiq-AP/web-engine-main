import { Navbar } from "./navbar/navbar";
import { Editor } from "./editor";
import { EngineProvider } from "@/app/providers/engine-provider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const projectID = (await params).id;

  return (
    <EngineProvider projectID={projectID}>
      <div className="relative w-full h-full">
        <Navbar id={projectID} />
        <Editor />
      </div>
    </EngineProvider>
  );
}
