import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContextMenuItemType = {
    label: string | ReactNode;
    className?: string;
    onClick: (event: React.MouseEvent) => void;
};

export const ContextMenuItem = ({
    label,
    className,
    onClick,
}: ContextMenuItemType) => {
    return (
        <span
            onClick={onClick}
            className={cn(
                "p-1 font-medium text-sm rounded-md cursor-pointer hover:bg-white hover:text-black ",
                className
            )}
        >
            {label}
        </span>
    );
};
