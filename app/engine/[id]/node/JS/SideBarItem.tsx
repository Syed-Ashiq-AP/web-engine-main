import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const SideBarItem = ({ children, className, ...props }: any) => {
    return (
        <div
            className={cn("flex p-2 rounded-md font-medium", className)}
            {...props}
        >
            {children}
        </div>
    );
};
