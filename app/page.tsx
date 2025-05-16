import { Toaster } from "@/components/ui/sonner";
import { ProjectList } from "./projects/project-list";

export default function Home() {
  return (
    <div className="w-full h-full p-5 sm:p-10 flex flex-col gap-4">
      <Toaster />
      <h1 className=" tracking-widest">Projects</h1>
      <ProjectList />
    </div>
  );
}
