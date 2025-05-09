"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "./project-list";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Web Site",
  },
  {
    accessorKey: "edited",
    header: "Last Edited",
  },
];
