import { createColumnHelper } from "@tanstack/react-table";
import { HttpStatusChip } from "components/health/HttpStatusChip/HttpStatusChip";
import { Button } from "components/ui/button";
import { DataTableColumnHeader } from "components/ui/data-table-column-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { AiFillEye } from "react-icons/ai";
import type { HttpExchange } from "types/health";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

const columnHelper = createColumnHelper<HttpExchange>();

export const getColumns = (openDetails: (httpExchange: HttpExchange) => void) => [
    columnHelper.accessor(
        row => new Date(row.timestamp),
        {
            id: "Date",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="Date" />,
            cell: ctx => (
                <span className="whitespace-nowrap">
                    {dateFormatter.format(ctx.getValue())}
                </span>
            ),
            sortingFn: "datetime"
        }
    ),
    columnHelper.accessor(
        "request.method",
        {
            id: "Method",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="Method" />
        }
    ),
    columnHelper.accessor(
        row => Math.trunc(parseFloat(row.timeTaken.substring(2, row.timeTaken.length - 1)) * 1000),
        {
            id: "Time Taken",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="Time Taken" />
        }
    ),
    columnHelper.accessor(
        "response.status",
        {
            id: "Status",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="Status" />,
            cell: code => (
                <HttpStatusChip code={code.getValue()} />
            )
        }
    ),
    columnHelper.accessor(
        row => new URL(row.request.uri).pathname,
        {
            id: "Path",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="Path" />
        }
    ),
    columnHelper.display(
        {
            id: "Details",
            header: ctx => <DataTableColumnHeader column={ctx.column} title="" />,
            cell: ({ row }) => (
                <div className="flex items-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="text-foreground-500 ms-auto"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openDetails(row.original)}
                                >
                                    <AiFillEye size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                View details
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
        }
    )
];
