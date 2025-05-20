import { StepType, TourProvider } from "@reactour/tour";
import React, { ReactNode } from "react";
import { usePage } from "./page-provirder";

export const EditorTour = ({children}:{children:ReactNode}) => {
   const pageContext = usePage();
  if (!pageContext) return;
  const { setActiveMenu } = pageContext;

  const steps: StepType[] = [
    {
      selector: ".we_left_side_bar",
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
        console.log(elem)
        setActiveMenu('pages');
      },
    
    },
    {
      selector: ".we_left_side_bar",
      content: (
        <>
          <h5>Drag and Drop Blocks</h5>
          <span className="text-sm">
            You can drag blocks from the sidebar and drop them into the canvas to build your page layout. Arrange and customize them to design your content visually.
          </span>
        </>
      ),
      action: (elem) => {
        setActiveMenu('blocks');
      },
    },
    {
      selector: ".we_left_side_bar",
      content: (
        <>
          <h5>Element Layers Panel</h5>
          <span className="text-sm">
            This panel shows the hierarchical structure of all elements on the
            page. Use it to easily select, reorder, or manage nested elements.
          </span>
        </>
      ),
      action: (elem) => {
        setActiveMenu("layers");
      },
    },
    {
      selector: ".we_left_side_bar",
      content: (
        <>
          <h5>Custom CSS Classes</h5>
          <span className="text-sm">
                Create your own CSS classes and assign them to any block. This allows you to apply consistent styles across multiple elements with ease.
          </span>
        </>
      ),
      action: (elem) => {
        setActiveMenu('class');
      },
    },
    {
      selector: ".we_left_side_bar",
      content: (
        <>
          <h5>Add Animations</h5>
          <span className="text-sm">
                Bring your elements to life by creating animations. Customize how and when elements animate to enhance user interaction and visual appeal.
          </span>
        </>
      ),
      action: (elem) => {
        setActiveMenu('animation');
      },
    },
  ];
  return <TourProvider
                          styles={{
                            popover: (base) => ({
                              ...base,
                              backgroundColor: "#1e1e2f",
                              color: "#fff",
                              borderRadius: "16px",
                              padding: "20px 24px 20px 20px",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            }),
                            arrow: (base) => ({
                              ...base,
                              color: "white",
                            }),
                            close: (base) => ({
                              ...base,
                              color: "white",
                              top: "12px",
                              right: "12px",
                              fontSize: "18px",
                              zIndex: 2,
                            }),
                          }}
                          steps={steps}
                        >
                          {children}
                        </TourProvider>;
};
