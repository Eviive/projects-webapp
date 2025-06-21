import { Button } from "components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "components/ui/select";
import type { FC } from "react";
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

interface SelectionProps {
    isSelectable: true;
    selectedRows: number;
    totalRows: number;
}

interface NoSelectionProps {
    isSelectable?: false;
}

type Props = {
    itemName?: string;
    pageSizeOptions?: readonly number[];
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
    const pageSizeOptions = new Set(props.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS);

    if (!pageSizeOptions.has(props.pageSize)) {
        pageSizeOptions.add(props.pageSize);
    }

    const itemName = props.itemName ?? "row";

    return (
        <div className="flex items-center justify-between px-2">
            {props.isSelectable && (
                <div className="text-muted-foreground hidden flex-1 text-sm md:block">
                    {props.selectedRows} of {props.totalRows} {itemName}(s) selected.
                </div>
            )}
            <div className="ms-auto flex flex-wrap items-center justify-end space-x-6 gap-y-2 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium first-letter:capitalize">
                        {itemName}s per page
                    </p>
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
                            {Array.from(pageSizeOptions)
                                .sort((a, b) => a - b)
                                .map(pageSize => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center text-sm font-medium">
                        {props.getPageCount() > 0
                            ? `Page ${props.pageIndex + 1} of ${props.getPageCount()}`
                            : "No pages available"}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => {
                                props.setPageIndex(0);
                            }}
                            disabled={!props.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <LuChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                props.previousPage();
                            }}
                            disabled={!props.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <LuChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                props.nextPage();
                            }}
                            disabled={!props.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <LuChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => {
                                props.setPageIndex(props.getPageCount() - 1);
                            }}
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
