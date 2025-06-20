"use client";

import * as React from "react";
import JSZip from "jszip";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProjectDocument } from "@/models/Project";
import { useSession } from "next-auth/react";
import { UserDocument } from "@/models/User";
import { sinceDate } from "@/lib/projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProjectList() {
  const router = useRouter();

  const [projectExports, setProjectExports] = React.useState<string[]>([]);

  const { data: session, status } = useSession();
  const user = session?.user as UserDocument;
  const email = user?.email;

  const [data, setData] = React.useState<ProjectDocument[]>([]);
  const fetchProjects = async () => {
    if (!email) return;
    const req = await fetch(`/api/projects/list?email=${email}`);
    const res = await req.json();
    if (res.success) {
      const projects: ProjectDocument[] = JSON.parse(res.projects);
      setData(projects);
    }
  };
  React.useEffect(() => {
    fetchProjects();
  }, [session]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const addProjectInput = React.useRef<HTMLInputElement | null>(null);

  const handleAddProject = async () => {
    if (!addProjectInput.current) return;
    const projectName = addProjectInput.current.value;
    if (projectName.length < 4) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name: projectName,
      }),
    });

    const data = await res.json();
    if (data.success) {
      addProjectInput.current.value = "";
      fetchProjects();
    }
  };

  const handleOpenProject = (row: ProjectDocument) => {
    const id = row._id;
    router.push(`/engine/${id}`);
  };

  const downloadFile = (name: string, data: any) => {
    const zip = new JSZip();

    const genZip = (folder: string | null, pageData: any) => {
      folder
        ? zip.folder(folder)?.file("index.html", pageData.html)
        : zip.file("index.html", pageData.html);
      folder
        ? zip.folder(folder)?.file("index.js", pageData.js)
        : zip.file("index.js", pageData.js);
      folder
        ? zip.folder(folder)?.file("index.css", pageData.styles)
        : zip.file("index.css", pageData.styles);
    };

    Object.entries(data).forEach(([folder, pageData]) => {
      genZip(folder === "index" ? null : folder, pageData);
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleExportProject = (id: string, name: string) => {
    setProjectExports((prev) => [...prev, id]);
    const exportProject = async () => {
      const req = await fetch(`/api/projects/export?id=${id}`);
      if (req.ok) {
        const res = await req.json();
        if (res.success) {
          const data = res.projectExport;
          downloadFile(name, data);
        }
      }
    };
    const promise = () =>
      new Promise((resolve) => exportProject().then(() => resolve({})));

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        setProjectExports((prev) => prev.filter((e) => e !== id));
        return `Project exported`;
      },
      error: "Error",
    });
  };

  const columns: ColumnDef<ProjectDocument>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Web Site",
      cell: ({ row }) => (
        <div
          className="lowercase"
          onClick={() => handleOpenProject(row.original)}
        >
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Edited",
      cell: ({ row }) => (
        <div className="capitalize">{sinceDate(row.getValue("updatedAt"))}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { _id: id, name } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/preview/${id}/`)}>
                <span>Preview</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={projectExports.includes(id)}
                onClick={() => handleExportProject(id, name)}
              >
                <span>Export</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-destructive">Trash</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="flex h-full sm:m-5 p-5 rounded-lg border">
      <div className="w-full">
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:items-center py-4 justify-between">
          <Input
            placeholder="Filter Websites..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-full sm:max-w-sm"
          />
          <div className="flex gap-4">
            <Input ref={addProjectInput} placeholder="Enter Porject Name" />
            <Button
              onClick={handleAddProject}
              variant={"ghost"}
              className="flex items-center"
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className=" cursor-pointer"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div>
            <Button
              className={cn(
                "cursor-pointer",
                Object.keys(rowSelection).length !== data.length && " invisible"
              )}
              variant={"ghost"}
            >
              <Trash />
              <span>Trash</span>
            </Button>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
