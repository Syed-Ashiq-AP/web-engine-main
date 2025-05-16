"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useJS } from "./js-provider";
import { useSession } from "next-auth/react";
import { UserDocument } from "@/models/User";
import { useReactFlow } from "@xyflow/react";
import { useEditor } from "./editor-provider";
import { useGlobalStyle } from "./style-provider";
import { useClassName } from "./class-provider";
import { AnimationsContext, useAnimations } from "./animation-provider";
import { toast } from "sonner";
import { activePageType, usePage } from "./page-provirder";

type dataContextType = {
  loadPage: (page: activePageType) => void;
  saveData: () => void;
  loadData: (data: any) => void;
  saveCurrentPage: () => void;
};

const dataContext = createContext<dataContextType | null>(null);

export const DataContextProvider = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { setNodes, setEdges, setViewport, screenToFlowPosition } =
    useReactFlow();

  const pageContext = usePage();
  if (!pageContext) return;
  const {
    pages,
    setPages,
    activePage,
    setActivePage,
    getPage,
    homePage,
    setHomePage,
  } = pageContext;

  const editorContext = useEditor();
  if (!editorContext) return;
  const { canvas } = editorContext;

  const JSContext = useJS();
  if (!JSContext) return;

  const globalStyleContext = useGlobalStyle();
  if (!globalStyleContext) return;

  const classNameContext = useClassName();
  if (!classNameContext) return;

  const animationsContext = useAnimations();
  if (!animationsContext) return;

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getJsContext = () => {
    const { JSFlow, JS, globalFunctions, globalVariables, listeners } =
      JSContext;
    return { JSFlow, JS, globalFunctions, globalVariables, listeners };
  };

  const getHTML = useCallback(() => {
    if (!canvas.current || !canvas.current.shadowRoot) return "";
    const root = canvas.current.shadowRoot.getElementById("we_canvas_root");
    if (!root) return;
    return root.innerHTML;
  }, [canvas]);

  const getGlobalStyle = useCallback(() => {
    const { globalStyles } = globalStyleContext;
    return globalStyles;
  }, [globalStyleContext]);

  const getClassName = () => {
    const { classes } = classNameContext;
    return classes;
  };

  const getAnimations = () => {
    const { animations } = animationsContext;
    return animations;
  };

  const saveData = useCallback(async () => {
    const data = {
      pages,
      activePage,
      homePage,
    };
    const res = await fetch("/api/projects/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectID: id,
        data,
      }),
    });

    const resData = await res.json();
    if (resData.success) {
      toast("Saved!");
    }
  }, [pages, activePage, homePage]);

  const loadJSFlow = async (flow: string) => {
    const func = JSON.parse(flow) ?? {};

    if (func) {
      const { x = 0, y = 0, zoom = 1 } = func.viewport;
      setNodes(func.nodes || []);
      setEdges(func.edges || []);
      setViewport({ x, y, zoom });
    }
  };

  const loadJsContext = (JsContext: any) => {
    const {
      setJSFlow,
      setGlobalVariables,
      setGlobalFunctions,
      setJS,
      setListeners,
    } = JSContext;
    if (!JsContext) return;
    const {
      JSFlow = "",
      globalVariables = {},
      JS = "",
      globalFunctions = {},
      listeners = {},
    } = JsContext;
    setJSFlow(JSFlow);
    setGlobalFunctions(globalFunctions);
    setGlobalVariables(globalVariables);
    setJS(JS);
    loadJSFlow(JSFlow);
    setListeners(listeners);
  };

  const loadGlobalStyleContext = (context: any) => {
    if (!context) return;
    const { setGlobalStyle } = globalStyleContext;
    setGlobalStyle(context);
  };

  const loadClassContext = (context: any) => {
    if (!context) return;
    const { setClasses } = classNameContext;
    setClasses(context);
  };

  const loadAnimationContext = (context: any) => {
    if (!context) return;
    const { setAnimations } = animationsContext;
    setAnimations(context);
  };

  const loadData = useCallback((projectData: any) => {
    if (!projectData) return;
    const {
      pages: projectPages,
      activePage: projectActivePage,
      homePage: projectHomePage,
    } = projectData;
    if (!projectPages || !projectActivePage) return;
    setPages(projectPages);
    setActivePage(projectActivePage);
    setHomePage(projectHomePage);
    const pageData = projectPages[projectActivePage];
    if (!pageData) return;
    loadJsContext(pageData.JsContext);
    loadGlobalStyleContext(pageData.globalStyleContext);
    loadClassContext(pageData.classNameContext);
    loadAnimationContext(pageData.animationsContext);
    const { html = "" } = pageData;
    document.dispatchEvent(new CustomEvent("setHTML", { detail: html }));
    // loadJsContext(projectData.JsContext);
    // loadGlobalStyleContext(projectData.globalStyleContext);
    // loadClassContext(projectData.classNameContext);
    // loadAnimationContext(projectData.animationsContext);
    // const { html = "" } = projectData;
    // document.dispatchEvent(new CustomEvent("setHTML", { detail: html }));
  }, []);

  const fetchProject = async () => {
    const req = await fetch(`/api/projects/get?id=${id}`);
    const res = await req.json();
    if (res.success) {
      const { project } = res;
      if (!project) return;
      const { data: projectData = {} } = project;
      return projectData;
    }
  };

  const loadPage = useCallback(
    (page: activePageType) => {
      const projectData = getPage(page);
      loadJsContext(projectData.JsContext);
      loadGlobalStyleContext(projectData.globalStyleContext);
      loadClassContext(projectData.classNameContext);
      loadAnimationContext(projectData.animationsContext);
      const { html = "" } = projectData;
      document.dispatchEvent(new CustomEvent("setHTML", { detail: html }));
    },
    [
      JSContext,
      editorContext,
      globalStyleContext,
      classNameContext,
      animationsContext,
      pages,
      activePage,
    ]
  );

  const saveCurrentPage = useCallback(async () => {
    if (!activePage) return;
    const data = {
      JsContext: getJsContext(),
      html: getHTML(),
      globalStyleContext: getGlobalStyle(),
      classNameContext: getClassName(),
      animationsContext: getAnimations(),
    };
    setPages((prev) => ({ ...prev, [activePage]: data }));
  }, [
    editorContext,
    JSContext,
    globalStyleContext,
    classNameContext,
    animationsContext,
    activePage,
    pages,
  ]);

  useEffect(() => {
    saveCurrentPage();
  }, [
    editorContext,
    JSContext,
    globalStyleContext,
    classNameContext,
    animationsContext,
  ]);

  useEffect(() => {
    if (!canvas.current) return;
    const shadow = canvas.current.shadowRoot;
    if (!shadow) return;

    const observer = new MutationObserver((mutationsList) => {
      if (!activePage) return;
      console.log(activePage);
      setPages((prev) => ({
        ...prev,
        [activePage]: { ...prev[activePage], html: getHTML() },
      }));
    });

    observer.observe(shadow, {
      childList: true, // detect added or removed children
      attributes: true, // detect attribute changes
      subtree: true, // watch all descendants, not just direct children
    });
    return () => {
      observer.disconnect();
    };
  }, [canvas, activePage]);

  useEffect(() => {
    fetchProject().then((projectData) => {
      loadData(projectData);
    });
  }, []);

  const value = useMemo(
    () => ({
      loadPage,
      saveData,
      loadData,
      saveCurrentPage,
    }),
    [saveData, loadData, loadPage, saveCurrentPage]
  );

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
};

export const useData = () => {
  const context = useContext(dataContext);
  if (context === undefined) {
    throw new Error("useData must be used within dataContextProvider");
  }
  return context;
};
