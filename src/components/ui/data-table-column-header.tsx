import type { Column } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "components/ui/dropdown-menu";
import { cn } from "libs/utils/style";
import type { HTMLAttributes } from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from "react-icons/lu";

type DataTableColumnHeaderProps<TData, TValue> = HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
};

export const DataTableColumnHeader = <TData, TValue>({
    column,
    title,
    className
}: DataTableColumnHeaderProps<TData, TValue>) => {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="data-[state=open]:bg-accent -ml-3 h-8"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" && (
                            <LuArrowDown className="ml-2 size-4" />
                        )}
                        {column.getIsSorted() === "asc" && <LuArrowUp className="ml-2 size-4" />}
                        {column.getIsSorted() === false && (
                            <LuChevronsUpDown className="ml-2 size-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onSelect={() => {
                            column.toggleSorting(false);
                        }}
                    >
                        <LuArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            column.toggleSorting(true);
                        }}
                    >
                        <LuArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => {
                            column.toggleVisibility(false);
                        }}
                    >
                        <AiFillEyeInvisible className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
