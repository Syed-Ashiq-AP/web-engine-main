import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
export const Dock = ({
  children,
  show = false,
}: {
  children: ReactNode;
  show?: boolean;
}) => {
  const renderIcons = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === DockIcon) {
        const element = child as React.ReactElement<any>;

        return React.cloneElement(child, {
          ...element.props,
        });
      }
      return child;
    });
  };

  return (
    <div className="we_dock" style={{ left: `${show ? "8px" : "-85px"}` }}>
      {renderIcons()}
    </div>
  );
};

export const DockIcon = ({
  children,
  heading,
  active,
  onClick,
}: {
  children: ReactNode;
  heading: string;
  active?: boolean;
  onClick: Function;
}) => {
  return (
    <div
      className={cn("we_dock_icon", active && "we_dock_active")}
      onClick={() => {
        onClick();
      }}
    >
      <div>{children}</div>
      <span>{heading}</span>
    </div>
  );
};
