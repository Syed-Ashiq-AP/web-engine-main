import React, { ReactNode } from "react";

export const EditorTour = ({children}:{children:ReactNode}) => {
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
                        </TourProvider>;
};
