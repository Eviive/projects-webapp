"use client";

import type { SortingState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type TableOptions, useReactTable } from "@tanstack/react-table";
import { DataTablePagination } from "components/ui/data-table-pagination";
import { DataTableViewOptions } from "components/ui/data-table-view-options";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { useState } from "react";

type SuccessProps = {
    isError?: false;
};

type ErrorProps = {
    isError: true;
    errorMessage: string;
};

type DataTableProps<TData> = Pick<TableOptions<TData>, "columns" | "data"> & {
    noRowsMessage?: string;
    isSelectable?: boolean;
} & (SuccessProps | ErrorProps);

export const DataTable = <TData, >({ columns, data, ...props }: DataTableProps<TData>) => {

    const [ sorting, setSorting ] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting
    });

    return (
        <div className="flex flex-col gap-4">
            <DataTableViewOptions table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length
                            ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )
                            : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        {props.isError
                                            ? props.errorMessage
                                            : props.noRowsMessage ?? "No results."
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} isSelectable={props.isSelectable} />
        </div>
    );
};
