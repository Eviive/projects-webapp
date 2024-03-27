import { Button } from "components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import type { FC } from "react";
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

type SelectionProps = {
    isSelectable: true;
    selectedRows: number;
    totalRows: number;
};

type NoSelectionProps = {
    isSelectable?: false;
};

type Props = {
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    pageIndex: number;
    setPageIndex: (pageIndex: number) => void;
    getPageCount: () => number;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    previousPage: () => void;
    nextPage: () => void;
} & (SelectionProps | NoSelectionProps);

export const Pagination: FC<Props> = props => {
    return (
        <div className="flex items-center justify-between px-2">
            {props.isSelectable && (
                <div className="hidden flex-1 text-sm text-muted-foreground md:block">
                    {props.selectedRows} of {props.totalRows} row(s) selected.
                </div>
            )}
            <div className="flex justify-end items-center gap-y-2 flex-wrap space-x-6 lg:space-x-8 ms-auto">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${props.pageSize}`}
                        onValueChange={value => {
                            props.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={props.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[ 10, 20, 30, 40, 50 ].map(pageSize => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {props.pageIndex + 1} of {props.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => props.setPageIndex(0)}
                            disabled={!props.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <LuChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => props.previousPage()}
                            disabled={!props.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <LuChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => props.nextPage()}
                            disabled={!props.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <LuChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => props.setPageIndex(props.getPageCount() - 1)}
                            disabled={!props.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <LuChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
