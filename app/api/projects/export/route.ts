import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

const getHTML = (title: string, html: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="./index.css"/>
    </head>
    <body>
        ${html
          .replaceAll('contenteditable="true"', "")
          .replaceAll("we-active-element", "")}
    </body>
    <script src="./index.js"></script>
    </html>
    `;
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { message: "missing Fields", success: false },
      { status: 500 }
    );
  try {
    await connectMongoDB();
    const project = await Project.findById(id);
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
    const { pages, homePage } = projectData;
    if (!pages)
      return NextResponse.json(
        { message: "no data", success: false },
        { status: 500 }
      );

    let projectExport: {
      [key: string]: { js: string; html: string; css: string } | {};
    } = {};
    if (homePage) {
      projectExport.index = {};
      const homePageData = pages[homePage];
      if (!homePageData)
        NextResponse.json(
          { message: "no data", success: false },
          { status: 500 }
        );
      const pageHTML = homePageData.html ?? "";
      const JsContext = homePageData.JsContext ?? { JS: "", listeners: {} };
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
      const globalStyleContext = homePageData.globalStyleContext ?? {};
      const styles = Object.values(globalStyleContext).join("\n");
      const data = {
        html: getHTML("Home", pageHTML),
        js: JsContext.JS + ";" + listenerJS,
        styles,
      };
      projectExport.index = data;
    }
    Object.entries(pages).forEach(([pageName, pageData]: any, i) => {
      if (pageName === homePage) return;
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
        html: getHTML(pageName, pageHTML),
        js: JsContext.JS + ";" + listenerJS,
        styles,
      };
      projectExport[pageName] = data;
    });
    return NextResponse.json({ projectExport, success: true }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e, success: false }, { status: 500 });
  }
};
