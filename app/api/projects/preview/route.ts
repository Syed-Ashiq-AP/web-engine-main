import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";
import { listeners } from "process";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const projectID = searchParams.get("id");
  let page = searchParams.get("page");
  if (!projectID)
    return NextResponse.json(
      { message: "Fields are missing", success: false },
      { status: 500 }
    );
  try {
    await connectMongoDB();
    const project = await Project.findById(projectID);
    if (!project)
      return NextResponse.json(
        { message: "Project not found", success: false },
        { status: 500 }
      );
    const projectData = project.data;
    if (!projectData)
      return NextResponse.json(
        { message: "No data", success: false },
        { status: 500 }
      );
    if (!page) page = Object.keys(projectData.pages)[0];
    const pageData = projectData.pages[page];
    if (!pageData)
      return NextResponse.json(
        { message: "No data", success: false },
        { status: 500 }
      );
    const pageHTML = pageData.html ?? "";
    const JsContext = pageData.JsContext ?? { JS: "", listeners: {} };
    const listenerJS = Object.entries(JsContext.listeners).map(
      ([id, listener]) => {
        return Object.entries(listener as any).map(
          ([
            listen,
            fun,
          ]) => `document.getElementById('${id}')?.addEventListener('${listen}', () => {
      ${fun}();
    });`
        );
      }
    );
    const globalStyleContext = pageData.globalStyleContext ?? {};
    const styles = Object.values(globalStyleContext).join("\n");
    const data = {
      html: pageHTML,
      js: JsContext.JS + ";" + listenerJS,
      styles,
    };
    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};
